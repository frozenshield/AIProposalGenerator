<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'ref_role' => $request->user()->ref_role ?? 'user',
                    'role' => $request->user()->ref_role ?? 'user',
                    'is_admin' => $request->user()->isAdmin(),
                    'is_subscribed' => (bool) $request->user()->isPro(),
                    'subscription_tier' => $request->user()->isPro() ? 'pro' : ($request->user()->subscription_tier ?? 'free'),
                    'proposals_count' => (int) ($request->user()->proposals_count ?? 0),
                    'clients_count' => (int) $request->user()->clients()->count(),
                    'catalog_count' => (int) $request->user()->catalogItems()->count(),
                ] : null,
            ],
            'counts' => [
                'clients' => $request->user() ? (int) $request->user()->clients()->count() : 0,
                'catalog' => $request->user() ? (int) $request->user()->catalogItems()->count() : 0,
                'proposals' => $request->user() ? (int) $request->user()->proposals()->count() : 0,
            ],
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
                'success' => fn () => $request->session()->get('success'),
                'warning' => fn () => $request->session()->get('warning'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'app' => [
                'name' => config('app.name', 'AI Proposal Generator'),
            ],
        ];
    }
}
