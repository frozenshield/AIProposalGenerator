<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProposalRequest;
use App\Http\Requests\UpdateProposalStatusRequest;
use App\Jobs\LearnFromWonProposalJob;
use App\Models\CatalogItem;
use App\Models\Client;
use App\Models\Proposal;
use App\Services\ProposalGenerationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ProposalController extends Controller
{
    public function __construct(
        protected ProposalGenerationService $generationService
    ) {}

    /**
     * Display a listing of all proposals.
     */
    public function index(Request $request): Response
    {
        $proposals = Proposal::with(['client', 'lineItems', 'sections'])
            ->latest()
            ->get();

        $clients = Client::all();
        $catalog = CatalogItem::all();

        return Inertia::render('Proposals/Index', [
            'proposals' => $proposals,
            'clients' => $clients,
            'catalog' => $catalog,
        ]);
    }

    /**
     * Show the form for creating a new AI proposal.
     */
    public function create(): Response
    {
        $clients = Client::orderBy('name')->get();
        $catalogItems = CatalogItem::orderBy('category')->orderBy('name')->get();

        return Inertia::render('Proposals/Create', [
            'clients' => $clients,
            'catalogItems' => $catalogItems,
        ]);
    }

    /**
     * Store a newly created proposal, invoke AI generation, and redirect to show route.
     * Enforces freemium quota: non-subscribed users are capped at 3 proposals.
     */
    public function store(StoreProposalRequest $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();

        // 1. Freemium quota check: non-subscribed users are limited to 3 proposals
        if ($user && ! $user->is_subscribed && $user->proposals_count >= 3) {
            return response()->json([
                'error' => 'limit_reached',
                'message' => 'Free tier limit reached. You can only create up to 3 proposals on the free plan.',
                'proposals_count' => $user->proposals_count,
                'limit' => 3,
                'is_subscribed' => false,
            ], 403);
        }

        // Demo / Guest session fallback if running without mandatory authentication
        if (! $user) {
            $sessionCount = (int) $request->session()->get('proposals_count', 0);
            if ($sessionCount >= 3) {
                return response()->json([
                    'error' => 'limit_reached',
                    'message' => 'Free tier limit reached. You have created 3 proposals. Please upgrade to Pro.',
                    'proposals_count' => $sessionCount,
                    'limit' => 3,
                    'is_subscribed' => false,
                ], 403);
            }
        }

        $validated = $request->validated();

        $proposalNumber = 'PROP-' . date('Y') . '-' . str_pad((string) (Proposal::max('id') + 1), 3, '0', STR_PAD_LEFT);
        $title = $validated['title'] ?? 'Strategic AI Transformation Proposal (' . date('M Y') . ')';

        $proposal = Proposal::create([
            'client_id' => $validated['client_id'],
            'proposal_number' => $proposalNumber,
            'title' => $title,
            'status' => Proposal::STATUS_DRAFT,
            'ai_prompt_context' => $validated['ai_prompt_context'],
            'ai_tone' => $validated['ai_tone'] ?? 'persuasive',
            'target_audience' => $validated['target_audience'] ?? 'C-Suite & Executive Leadership',
            'tax_rate' => $validated['tax_rate'] ?? 0.0,
            'valid_days' => $validated['valid_days'] ?? 30,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Increment the user or session proposals count
        if ($user) {
            $user->increment('proposals_count');
        } else {
            $request->session()->increment('proposals_count');
        }

        try {
            $this->generationService->generatePitch($proposal, $validated);

            if ($request->wantsJson()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Proposal and AI pitch generated successfully.',
                    'proposal' => $proposal->load(['client', 'sections', 'lineItems']),
                    'redirect' => route('proposals.show', $proposal),
                ], 201);
            }

            return redirect()
                ->route('proposals.show', $proposal)
                ->with('status', 'Proposal and AI pitch generated successfully.');
        } catch (Throwable $e) {
            Log::error("Failed to generate AI pitch for proposal #{$proposal->proposal_number}", [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'status' => 'partial_success',
                    'message' => 'Proposal created, but AI generation encountered an error: ' . $e->getMessage(),
                    'proposal' => $proposal,
                    'redirect' => route('proposals.show', $proposal),
                ], 200);
            }

            return redirect()
                ->route('proposals.show', $proposal)
                ->with('warning', 'Proposal created, but AI generation encountered an error: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified proposal with eager-loaded sections and line items.
     */
    public function show(Proposal $proposal): Response
    {
        $proposal->load([
            'client',
            'sections',
            'lineItems.catalogItem',
        ]);

        return Inertia::render('Proposals/Show', [
            'proposal' => $proposal,
        ]);
    }

    /**
     * Update the proposal status. Dispatches knowledge ingestion if marked as 'won'.
     */
    public function updateStatus(UpdateProposalStatusRequest $request, Proposal $proposal): RedirectResponse
    {
        $newStatus = (string) $request->validated('status');
        $oldStatus = $proposal->status;

        $proposal->update(['status' => $newStatus]);

        if ($newStatus === Proposal::STATUS_WON && $oldStatus !== Proposal::STATUS_WON) {
            // Asynchronously learn from the won proposal to build domain RAG memory
            LearnFromWonProposalJob::dispatch($proposal);

            return redirect()
                ->back()
                ->with('status', 'Proposal marked as WON! Ingesting winning pitch into pgvector knowledge base.');
        }

        return redirect()
            ->back()
            ->with('status', "Proposal status updated to '{$newStatus}'.");
    }
}

