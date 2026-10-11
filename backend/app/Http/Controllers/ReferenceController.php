<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\CatalogItem;
use App\Models\Client;
use App\Models\ReferenceOption;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReferenceController extends Controller
{
    /**
     * Retrieve all system reference options and directory records for dropdowns.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Database-backed clients directory
        $clients = $user
            ? $user->clients()->orderBy('company')->orderBy('name')->get()
            : Client::orderBy('company')->orderBy('name')->get();

        // Database-backed catalog items directory
        $catalogItems = $user
            ? CatalogItem::where('user_id', $user->id)->orWhereNull('user_id')->orderBy('category')->orderBy('name')->get()
            : CatalogItem::orderBy('category')->orderBy('name')->get();

        // Database-backed dropdown reference options grouped by category
        $options = ReferenceOption::active()->get()->groupBy('category');

        return response()->json([
            'clients' => $clients,
            'catalog_items' => $catalogItems,
            'ai_tones' => $options->get('ai_tone', collect()),
            'strategic_angles' => $options->get('strategic_angle', collect()),
            'ai_models' => $options->get('ai_model', collect()),
            'industries' => $options->get('industry', collect()),
            'currency' => [
                'code' => 'PHP',
                'symbol' => '₱',
                'name' => 'Philippine Peso',
            ],
        ]);
    }
}
