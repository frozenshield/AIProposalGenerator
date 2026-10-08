<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Jobs\LearnFromWonProposalJob;
use App\Models\CatalogItem;
use App\Models\Client;
use App\Models\Proposal;
use App\Models\ProposalSection;
use App\Services\GeminiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery\MockInterface;
use Tests\TestCase;

class ProposalTest extends TestCase
{
    use RefreshDatabase;

    protected Client $client;
    protected CatalogItem $catalogItem1;
    protected CatalogItem $catalogItem2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->client = Client::create([
            'name' => 'Sarah Jenkins',
            'company' => 'Apex Retail Solutions',
            'role' => 'CTO',
            'email' => 's.jenkins@apexretail.io',
            'industry' => 'E-Commerce & Retail',
        ]);

        $this->catalogItem1 = CatalogItem::create([
            'name' => 'AI Automated Workflow Engine',
            'category' => 'Artificial Intelligence',
            'unit_price' => 10000.00,
            'unit' => 'Deployment',
            'default_quantity' => 1,
        ]);

        $this->catalogItem2 = CatalogItem::create([
            'name' => '24/7 Dedicated Support SLA',
            'category' => 'Managed Services',
            'unit_price' => 2000.00,
            'unit' => 'Month',
            'default_quantity' => 2,
        ]);
    }

    public function test_can_render_proposal_create_screen_with_clients_and_catalog(): void
    {
        $response = $this->get(route('proposals.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Proposals/Create')
            ->has('clients', 1)
            ->has('catalogItems', 2)
            ->where('clients.0.company', 'Apex Retail Solutions')
        );
    }

    public function test_store_proposal_validates_required_fields(): void
    {
        $response = $this->postJson(route('proposals.store'), []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['client_id', 'ai_prompt_context', 'items']);
    }

    public function test_store_proposal_validates_prompt_length_limit(): void
    {
        $payload = [
            'client_id' => $this->client->id,
            'ai_prompt_context' => str_repeat('A', 1001), // exceeds 1000 chars
            'items' => [
                [
                    'catalog_item_id' => $this->catalogItem1->id,
                    'quantity' => 1,
                ],
            ],
        ];

        $response = $this->postJson(route('proposals.store'), $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['ai_prompt_context']);
    }

    public function test_store_proposal_executes_service_and_redirects_to_show(): void
    {
        // Mock GeminiService to simulate embedding & text generation responses
        $this->mock(GeminiService::class, function (MockInterface $mock) {
            $dummyVector = array_fill(0, 768, 0.05);

            $mock->shouldReceive('generateEmbedding')
                ->once()
                ->andReturn($dummyVector);

            $mock->shouldReceive('generateContent')
                ->once()
                ->andReturn([
                    'executive_summary' => 'This is an AI-generated executive summary tailored to Apex Retail Solutions.',
                    'scope_and_timeline' => [
                        [
                            'title' => 'Phase 1: Architecture Discovery',
                            'duration' => 'Weeks 1-2',
                            'description' => 'System audit and pipeline mapping.',
                            'deliverable' => 'Architecture blueprint',
                        ],
                    ],
                    'closing' => 'We are excited to partner with you.',
                ]);
        });

        $payload = [
            'client_id' => $this->client->id,
            'title' => 'Retail AI Modernization Pitch',
            'ai_prompt_context' => 'Accelerated cost savings and 6-month ROI.',
            'ai_tone' => 'persuasive',
            'tax_rate' => 10.0,
            'valid_days' => 45,
            'items' => [
                [
                    'catalog_item_id' => $this->catalogItem1->id,
                    'quantity' => 1,
                    'discount' => 10.0, // 10% discount on $10,000 = $9,000
                ],
                [
                    'catalog_item_id' => $this->catalogItem2->id,
                    'quantity' => 2,
                    'discount' => 0.0, // $4,000
                ],
            ],
        ];

        $response = $this->post(route('proposals.store'), $payload);

        $proposal = Proposal::first();
        $this->assertNotNull($proposal);
        $response->assertRedirect(route('proposals.show', $proposal));
        $response->assertSessionHas('status');

        // Verify database records
        $this->assertDatabaseHas('proposals', [
            'id' => $proposal->id,
            'client_id' => $this->client->id,
            'status' => 'draft',
            'subtotal' => 14000.00,
            'total_discount' => 1000.00,
            'discounted_subtotal' => 13000.00,
            'tax_amount' => 1300.00,
            'grand_total' => 14300.00,
        ]);

        $this->assertDatabaseCount('proposal_line_items', 2);
        $this->assertDatabaseCount('proposal_sections', 3);

        $this->assertDatabaseHas('proposal_sections', [
            'proposal_id' => $proposal->id,
            'section_key' => ProposalSection::SECTION_EXECUTIVE_SUMMARY,
        ]);
    }

    public function test_show_proposal_renders_inertia_view(): void
    {
        $proposal = Proposal::create([
            'client_id' => $this->client->id,
            'proposal_number' => 'PROP-2026-001',
            'title' => 'Sample Proposal',
            'status' => 'draft',
            'ai_prompt_context' => 'Test context',
            'grand_total' => 5000.00,
        ]);

        $proposal->sections()->create([
            'section_key' => ProposalSection::SECTION_EXECUTIVE_SUMMARY,
            'title' => 'Executive Summary',
            'content' => 'Summary text',
            'order_index' => 1,
        ]);

        $response = $this->get(route('proposals.show', $proposal));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Proposals/Show')
            ->has('proposal')
            ->where('proposal.id', $proposal->id)
            ->has('proposal.sections', 1)
        );
    }

    public function test_update_status_transitions_and_dispatches_learning_job_when_won(): void
    {
        Queue::fake();

        $proposal = Proposal::create([
            'client_id' => $this->client->id,
            'proposal_number' => 'PROP-2026-002',
            'title' => 'Closing Pitch',
            'status' => 'sent',
            'ai_prompt_context' => 'Test won context',
            'grand_total' => 20000.00,
        ]);

        $response = $this->patch(route('proposals.status.update', $proposal), [
            'status' => 'won',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('proposals', [
            'id' => $proposal->id,
            'status' => 'won',
        ]);

        Queue::assertPushed(LearnFromWonProposalJob::class, function ($job) use ($proposal) {
            return $job->proposal->id === $proposal->id;
        });
    }

    public function test_update_status_blocks_illegal_transitions(): void
    {
        $proposal = Proposal::create([
            'client_id' => $this->client->id,
            'proposal_number' => 'PROP-2026-003',
            'title' => 'Won Deal',
            'status' => 'won', // Won is a terminal state
            'ai_prompt_context' => 'Immutable',
        ]);

        // Attempting to move from won back to draft should fail validation
        $response = $this->patchJson(route('proposals.status.update', $proposal), [
            'status' => 'draft',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['status']);
    }
}

