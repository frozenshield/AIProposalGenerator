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
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Retrieve items owned by tenant or global catalog templates
        $catalog = $user
            ? CatalogItem::where('user_id', $user->id)->orWhereNull('user_id')->orderBy('category')->get()
            : CatalogItem::orderBy('category')->get();

        return Inertia::render('Catalog', [
            'catalog' => $catalog,
        ]);
    }

    /**
     * Store a new custom catalog deliverable scoped to the authenticated tenant.
     */
    public function store(Request $request): RedirectResponse
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

        if ($user) {
            $user->catalogItems()->create($validated);
        } else {
            CatalogItem::create($validated);
        }

        return redirect()->back()->with('status', 'Catalog item registered successfully.');
    }

    /**
     * Delete a catalog item belonging to the tenant.
     */
    public function destroy(Request $request, CatalogItem $catalogItem): RedirectResponse
    {
        $user = $request->user();

        if ($user && $catalogItem->user_id && $catalogItem->user_id !== $user->id) {
            abort(403, 'Unauthorized access to catalog item.');
        }

        $catalogItem->delete();

        return redirect()->back()->with('status', 'Catalog deliverable removed.');
    }
}

