<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Proposal;
use App\Services\ProposalGenerationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Throwable;

class GenerateProposalPitchJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 2;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 240;

    /**
     * Create a new job instance.
     *
     * @param Proposal $proposal
     * @param array<string, mixed> $data
     */
    public function __construct(
        public Proposal $proposal,
        public array $data
    ) {}

    /**
     * Execute the job.
     */
    public function handle(ProposalGenerationService $service): void
    {
        Log::info("Executing GenerateProposalPitchJob for proposal #{$this->proposal->proposal_number}");

        $service->generatePitch($this->proposal, $this->data);
    }

    /**
     * Handle a job failure.
     */
    public function failed(?Throwable $exception): void
    {
        Log::error("GenerateProposalPitchJob failed for proposal #{$this->proposal->proposal_number}", [
            'proposal_id' => $this->proposal->id,
            'error' => $exception?->getMessage(),
        ]);

        $this->proposal->update([
            'notes' => 'AI Generation failed: ' . ($exception?->getMessage() ?? 'Unknown error'),
        ]);
    }
}

