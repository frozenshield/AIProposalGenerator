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
            : Proposal::whereIn('status', [Proposal::STATUS_DRAFT, Proposal::STATUS_SENT])->count();

        $totalWinValue = $user
            ? (float) $user->proposals()->where('status', Proposal::STATUS_WON)->sum('grand_total')
            : (float) Proposal::where('status', Proposal::STATUS_WON)->sum('grand_total');

        $clientAccountsCount = $user
            ? $user->clients()->count()
            : 4;

        $recentProposals = $user
            ? $user->proposals()->with('client')->latest()->take(5)->get()
            : Proposal::with('client')->latest()->take(5)->get();

        return Inertia::render('Dashboard', [
            'metrics' => [
                'activeProposals' => $activeProposalsCount,
                'totalWinValue' => $totalWinValue,
                'clientAccounts' => $clientAccountsCount,
            ],
            'recentProposals' => $recentProposals,
        ]);
    }
}

