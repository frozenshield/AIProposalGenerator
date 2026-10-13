<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\CatalogItem;
use App\Models\Client;
use App\Models\Proposal;
use App\Models\ProposalSection;
use App\Models\ReferenceOption;
use App\Models\SuccessfulPitchEmbedding;
use App\Models\User;
use Illuminate\Database\Seeder;
use Pgvector\Laravel\Vector;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the database with enterprise reference options, clients, catalog items with Philippine Pesos, and admin user.
     */
    public function run(): void
    {
        // 1. Clean existing dummy user accounts and seed 1 Platform Admin User
        User::where('email', '!=', 'admin@aiproposals.io')->delete();

        $user = User::updateOrCreate(
            ['email' => 'admin@aiproposals.io'],
            [
                'name' => 'System Administrator',
                'password' => bcrypt('password123'),
                'ref_role' => 'admin',
                'proposals_count' => 0,
                'is_subscribed' => true,
                'subscription_tier' => 'pro',
            ]
        );

        // 2. Seed Reference Dropdown Options (Stored in database for dynamic UI binding)
        $referenceOptions = [
            // AI Strategic Angles
            [
                'category' => 'strategic_angle',
                'key' => 'cost_saving',
                'label' => 'Cost-Saving & High ROI',
                'value' => 'Pitch this as a decisive cost-saving measure with an accelerated 6-month ROI. Highlight automated operational efficiencies, reduced manual labor overhead by 42%, and zero-downtime cloud migration guarantee quoted in Philippine Pesos (PHP).',
                'badge' => 'Most Popular',
                'order_index' => 1,
            ],
            [
                'category' => 'strategic_angle',
                'key' => 'speed_to_market',
                'label' => 'Speed-to-Market & Agility',
                'value' => 'Frame this proposal around aggressive time-to-value. Emphasize that modular AI pipelines allow rapid feature launches in weeks instead of quarters, outpacing key market rivals.',
                'badge' => 'High Conversion',
                'order_index' => 2,
            ],
            [
                'category' => 'strategic_angle',
                'key' => 'security_compliance',
                'label' => 'Security & Enterprise Compliance',
                'value' => 'Prioritize bank-grade data security, strict SOC2 Type II compliance, on-premise model deployment options, and isolated tenant architectures to mitigate all cyber risks.',
                'badge' => 'Enterprise',
                'order_index' => 3,
            ],
            [
                'category' => 'strategic_angle',
                'key' => 'modernization',
                'label' => 'Modernization & Scalability',
                'value' => 'Highlight legacy system refactoring into cloud-native microservices. Position this as an investment in sustainable technical equity and multi-year scalability.',
                'badge' => null,
                'order_index' => 4,
            ],
            [
                'category' => 'strategic_angle',
                'key' => 'ai_multiplier',
                'label' => 'AI Productivity Multiplier',
                'value' => 'Demonstrate how autonomous agent orchestration augments internal teams, doubling deliverable output while maintaining rigorous quality checks.',
                'badge' => 'AI Ops',
                'order_index' => 5,
            ],

            // AI Tones
            [
                'category' => 'ai_tone',
                'key' => 'persuasive',
                'label' => 'Persuasive & High ROI',
                'value' => 'persuasive',
                'badge' => 'Default',
                'order_index' => 1,
            ],
            [
                'category' => 'ai_tone',
                'key' => 'cost_saving',
                'label' => 'Cost-Saving & Lean Ops',
                'value' => 'cost-saving',
                'badge' => null,
                'order_index' => 2,
            ],
            [
                'category' => 'ai_tone',
                'key' => 'formal',
                'label' => 'Corporate & Formal',
                'value' => 'formal',
                'badge' => null,
                'order_index' => 3,
            ],
            [
                'category' => 'ai_tone',
                'key' => 'technical',
                'label' => 'Technical & Architecture Deep Dive',
                'value' => 'technical',
                'badge' => null,
                'order_index' => 4,
            ],
            [
                'category' => 'ai_tone',
                'key' => 'executive',
                'label' => 'C-Suite Executive Pitch',
                'value' => 'executive',
                'badge' => 'Executive',
                'order_index' => 5,
            ],

            // AI Models
            [
                'category' => 'ai_model',
                'key' => 'Gemini Flash-Lite',
                'label' => 'Gemini Flash-Lite',
                'value' => 'gemini-flash-lite',
                'badge' => 'Default (Ultra Fast)',
                'order_index' => 1,
            ],
            [
                'category' => 'ai_model',
                'key' => 'Gemini 1.5 Flash',
                'label' => 'Gemini 1.5 Flash',
                'value' => 'gemini-1.5-flash',
                'badge' => 'Multimodal',
                'order_index' => 2,
            ],
            [
                'category' => 'ai_model',
                'key' => 'Gemini 1.5 Pro',
                'label' => 'Gemini 1.5 Pro',
                'value' => 'gemini-1.5-pro',
                'badge' => 'Pro Tier',
                'order_index' => 3,
            ],
            [
                'category' => 'ai_model',
                'key' => 'Gemini 2.5 Pro',
                'label' => 'Gemini 2.5 Pro',
                'value' => 'gemini-2.5-pro',
                'badge' => 'Enterprise RAG',
                'order_index' => 4,
            ],

            // Industries
            [
                'category' => 'industry',
                'key' => 'ecommerce',
                'label' => 'E-Commerce & Retail',
                'value' => 'E-Commerce & Retail',
                'badge' => null,
                'order_index' => 1,
            ],
            [
                'category' => 'industry',
                'key' => 'fintech',
                'label' => 'Financial Services & FinTech',
                'value' => 'Financial Services & FinTech',
                'badge' => null,
                'order_index' => 2,
            ],
            [
                'category' => 'industry',
                'key' => 'healthcare',
                'label' => 'Healthcare & Biotech',
                'value' => 'Healthcare & Biotech',
                'badge' => null,
                'order_index' => 3,
            ],
            [
                'category' => 'industry',
                'key' => 'logistics',
                'label' => 'Supply Chain & Logistics',
                'value' => 'Supply Chain & Logistics',
                'badge' => null,
                'order_index' => 4,
            ],
            [
                'category' => 'industry',
                'key' => 'telecom',
                'label' => 'Telecommunications & ICT',
                'value' => 'Telecommunications & ICT',
                'badge' => null,
                'order_index' => 5,
            ],
        ];

        foreach ($referenceOptions as $opt) {
            ReferenceOption::updateOrCreate(
                ['category' => $opt['category'], 'key' => $opt['key']],
                $opt
            );
        }

        // 3. Seed Enterprise Clients Directory
        $clientsData = [
            [
                'name' => 'Sarah Jenkins',
                'company' => 'Apex Retail Solutions Philippines',
                'role' => 'Chief Technology Officer',
                'email' => 's.jenkins@apexretail.ph',
                'phone' => '+63 (2) 8876-5432',
                'industry' => 'E-Commerce & Retail',
                'avatar' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
                'address' => 'Ayala Tower One, Ayala Avenue, Makati City, Metro Manila',
            ],
            [
                'name' => 'David Chen',
                'company' => 'OmniHealth Technologies Asia',
                'role' => 'VP of Digital Transformation',
                'email' => 'd.chen@omnihealth.asia',
                'phone' => '+63 (2) 8654-3210',
                'industry' => 'Healthcare & Biotech',
                'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
                'address' => 'High Street South Corporate Plaza, BGC, Taguig City',
            ],
            [
                'name' => 'Elena Rostova',
                'company' => 'FinVanguard Global Capital',
                'role' => 'Director of Strategic Ops',
                'email' => 'elena.r@finvanguard.com',
                'phone' => '+63 (2) 8912-3456',
                'industry' => 'Financial Services & FinTech',
                'avatar' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
                'address' => 'The Podium West Tower, ADB Avenue, Ortigas Center, Pasig City',
            ],
            [
                'name' => 'Marcus Sterling',
                'company' => 'LogiFlow Supply Chain Corp',
                'role' => 'Chief Operating Officer',
                'email' => 'msterling@logiflow.net',
                'phone' => '+63 (32) 412-8890',
                'industry' => 'Supply Chain & Logistics',
                'avatar' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
                'address' => 'Cebu IT Park, Lahug, Cebu City, Cebu',
            ],
        ];

        $clients = [];
        foreach ($clientsData as $c) {
            $c['user_id'] = $user->id;
            $clients[] = Client::updateOrCreate(['email' => $c['email']], $c);
        }

        // 4. Seed Deliverables Master Catalog (Philippine Pesos - ₱ / PHP)
        $catalogItemsData = [
            [
                'name' => 'AI Automated Workflow Engine',
                'description' => 'End-to-end autonomous agent workflow pipeline integration with existing ERP/CRM, handling automated approvals and business logic.',
                'category' => 'Artificial Intelligence',
                'unit_price' => 125000.00, // PHP ₱125,000.00
                'unit' => 'Deployment',
                'default_quantity' => 1,
            ],
            [
                'name' => 'Enterprise Cloud Modernization',
                'description' => 'Zero-downtime microservices containerization, multi-cloud failover, database optimization, and high availability setup.',
                'category' => 'Cloud Architecture',
                'unit_price' => 180000.00, // PHP ₱180,000.00
                'unit' => 'Phase',
                'default_quantity' => 1,
            ],
            [
                'name' => 'Custom Domain LLM Fine-Tuning',
                'description' => 'Proprietary dataset ingestion, safety evaluation guardrails, localized business context, and private cloud deployment.',
                'category' => 'Machine Learning',
                'unit_price' => 95000.00, // PHP ₱95,000.00
                'unit' => 'Model Package',
                'default_quantity' => 1,
            ],
            [
                'name' => 'Security & Compliance Audit Suite',
                'description' => 'SOC2 Type II, NPC DPA 2012, and ISO 27001 automated threat vector inspection, vulnerability remediation, and compliance sign-off.',
                'category' => 'Cybersecurity',
                'unit_price' => 62000.00, // PHP ₱62,000.00
                'unit' => 'Audit Report',
                'default_quantity' => 1,
            ],
            [
                'name' => 'Next-Gen UX/UI Product Redesign',
                'description' => 'Human-centric responsive design system, WCAG AA accessibility, interactive Figma prototypes, and Tailwind CSS components.',
                'category' => 'Product Design',
                'unit_price' => 78000.00, // PHP ₱78,000.00
                'unit' => 'Sprint (2 Wks)',
                'default_quantity' => 2,
            ],
            [
                'name' => '24/7 Dedicated Support SLA & SRE',
                'description' => '15-minute response guarantee, continuous health telemetry, Philippine business hours coverage, and dedicated solutions architect.',
                'category' => 'Managed Services',
                'unit_price' => 24000.00, // PHP ₱24,000.00
                'unit' => 'Month',
                'default_quantity' => 3,
            ],
        ];

        $catalog = [];
        foreach ($catalogItemsData as $item) {
            $item['user_id'] = $user->id;
            $catalog[] = CatalogItem::updateOrCreate(['name' => $item['name']], $item);
        }

        // 5. Seed Historical Won Proposal with Philippine Peso Pricing
        $wonProposal = Proposal::firstOrCreate(
            ['proposal_number' => 'PROP-2026-880'],
            [
                'user_id' => $user->id,
                'client_id' => $clients[0]->id,
                'title' => 'Enterprise Cloud Modernization & Autonomous AI Ops',
                'status' => Proposal::STATUS_WON,
                'ai_prompt_context' => 'Accelerated cloud migration focusing on eliminating legacy licensing costs and replacing manual tier-1 triage with autonomous agent workflows.',
                'ai_tone' => 'persuasive',
                'target_audience' => 'C-Suite Executive Leadership',
                'subtotal' => 305000.00,
                'total_discount' => 12500.00,
                'discounted_subtotal' => 292500.00,
                'tax_rate' => 12.00, // Standard Philippine VAT 12%
                'tax_amount' => 35100.00,
                'grand_total' => 327600.00,
                'valid_days' => 30,
            ]
        );

        ProposalSection::firstOrCreate(
            [
                'proposal_id' => $wonProposal->id,
                'section_key' => ProposalSection::SECTION_EXECUTIVE_SUMMARY,
            ],
            [
                'title' => 'Executive Summary',
                'content' => "In today's fast-moving market, organizations face mounting operational expenses alongside increasing customer expectations. This proposal presents a turnkey AI modernization and cloud transformation architecture specifically calibrated for Apex Retail Solutions Philippines.\n\nBy replacing fragmented manual oversight with intelligent autonomous workflows and high-efficiency containerized infrastructure, this initiative is engineered as a definitive cost-saving measure. Projected outcomes indicate an estimated 42% reduction in recurring administrative overhead, a 3.4x throughput increase, and an accelerated return on investment (ROI) within 6 months of initial deployment.",
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
                'content' => 'All rates are quoted in Philippine Pesos (PHP ₱) exclusive of 12% EVAT and fixed for 30 calendar days from issuance. Invoices are distributed on a milestone completion schedule (40% initiation, 30% Phase 2 sign-off, 30% final deployment). Dedicated support billed monthly in arrears.',
                'order_index' => 3,
            ]
        );

        // 6. Seed Vector Embeddings
        $sampleWonChunks = [
            [
                'chunk' => 'By replacing fragmented manual oversight with intelligent autonomous workflows and high-efficiency containerized infrastructure, this initiative is engineered as a definitive cost-saving measure with an accelerated 6-month ROI quoted in Philippine Pesos.',
                'industry' => 'E-Commerce & Retail',
            ],
            [
                'chunk' => 'Achieved NPC DPA and ISO 27001 compliance readiness within 60 days, cutting security incident resolution time by 74% using automated event remediation bots.',
                'industry' => 'Healthcare & Biotech',
            ],
            [
                'chunk' => 'Deployed resilient multi-region Kubernetes clusters with active-active failover, achieving 99.999% uptime and zero lost transactions during peak cyber trading events.',
                'industry' => 'Financial Services & FinTech',
            ],
        ];

        foreach ($sampleWonChunks as $seedChunk) {
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
