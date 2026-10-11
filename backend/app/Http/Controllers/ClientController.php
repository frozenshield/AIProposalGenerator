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
    public function index(Request $request): Response
    {
        $user = $request->user();

        $clients = $user
            ? $user->clients()->latest()->get()
            : Client::latest()->get();

        return Inertia::render('Clients', [
            'clients' => $clients,
        ]);
    }

    /**
     * Store a new client scoped to the authenticated tenant.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'company' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'industry' => ['nullable', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
            'avatar' => ['nullable', 'url', 'max:500'],
        ]);

        $user = $request->user();

        if ($user) {
            $user->clients()->create($validated);
        } else {
            Client::create($validated);
        }

        return redirect()->back()->with('status', 'Client account added successfully.');
    }

    /**
     * Delete a client belonging to the authenticated tenant.
     */
    public function destroy(Request $request, Client $client): RedirectResponse
    {
        $user = $request->user();

        if ($user && $client->user_id && $client->user_id !== $user->id) {
            abort(403, 'Unauthorized access to client record.');
        }

        $client->delete();

        return redirect()->back()->with('status', 'Client account removed.');
    }
}

