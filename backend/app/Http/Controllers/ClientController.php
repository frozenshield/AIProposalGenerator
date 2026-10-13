<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Display the tenant's clients.
     */
    public function index(Request $request): Response|\Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        // Strict tenant isolation: only return clients owned by the authenticated tenant
        $clients = $user
            ? $user->clients()->latest()->get()
            : collect([]);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'clients' => $clients,
            ]);
        }

        return Inertia::render('Clients', [
            'clients' => $clients,
        ]);
    }

    /**
     * Store a new client scoped to the authenticated tenant.
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'industry' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
            'avatar' => ['nullable', 'string', 'max:500'],
        ]);

        $user = $request->user();

        if (! $user) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required to create a client account.',
                ], 401);
            }
            return redirect()->guest('/login');
        }

        $client = $user->clients()->create($validated);

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Client account added successfully.',
                'client' => $client,
            ], 201);
        }

        return redirect()->back()->with('status', 'Client account added successfully.');
    }

    /**
     * Delete a client belonging to the authenticated tenant.
     */
    public function destroy(Request $request, Client $client): \Illuminate\Http\JsonResponse|RedirectResponse
    {
        $user = $request->user();

        if (! $user || $client->user_id !== $user->id) {
            if ($request->wantsJson() || $request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to client record.',
                ], 403);
            }
            abort(403, 'Unauthorized access to client record.');
        }

        $client->delete();

        if ($request->wantsJson() || $request->is('api/*')) {
            return response()->json([
                'success' => true,
                'message' => 'Client account removed.',
            ]);
        }

        return redirect()->back()->with('status', 'Client account removed.');
    }
}

