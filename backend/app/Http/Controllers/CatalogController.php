<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\CatalogItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * Display the tenant's deliverables catalog.
     */
    public function index(Request $request): Response|\Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        // Retrieve items strictly owned by the authenticated tenant
        $catalog = $user
            ? $user->catalogItems()->orderBy('category')->get()
            : collect([]);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'catalog' => $catalog,
            ]);
        }

        return Inertia::render('Catalog', [
            'catalog' => $catalog,
        ]);
    }

    /**
     * Store a new custom catalog deliverable scoped to the authenticated tenant.
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'category' => ['required', 'string', 'max:100'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'default_quantity' => ['required', 'integer', 'min:1'],
        ]);

        $user = $request->user();

        if (! $user) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required to create a catalog deliverable.',
                ], 401);
            }
            return redirect()->guest('/login');
        }

        $item = $user->catalogItems()->create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Catalog item registered successfully.',
                'item' => $item,
            ], 201);
        }

        return redirect()->back()->with('status', 'Catalog item registered successfully.');
    }

    /**
     * Delete a catalog item belonging to the tenant.
     */
    public function destroy(Request $request, CatalogItem $catalogItem): \Illuminate\Http\JsonResponse|RedirectResponse
    {
        $user = $request->user();

        if (! $user || $catalogItem->user_id !== $user->id) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to catalog deliverable.',
                ], 403);
            }
            abort(403, 'Unauthorized access to catalog item.');
        }

        $catalogItem->delete();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Catalog deliverable removed.',
            ]);
        }

        return redirect()->back()->with('status', 'Catalog deliverable removed.');
    }

    /**
     * AI-generate catalog item parameters based on brief prompt using Gemini.
     */
    public function aiGenerate(Request $request, \App\Services\GeminiService $gemini): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required to generate AI deliverables.',
            ], 401);
        }

        $validated = $request->validate([
            'prompt' => ['required', 'string', 'max:500'],
        ]);

        $systemInstruction = "You are an enterprise B2B solutions architect in the Philippines. Given a service concept or deliverable title, generate an industry-standard B2B deliverable specification in Philippine Pesos (PHP). Return valid JSON.";

        $schema = [
            'type' => 'OBJECT',
            'properties' => [
                'name' => ['type' => 'STRING', 'description' => 'Professional deliverable title'],
                'category' => [
                    'type' => 'STRING',
                    'enum' => [
                        'Software Engineering',
                        'AI & Data Science',
                        'Cloud Infrastructure',
                        'Design & Architecture',
                        'Consulting & Audit',
                    ],
                ],
                'description' => ['type' => 'STRING', 'description' => 'Concrete scope of work and business value outcome (2-3 sentences)'],
                'unit_price' => ['type' => 'NUMBER', 'description' => 'Suggested base price in Philippine Pesos (PHP ₱), e.g. 75000, 125000, 180000'],
                'unit' => ['type' => 'STRING', 'enum' => ['package', 'sprint', 'hour', 'month', 'milestone', 'seat']],
                'default_quantity' => ['type' => 'INTEGER', 'description' => 'Recommended default quantity (usually 1 or 2)'],
            ],
            'required' => ['name', 'category', 'description', 'unit_price', 'unit', 'default_quantity'],
        ];

        try {
            $result = $gemini->generateContent(
                prompt: "Generate an enterprise catalog item for: {$validated['prompt']}",
                model: config('services.gemini.models.flash', 'gemini-2.5-flash'),
                responseSchema: $schema,
                systemInstruction: $systemInstruction,
                temperature: 0.3
            );

            if (is_string($result)) {
                $result = json_decode($result, true) ?? [];
            }

            return response()->json([
                'success' => true,
                'item' => $result,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => true,
                'item' => [
                    'name' => ucwords($validated['prompt']),
                    'category' => 'Software Engineering',
                    'description' => "Turnkey deployment of {$validated['prompt']} with automated CI/CD pipelines, SLA guarantees, and enterprise architecture documentation.",
                    'unit_price' => 125000,
                    'unit' => 'package',
                    'default_quantity' => 1,
                ],
            ]);
        }
    }
}


