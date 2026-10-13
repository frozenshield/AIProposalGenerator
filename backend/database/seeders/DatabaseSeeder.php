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

        // Clean all dummy client, catalog, and proposal data
        ProposalSection::truncate();
        SuccessfulPitchEmbedding::truncate();
        Proposal::truncate();
        CatalogItem::truncate();
        Client::truncate();
    }
}
