<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\GeminiApiException;
use App\Models\CatalogItem;
use App\Models\Proposal;
use App\Models\ProposalLineItem;
use App\Models\ProposalSection;
use App\Models\SuccessfulPitchEmbedding;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Pgvector\Laravel\Vector;
use Throwable;

class ProposalGenerationService
{
    public function __construct(
        protected GeminiService $geminiService
    ) {}

    /**
     * Generate the complete pitch for a proposal using RAG and Gemini 2.5 Pro.
     *
     * @param Proposal $proposal
     * @param array<string, mixed> $data
     * @return Proposal
     * @throws GeminiApiException|Throwable
     */
    public function generatePitch(Proposal $proposal, array $data): Proposal
    {
        return DB::transaction(function () use ($proposal, $data) {
            // a. Compute total pricing and save ProposalLineItems
            $this->syncLineItemsAndTotals($proposal, $data);

            // b. Generate embedding vector for the prompt context using Gemini embedding API
            $promptContext = $proposal->ai_prompt_context;
            $embeddingValues = $this->geminiService->generateEmbedding(
                text: $promptContext,
                model: (string) config('services.gemini.models.embedding', 'gemini-embedding-2')
            );

            // c. Run cosine similarity search against successful_pitch_embeddings in pgvector
            $similarPitches = $this->findSimilarSuccessfulPitches($embeddingValues);

            // d. Construct prompt with client metadata, pricing summary, and top retrieved successful pitches
            $generationPrompt = $this->buildPitchPrompt($proposal, $similarPitches);

            // e. Call Gemini 2.5 Pro to generate three modular sections: executive_summary, scope_and_timeline, closing
            $sectionsPayload = $this->generateModularSections($generationPrompt);

            // f. Store each section in proposal_sections
            $this->storeProposalSections($proposal, $sectionsPayload);

            return $proposal->fresh(['client', 'sections', 'lineItems']);
        });
    }

    /**
     * Compute total pricing and save ProposalLineItems.
     *
     * @param Proposal $proposal
     * @param array<string, mixed> $data
     */
    protected function syncLineItemsAndTotals(Proposal $proposal, array $data): void
    {
        $rawItems = $data['items'] ?? [];
        $catalogItemIds = array_column($rawItems, 'catalog_item_id');
        $catalogMap = CatalogItem::whereIn('id', $catalogItemIds)->get()->keyBy('id');

        // Clean existing line items if re-generating
        $proposal->lineItems()->delete();

        $subtotal = 0.0;
        $totalDiscountAmount = 0.0;

        foreach ($rawItems as $itemInput) {
            $catId = (int) $itemInput['catalog_item_id'];
            /** @var CatalogItem|null $catalogItem */
            $catalogItem = $catalogMap->get($catId);

            $name = $catalogItem ? $catalogItem->name : "Deliverable #{$catId}";
            $category = $catalogItem?->category ?? 'General';
            $description = $catalogItem?->description ?? null;
            $unitPrice = $catalogItem ? (float) $catalogItem->unit_price : 0.0;
            $quantity = (int) ($itemInput['quantity'] ?? 1);
            $discountPercent = (float) ($itemInput['discount'] ?? 0.0);

            $grossLine = $unitPrice * $quantity;
            $lineDiscount = $grossLine * ($discountPercent / 100.0);
            $lineTotal = round($grossLine - $lineDiscount, 2);

            $subtotal += $grossLine;
            $totalDiscountAmount += $lineDiscount;

            $proposal->lineItems()->create([
                'catalog_item_id' => $catId,
                'name' => $name,
                'description' => $description,
                'category' => $category,
                'unit_price' => $unitPrice,
                'quantity' => $quantity,
                'discount' => $discountPercent,
                'total' => $lineTotal,
            ]);
        }

        $discountedSubtotal = max(0.0, $subtotal - $totalDiscountAmount);
        $taxRate = (float) ($data['tax_rate'] ?? $proposal->tax_rate ?? 0.0);
        $taxAmount = round($discountedSubtotal * ($taxRate / 100.0), 2);
        $grandTotal = round($discountedSubtotal + $taxAmount, 2);

        $proposal->update([
            'subtotal' => round($subtotal, 2),
            'total_discount' => round($totalDiscountAmount, 2),
            'discounted_subtotal' => round($discountedSubtotal, 2),
            'tax_rate' => $taxRate,
            'tax_amount' => $taxAmount,
            'grand_total' => $grandTotal,
            'status' => Proposal::STATUS_DRAFT,
        ]);
    }

    /**
     * Run cosine similarity search against successful_pitch_embeddings in pgvector:
     * DB::select("SELECT text_chunk, 1 - (embedding <=> ?::vector) AS similarity FROM successful_pitch_embeddings ORDER BY similarity DESC LIMIT 3")
     *
     * @param array<float> $embeddingValues
     * @return array<int, string>
     */
    protected function findSimilarSuccessfulPitches(array $embeddingValues): array
    {
        $vectorString = '[' . implode(',', $embeddingValues) . ']';

        try {
            if (DB::getDriverName() === 'pgsql') {
                $results = DB::select(
                    "SELECT text_chunk, 1 - (embedding <=> ?::vector) AS similarity FROM successful_pitch_embeddings WHERE embedding IS NOT NULL ORDER BY similarity DESC LIMIT 3",
                    [$vectorString]
                );

                return array_map(fn ($row) => (string) $row->text_chunk, $results);
            }

            // Fallback for non-pg drivers (e.g. SQLite test environment)
            /** @var array<int, string> $fallback */
            $fallback = DB::table('successful_pitch_embeddings')
                ->limit(3)
                ->pluck('text_chunk')
                ->all();

            return $fallback;
        } catch (Throwable $e) {
            Log::warning('Vector similarity search encountered an error, proceeding without RAG few-shot context', [
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Construct a prompt including client metadata, pricing summary, and top retrieved successful pitches.
     *
     * @param Proposal $proposal
     * @param array<int, string> $similarPitches
     * @return string
     */
    protected function buildPitchPrompt(Proposal $proposal, array $similarPitches): string
    {
        $proposal->loadMissing(['client', 'lineItems']);
        $client = $proposal->client;

        $clientMetadata = [
            'name' => $client->name,
            'company' => $client->company,
            'role' => $client->role ?? 'Decision Maker',
            'industry' => $client->industry ?? 'General Technology',
            'address' => $client->address,
        ];

        $deliverablesList = $proposal->lineItems->map(function (ProposalLineItem $item) {
            return "- {$item->name} (Qty: {$item->quantity}, Unit: \${$item->unit_price}, Subtotal: \${$item->total}) - {$item->description}";
        })->implode("\n");

        $pricingSummary = [
            'subtotal' => '$' . number_format((float) $proposal->subtotal, 2),
            'discount' => '-$' . number_format((float) $proposal->total_discount, 2),
            'tax' => '$' . number_format((float) $proposal->tax_amount, 2),
            'grand_total' => '$' . number_format((float) $proposal->grand_total, 2),
        ];

        $fewShotSection = '';
        if (!empty($similarPitches)) {
            $fewShotSection = "### TOP RETRIEVED HISTORICAL WON PITCHES (REFERENCE STYLE & TONE):\n";
            foreach ($similarPitches as $index => $chunk) {
                $num = $index + 1;
                $fewShotSection .= "[Reference Won Snippet #{$num}]\n{$chunk}\n\n";
            }
        }

        return <<<PROMPT
You are a world-class enterprise sales engineer and proposal strategist.
Draft a high-converting, tailored proposal response for the following client.

### CLIENT PROFILE:
- Name: {$clientMetadata['name']}
- Company: {$clientMetadata['company']}
- Title: {$clientMetadata['role']}
- Industry: {$clientMetadata['industry']}

### STRATEGIC DIRECTIVE / CONTEXT:
"{$proposal->ai_prompt_context}"

### PROPOSAL PARAMETERS:
- Tone: {$proposal->ai_tone}
- Target Audience: {$proposal->target_audience}
- Valid For: {$proposal->valid_days} days

### ATTACHED DELIVERABLES & PRICING:
{$deliverablesList}

### FINANCIAL SUMMARY:
- Gross Subtotal: {$pricingSummary['subtotal']}
- Applied Discount: {$pricingSummary['discount']}
- Taxes: {$pricingSummary['tax']}
- Grand Total: {$pricingSummary['grand_total']}

{$fewShotSection}

Generate three distinct, modular sections in valid JSON:
1. "executive_summary": A compelling 2-3 paragraph C-suite pitch addressing the client's strategic goals and expected ROI.
2. "scope_and_timeline": An array of structured milestone phases. Each phase item must contain:
   - "title" (e.g., "Phase 1: Architecture Discovery & Agent Orchestration")
   - "duration" (e.g., "Weeks 1 – 3")
   - "description" (Clear breakdown of activities)
   - "deliverable" (Concrete tangible milestone outcome)
3. "closing": A closing agreement section outlining engagement kick-off, milestones, SLA terms, and acceptance guarantee.
PROMPT;
    }

    /**
     * Call Gemini 2.5 Pro to generate three modular sections.
     *
     * @param string $prompt
     * @return array<string, mixed>
     * @throws GeminiApiException
     */
    protected function generateModularSections(string $prompt): array
    {
        $schema = [
            'type' => 'OBJECT',
            'properties' => [
                'executive_summary' => [
                    'type' => 'STRING',
                    'description' => 'Persuasive executive summary tailored to the client industry and goals.',
                ],
                'scope_and_timeline' => [
                    'type' => 'ARRAY',
                    'description' => 'Sequential phases defining work breakdown, timelines, and deliverables.',
                    'items' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'title' => ['type' => 'STRING'],
                            'duration' => ['type' => 'STRING'],
                            'description' => ['type' => 'STRING'],
                            'deliverable' => ['type' => 'STRING'],
                        ],
                        'required' => ['title', 'duration', 'description', 'deliverable'],
                    ],
                ],
                'closing' => [
                    'type' => 'STRING',
                    'description' => 'Commercial closing terms, billing schedule, and sign-off call-to-action.',
                ],
            ],
            'required' => ['executive_summary', 'scope_and_timeline', 'closing'],
        ];

        /** @var array<string, mixed> $response */
        $response = $this->geminiService->generateContent(
            prompt: $prompt,
            model: (string) config('services.gemini.models.pro', 'gemini-2.5-pro'),
            responseSchema: $schema,
            systemInstruction: 'You produce polished, high-value B2B proposals that win enterprise contracts. Output strictly according to the defined JSON schema.',
            temperature: 0.65
        );

        return $response;
    }

    /**
     * Store each generated section in proposal_sections.
     *
     * @param Proposal $proposal
     * @param array<string, mixed> $payload
     */
    protected function storeProposalSections(Proposal $proposal, array $payload): void
    {
        $proposal->sections()->delete();

        // 1. Executive Summary
        $execSummary = (string) ($payload['executive_summary'] ?? '');
        $proposal->sections()->create([
            'section_key' => ProposalSection::SECTION_EXECUTIVE_SUMMARY,
            'title' => 'Executive Summary',
            'content' => $execSummary,
            'order_index' => 1,
        ]);

        // 2. Scope & Timeline (saved as JSON string or formatted content)
        $scopeData = $payload['scope_and_timeline'] ?? [];
        $scopeContent = is_array($scopeData) ? json_encode($scopeData, JSON_PRETTY_PRINT) : (string) $scopeData;
        $proposal->sections()->create([
            'section_key' => ProposalSection::SECTION_SCOPE_AND_TIMELINE,
            'title' => 'Scope of Work & Timeline',
            'content' => $scopeContent,
            'order_index' => 2,
        ]);

        // 3. Closing
        $closing = (string) ($payload['closing'] ?? '');
        $proposal->sections()->create([
            'section_key' => ProposalSection::SECTION_CLOSING,
            'title' => 'Terms & Acceptance',
            'content' => $closing,
            'order_index' => 3,
        ]);
    }

    /**
     * Learn from a won proposal: chunk sections, generate embeddings, and store in pgvector.
     *
     * @param Proposal $proposal
     */
    public function learnFromWonProposal(Proposal $proposal): void
    {
        $proposal->loadMissing(['sections', 'client']);
        $industry = $proposal->client?->industry ?? 'General Technology';

        Log::info("Learning from won proposal #{$proposal->proposal_number}", [
            'proposal_id' => $proposal->id,
            'industry' => $industry,
        ]);

        foreach ($proposal->sections as $section) {
            $chunks = $this->chunkSectionContent($section);

            foreach ($chunks as $chunk) {
                if (mb_strlen(trim($chunk)) < 50) {
                    continue;
                }

                try {
                    $embedding = $this->geminiService->generateEmbedding(
                        text: $chunk,
                        model: (string) config('services.gemini.models.embedding', 'gemini-embedding-2')
                    );

                    SuccessfulPitchEmbedding::create([
                        'proposal_id' => $proposal->id,
                        'text_chunk' => $chunk,
                        'embedding' => new Vector($embedding),
                        'industry' => $industry,
                        'metadata' => [
                            'proposal_number' => $proposal->proposal_number,
                            'client_company' => $proposal->client?->company,
                            'section_key' => $section->section_key,
                            'section_title' => $section->title,
                        ],
                    ]);
                } catch (Throwable $e) {
                    Log::error("Failed to generate embedding for won proposal chunk", [
                        'proposal_id' => $proposal->id,
                        'chunk' => mb_substr($chunk, 0, 100),
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }
    }

    /**
     * Divide a section into semantic text chunks suitable for RAG embedding.
     *
     * @param ProposalSection $section
     * @return array<int, string>
     */
    protected function chunkSectionContent(ProposalSection $section): array
    {
        $raw = $section->content;

        // If JSON array of scope phases
        if (str_starts_with(trim($raw), '[') || str_starts_with(trim($raw), '{')) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $chunks = [];
                foreach ($decoded as $phase) {
                    if (is_array($phase)) {
                        $title = $phase['title'] ?? 'Milestone';
                        $duration = $phase['duration'] ?? '';
                        $desc = $phase['description'] ?? '';
                        $deliverable = $phase['deliverable'] ?? '';
                        $chunks[] = "### {$title} ({$duration})\n{$desc}\nDeliverable: {$deliverable}";
                    }
                }
                if (!empty($chunks)) {
                    return $chunks;
                }
            }
        }

        // Otherwise chunk by paragraphs
        $paragraphs = preg_split('/\n\s*\n/', trim($raw));
        if ($paragraphs === false || empty($paragraphs)) {
            return [$raw];
        }

        return array_values(array_filter(array_map('trim', $paragraphs)));
    }
}

