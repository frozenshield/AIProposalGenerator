<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Show the dedicated Admin Login view.
     */
    public function showLogin(): Response|RedirectResponse
    {
        if (Auth::check() && Auth::user()->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Admin/Login');
    }

    /**
     * Process Admin Login authentication.
     */
    public function login(Request $request): JsonResponse|RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $user = Auth::user();

            if (! $user->isAdmin()) {
                Auth::logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Restricted Area: Platform Administrator privileges required.',
                        'errors' => ['email' => ['Restricted Area: Platform Administrator privileges required.']],
                    ], 403);
                }

                return back()->withErrors([
                    'email' => 'Restricted Area: Platform Administrator privileges required.',
                ]);
            }

            $request->session()->regenerate();

            if ($request->expectsJson()) {
                return response()->json([
                    'success' => true,
                    'user' => $user,
                    'redirect' => route('admin.dashboard'),
                ]);
            }

            return redirect()->intended(route('admin.dashboard'));
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'The provided credentials do not match our administrative records.',
                'errors' => ['email' => ['Invalid administrator credentials.']],
            ], 422);
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our administrative records.',
        ]);
    }

    /**
     * Terminate the administrator session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    /**
     * Render the comprehensive Admin Console with live Google AI Studio integration.
     */
    public function dashboard(Request $request): Response|JsonResponse
    {
        $apiKey = (string) config('services.gemini.api_key', env('GEMINI_API_KEY', ''));
        $baseUrl = (string) config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');

        $aiStudioData = $this->fetchGoogleAiStudioModels($apiKey, $baseUrl);

        $stats = [
            'total_users' => User::count(),
            'pro_users' => User::where('is_subscribed', true)->orWhere('subscription_tier', 'pro')->count(),
            'total_proposals' => Proposal::count(),
            'total_clients' => Client::count(),
            'active_engine' => config('services.gemini.models.pro', 'gemini-2.5-pro'),
            'flash_engine' => config('services.gemini.models.flash', 'gemini-2.5-flash'),
            'embedding_engine' => config('services.gemini.models.embedding', 'gemini-embedding-2'),
            'api_connected' => $aiStudioData['connected'],
            'latency_ms' => $aiStudioData['latency_ms'],
            'total_models_count' => count($aiStudioData['models']),
        ];

        $users = User::select([
            'id',
            'name',
            'email',
            'ref_role',
            'is_subscribed',
            'subscription_tier',
            'proposals_count',
            'created_at',
            'subscribed_at',
        ])
            ->orderByDesc('created_at')
            ->take(50)
            ->get();

        $data = [
            'stats' => $stats,
            'models' => $aiStudioData['models'],
            'aiStudioStatus' => [
                'connected' => $aiStudioData['connected'],
                'latency_ms' => $aiStudioData['latency_ms'],
                'endpoint' => "{$baseUrl}/models",
                'last_synced_at' => now()->toIso8601String(),
                'error' => $aiStudioData['error'] ?? null,
            ],
            'users' => $users,
        ];

        if ($request->expectsJson() && ! $request->header('X-Inertia')) {
            return response()->json($data);
        }

        return Inertia::render('Admin/Dashboard', $data);
    }

    /**
     * Ping Google AI Studio API for real-time latency diagnostics.
     */
    public function testAiStudio(): JsonResponse
    {
        $apiKey = (string) config('services.gemini.api_key', env('GEMINI_API_KEY', ''));
        $baseUrl = (string) config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');
        $model = config('services.gemini.models.pro', 'gemini-2.5-pro');

        $start = microtime(true);

        try {
            $response = Http::timeout(8)->get("{$baseUrl}/models/{$model}?key={$apiKey}");
            $latency = round((microtime(true) - $start) * 1000);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'status' => 'operational',
                    'latency_ms' => $latency,
                    'model' => $model,
                    'display_name' => $response->json('displayName', 'Gemini 2.5 Pro'),
                    'input_token_limit' => $response->json('inputTokenLimit', 1048576),
                    'output_token_limit' => $response->json('outputTokenLimit', 65536),
                    'timestamp' => now()->toIso8601String(),
                ]);
            }

            return response()->json([
                'success' => false,
                'status' => 'degraded',
                'latency_ms' => $latency,
                'error' => 'API returned HTTP '.$response->status().': '.$response->body(),
            ], 502);
        } catch (\Throwable $e) {
            $latency = round((microtime(true) - $start) * 1000);

            return response()->json([
                'success' => false,
                'status' => 'error',
                'latency_ms' => $latency,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Toggle a user's Pro subscription status directly from the Admin Panel.
     */
    public function toggleUserPro(Request $request, User $user): JsonResponse|RedirectResponse
    {
        $user->is_subscribed = ! $user->is_subscribed;
        $user->subscription_tier = $user->is_subscribed ? 'pro' : 'free';
        $user->subscribed_at = $user->is_subscribed ? now() : null;
        $user->save();

        $message = "User {$user->email} Pro tier is now ".($user->is_subscribed ? 'ACTIVE' : 'REVOKED').'.';

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'user' => $user,
            ]);
        }

        return back()->with('success', $message);
    }

    /**
     * Fetch and augment models list from Google AI Studio.
     *
     * @return array{connected: bool, latency_ms: int, models: array<int, array<string, mixed>>, error: ?string}
     */
    private function fetchGoogleAiStudioModels(string $apiKey, string $baseUrl): array
    {
        $start = microtime(true);

        try {
            $response = Http::timeout(8)->get("{$baseUrl}/models?key={$apiKey}");
            $latency = (int) round((microtime(true) - $start) * 1000);

            if ($response->successful()) {
                $rawModels = $response->json('models', []);
                $processedModels = [];

                foreach ($rawModels as $model) {
                    $name = $model['name'] ?? '';
                    $cleanId = str_replace('models/', '', $name);

                    // Augment with Google AI Studio official rate limit tiers
                    $quotaInfo = $this->determineRateLimits($cleanId);

                    $processedModels[] = [
                        'id' => $cleanId,
                        'name' => $name,
                        'displayName' => $model['displayName'] ?? $cleanId,
                        'description' => $model['description'] ?? '',
                        'inputTokenLimit' => $model['inputTokenLimit'] ?? null,
                        'outputTokenLimit' => $model['outputTokenLimit'] ?? null,
                        'supportedGenerationMethods' => $model['supportedGenerationMethods'] ?? [],
                        'temperature' => $model['temperature'] ?? null,
                        'topP' => $model['topP'] ?? null,
                        'topK' => $model['topK'] ?? null,
                        'quota' => $quotaInfo,
                    ];
                }

                // Sort: highlight flagship models first
                usort($processedModels, function ($a, $b) {
                    $priority = function ($id) {
                        if (str_contains($id, '2.5-pro')) return 1;
                        if (str_contains($id, '2.5-flash')) return 2;
                        if (str_contains($id, '1.5-pro')) return 3;
                        if (str_contains($id, '1.5-flash')) return 4;
                        if (str_contains($id, 'embedding')) return 5;
                        return 10;
                    };
                    return $priority($a['id']) <=> $priority($b['id']);
                });

                return [
                    'connected' => true,
                    'latency_ms' => $latency,
                    'models' => $processedModels,
                    'error' => null,
                ];
            }

            return [
                'connected' => false,
                'latency_ms' => $latency,
                'models' => $this->fallbackModels(),
                'error' => 'API returned HTTP '.$response->status().': '.$response->body(),
            ];
        } catch (\Throwable $e) {
            $latency = (int) round((microtime(true) - $start) * 1000);

            return [
                'connected' => false,
                'latency_ms' => $latency,
                'models' => $this->fallbackModels(),
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Map official Google AI Studio Rate Limit quotas for model IDs.
     *
     * @return array{rpm: string|int, tpm: string|int, rpd: string|int, tier: string, badge_color: string}
     */
    private function determineRateLimits(string $modelId): array
    {
        if (str_contains($modelId, '2.5-pro') || str_contains($modelId, '1.5-pro')) {
            return [
                'rpm' => 2,
                'tpm' => '32,000',
                'rpd' => 50,
                'tier' => 'Pro Enterprise Tier',
                'badge_color' => 'amber',
            ];
        }

        if (str_contains($modelId, '2.5-flash') || str_contains($modelId, '1.5-flash')) {
            return [
                'rpm' => 15,
                'tpm' => '1,000,000',
                'rpd' => 1500,
                'tier' => 'High-Speed Flash Tier',
                'badge_color' => 'emerald',
            ];
        }

        if (str_contains($modelId, 'flash-8b') || str_contains($modelId, 'flash-lite')) {
            return [
                'rpm' => 30,
                'tpm' => '4,000,000',
                'rpd' => 1500,
                'tier' => 'Ultra-Low Latency Tier',
                'badge_color' => 'blue',
            ];
        }

        if (str_contains($modelId, 'embedding')) {
            return [
                'rpm' => 1500,
                'tpm' => '10,000,000',
                'rpd' => 'Unlimited',
                'tier' => 'pgvector Embedding Tier',
                'badge_color' => 'purple',
            ];
        }

        return [
            'rpm' => 15,
            'tpm' => '1,000,000',
            'rpd' => 1500,
            'tier' => 'Standard Foundation Tier',
            'badge_color' => 'slate',
        ];
    }

    /**
     * Fallback model definitions if AI Studio API is momentarily unreachable.
     *
     * @return array<int, array<string, mixed>>
     */
    private function fallbackModels(): array
    {
        return [
            [
                'id' => 'gemini-2.5-pro',
                'name' => 'models/gemini-2.5-pro',
                'displayName' => 'Gemini 2.5 Pro',
                'description' => 'Flagship reasoning model for complex proposal drafts and enterprise RFP analysis.',
                'inputTokenLimit' => 1048576,
                'outputTokenLimit' => 65536,
                'supportedGenerationMethods' => ['generateContent', 'countTokens'],
                'quota' => $this->determineRateLimits('gemini-2.5-pro'),
            ],
            [
                'id' => 'gemini-2.5-flash',
                'name' => 'models/gemini-2.5-flash',
                'displayName' => 'Gemini 2.5 Flash',
                'description' => 'High-frequency real-time generation with sub-second response times.',
                'inputTokenLimit' => 1048576,
                'outputTokenLimit' => 65536,
                'supportedGenerationMethods' => ['generateContent', 'countTokens'],
                'quota' => $this->determineRateLimits('gemini-2.5-flash'),
            ],
            [
                'id' => 'gemini-embedding-2',
                'name' => 'models/gemini-embedding-2',
                'displayName' => 'Gemini Embedding 2',
                'description' => 'High-dimensional vector embedding model for pgvector RAG memory indexing.',
                'inputTokenLimit' => 8192,
                'outputTokenLimit' => 768,
                'supportedGenerationMethods' => ['embedContent'],
                'quota' => $this->determineRateLimits('gemini-embedding-2'),
            ],
        ];
    }
}

