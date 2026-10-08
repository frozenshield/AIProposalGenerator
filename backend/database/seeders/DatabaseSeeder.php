<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\CatalogItem;
use App\Models\Client;
use App\Models\Proposal;
use App\Models\ProposalLineItem;
use App\Models\ProposalSection;
use App\Models\SuccessfulPitchEmbedding;
use App\Models\User;
use Illuminate\Database\Seeder;
use Pgvector\Laravel\Vector;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with enterprise clients, catalog items, and won pitch embeddings.
     */
    public function run(): void
    {
        // 1. Seed Default Admin User
        User::firstOrCreate(
            ['email' => 'admin@aiproposals.io'],
            [
                'name' => 'Lead Solutions Architect',
                'password' => bcrypt('password123'),
            ]
        );

        // 2. Seed Enterprise Clients
        $clientsData = [
            [
                'name' => 'Sarah Jenkins',
                'company' => 'Apex Retail Solutions',
                'role' => 'Chief Technology Officer',
                'email' => 's.jenkins@apexretail.io',
                'phone' => '+1 (555) 349-8821',
                'industry' => 'E-Commerce & Retail',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                'address' => '742 Evergreen Blvd, San Francisco, CA 94107',
            ],
            [
                'name' => 'David Chen',
                'company' => 'OmniHealth Technologies',
                'role' => 'VP of Digital Transformation',
                'email' => 'd.chen@omnihealth.org',
                'phone' => '+1 (555) 782-9903',
                'industry' => 'Healthcare & Biotech',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'address' => '120 Innovation Way, Boston, MA 02110',
            ],
            [
                'name' => 'Elena Rostova',
                'company' => 'FinVanguard Global',
                'role' => 'Director of Strategic Ops',
                'email' => 'elena.r@finvanguard.com',
                'phone' => '+1 (555) 912-3456',
                'industry' => 'Financial Services & FinTech',
                'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                'address' => '350 Park Ave, New York, NY 10022',
            ],
            [
                'name' => 'Marcus Sterling',
                'company' => 'LogiFlow Supply Corp',
                'role' => 'Chief Operating Officer',
                'email' => 'msterling@logiflow.net',
                'phone' => '+1 (555) 438-2190',
                'industry' => 'Supply Chain & Logistics',
                'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                'address' => '880 Logistics Parkway, Chicago, IL 60607',
            ],
        ];

        $clients = [];
        foreach ($clientsData as $c) {
            $clients[] = Client::firstOrCreate(['email' => $c['email']], $c);
        }

        // 3. Seed Deliverables Master Catalog
        $catalogItemsData = [
            [
                'name' => 'AI Automated Workflow Engine',
                'description' => 'End-to-end autonomous agent workflow pipeline integration with existing ERP/CRM.',
                'category' => 'Artificial Intelligence',
                'unit_price' => 12500.00,
                'unit' => 'Deployment',
                'default_quantity' => 1,
            ],
            [
                'name' => 'Enterprise Cloud Modernization',
                'description' => 'Zero-downtime microservices containerization, multi-cloud failover, and infra optimization.',
                'category' => 'Cloud Architecture',
                'unit_price' => 18000.00,
                'unit' => 'Phase',
                'default_quantity' => 1,
            ],
            [
                'name' => 'Custom Domain LLM Fine-Tuning',
                'description' => 'Proprietary dataset ingestion, safety evaluation guardrails, and on-premise private deployment.',
                'category' => 'Machine Learning',
                'unit_price' => 9500.00,
                'unit' => 'Model Package',
                'default_quantity' => 1,
            ],
            [
                'name' => 'Security & Compliance Audit Suite',
                'description' => 'SOC2 Type II, HIPAA, and GDPR automated threat vector inspection and hardening.',
                'category' => 'Cybersecurity',
                'unit_price' => 6200.00,
                'unit' => 'Audit Report',
                'default_quantity' => 1,
            ],
            [
                'name' => 'Next-Gen UX/UI Product Redesign',
                'description' => 'Human-centric responsive design system, WCAG AA accessibility, interactive prototypes.',
                'category' => 'Product Design',
                'unit_price' => 7800.00,
                'unit' => 'Sprint (2 Wks)',
                'default_quantity' => 2,
            ],
            [
                'name' => '24/7 Dedicated Support SLA & SRE',
                'description' => '15-minute response guarantee, continuous health telemetry, and dedicated solutions architect.',
                'category' => 'Managed Services',
                'unit_price' => 2400.00,
                'unit' => 'Month',
                'default_quantity' => 3,
            ],
        ];

        $catalog = [];
        foreach ($catalogItemsData as $item) {
            $catalog[] = CatalogItem::firstOrCreate(['name' => $item['name']], $item);
        }

        // 4. Seed Historical Won Proposals & pgvector Embeddings for Few-Shot RAG
        $wonProposal = Proposal::firstOrCreate(
            ['proposal_number' => 'PROP-2026-880'],
            [
                'client_id' => $clients[0]->id,
                'title' => 'Enterprise Cloud Modernization & Autonomous AI Ops',
                'status' => Proposal::STATUS_WON,
                'ai_prompt_context' => 'Accelerated cloud migration focusing on eliminating legacy licensing costs and replacing manual tier-1 triage with autonomous agent workflows.',
                'ai_tone' => 'persuasive',
                'target_audience' => 'C-Suite Executive Leadership',
                'subtotal' => 30500.00,
                'total_discount' => 1250.00,
                'discounted_subtotal' => 29250.00,
                'tax_rate' => 8.50,
                'tax_amount' => 2486.25,
                'grand_total' => 31736.25,
                'valid_days' => 30,
            ]
        );

        // Sections for the won proposal
        ProposalSection::firstOrCreate(
            [
                'proposal_id' => $wonProposal->id,
                'section_key' => ProposalSection::SECTION_EXECUTIVE_SUMMARY,
            ],
            [
                'title' => 'Executive Summary',
                'content' => "In today's fast-moving market, organizations face mounting operational expenses alongside increasing customer expectations. This proposal presents a turnkey AI modernization and cloud transformation architecture specifically calibrated for Apex Retail Solutions.\n\nBy replacing fragmented manual oversight with intelligent autonomous workflows and high-efficiency containerized infrastructure, this initiative is engineered as a definitive cost-saving measure. Projected outcomes indicate an estimated 42% reduction in recurring administrative overhead, a 3.4x throughput increase, and an accelerated return on investment (ROI) within 6 months of initial deployment.",
                'order_index' => 1,
            ]
        );

        ProposalSection::firstOrCreate(
            [
                'proposal_id' => $wonProposal->id,
                'section_key' => ProposalSection::SECTION_CLOSING,
            ],
            [
                'title' => 'Terms & Acceptance',
                'content' => 'All rates are quoted in USD and fixed for 30 calendar days from issuance. Invoices are distributed on a milestone completion schedule (40% initiation, 30% Phase 2 sign-off, 30% final deployment). Dedicated support billed monthly in arrears.',
                'order_index' => 3,
            ]
        );

        // 5. Seed Realistic 768-Dimension Vector Embeddings for RAG Retrieval
        $sampleWonChunks = [
            [
                'chunk' => 'By replacing fragmented manual oversight with intelligent autonomous workflows and high-efficiency containerized infrastructure, this initiative is engineered as a definitive cost-saving measure with an accelerated 6-month ROI.',
                'industry' => 'E-Commerce & Retail',
            ],
            [
                'chunk' => 'Achieved SOC2 Type II compliance readiness and HIPAA-compliant data pipeline ingestion within 60 days, cutting security incident resolution time by 74% using automated event remediation bots.',
                'industry' => 'Healthcare & Biotech',
            ],
            [
                'chunk' => 'Deployed resilient multi-region Kubernetes clusters with active-active failover, achieving 99.999% uptime and zero lost transactions during peak Q4 cyber trading events.',
                'industry' => 'Financial Services & FinTech',
            ],
        ];

        foreach ($sampleWonChunks as $seedChunk) {
            // Generate a normalized 768-dimension vector
            $randomFloats = [];
            for ($i = 0; $i < 768; $i++) {
                $randomFloats[] = round((mt_rand(-1000, 1000) / 10000.0), 6);
            }

            SuccessfulPitchEmbedding::create([
                'proposal_id' => $wonProposal->id,
                'text_chunk' => $seedChunk['chunk'],
                'embedding' => new Vector($randomFloats),
                'industry' => $seedChunk['industry'],
                'metadata' => [
                    'source' => 'historical_benchmark',
                    'conversion_rate' => '100%',
                ],
            ]);
        }
    }
}
