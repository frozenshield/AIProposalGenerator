<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Proposal;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the tenant dashboard with isolated metrics.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $activeProposalsCount = $user
            ? $user->proposals()->whereIn('status', [Proposal::STATUS_DRAFT, Proposal::STATUS_SENT])->count()
            : 0;

        $totalWinValue = $user
            ? (float) $user->proposals()->where('status', Proposal::STATUS_WON)->sum('grand_total')
            : 0.0;

        $clientAccountsCount = $user
            ? $user->clients()->count()
            : 0;

        $recentProposals = $user
            ? $user->proposals()->with('client')->latest()->take(5)->get()
            : collect([]);

        $paymentSuccess = false;
        if ($request->query('payment') === 'success') {
            $paymentSuccess = true;
            if ($user && (!$user->is_subscribed || $user->subscription_tier !== 'pro')) {
                $user->update([
                    'is_subscribed' => true,
                    'subscription_tier' => 'pro',
                    'subscribed_at' => now(),
                ]);
                $user->refresh();
            }
        }

        return Inertia::render('Dashboard', [
            'metrics' => [
                'activeProposals' => $activeProposalsCount,
                'totalWinValue' => $totalWinValue,
                'clientAccounts' => $clientAccountsCount,
            ],
            'recentProposals' => $recentProposals,
            'paymentSuccess' => $paymentSuccess,
        ]);
    }
}

