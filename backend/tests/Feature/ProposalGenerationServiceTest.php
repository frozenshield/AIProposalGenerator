<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\Client;
use App\Models\Proposal;
use App\Models\ProposalSection;
use App\Models\SuccessfulPitchEmbedding;
use App\Services\GeminiService;
use App\Services\ProposalGenerationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class ProposalGenerationServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_learn_from_won_proposal_creates_embeddings(): void
    {
        $client = Client::create([
            'name' => 'Elena Rostova',
            'company' => 'FinVanguard Global',
            'role' => 'Director',
            'email' => 'elena@finvanguard.com',
            'industry' => 'Financial Services & FinTech',
        ]);

        $proposal = Proposal::create([
            'client_id' => $client->id,
            'proposal_number' => 'PROP-2026-WIN',
            'title' => 'Won FinTech Architecture Pitch',
            'status' => Proposal::STATUS_WON,
            'ai_prompt_context' => 'Multi-region disaster recovery and high availability.',
        ]);

        ProposalSection::create([
            'proposal_id' => $proposal->id,
            'section_key' => ProposalSection::SECTION_EXECUTIVE_SUMMARY,
            'title' => 'Executive Summary',
            'content' => 'This winning pitch delivers multi-region active-active failover with sub-millisecond data replication across primary banking nodes.',
            'order_index' => 1,
        ]);

        // Mock Gemini embedding response
        $this->mock(GeminiService::class, function (MockInterface $mock) {
            $dummyVector = array_fill(0, 768, 0.08);

            $mock->shouldReceive('generateEmbedding')
                ->atLeast()->once()
                ->andReturn($dummyVector);
        });

        $service = app(ProposalGenerationService::class);
        $service->learnFromWonProposal($proposal);

        $this->assertDatabaseHas('successful_pitch_embeddings', [
            'proposal_id' => $proposal->id,
            'industry' => 'Financial Services & FinTech',
        ]);

        $savedEmbedding = SuccessfulPitchEmbedding::where('proposal_id', $proposal->id)->first();
        $this->assertNotNull($savedEmbedding);
        $this->assertNotNull($savedEmbedding->embedding);
        $this->assertStringContainsString('multi-region active-active failover', $savedEmbedding->text_chunk);
    }
}

