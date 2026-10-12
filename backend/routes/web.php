<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PayMongoWebhookController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\ReferenceController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

// Public Root Redirect
Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
});

// System Reference Data Endpoint (for dynamic database-backed dropdowns)
Route::get('/api/reference-options', [ReferenceController::class, 'index'])->name('api.reference-options');
Route::get('/api/user', [AuthController::class, 'user'])->name('api.user');

// PayMongo Webhook Endpoint (Public, CSRF Exempt)
Route::post('/webhooks/paymongo', [PayMongoWebhookController::class, 'handle'])->name('webhooks.paymongo');

// PayMongo Checkout Session (Public / Authenticated)
Route::post('/subscription/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');
Route::post('/api/subscription/checkout', [SubscriptionController::class, 'checkout']);

// Guest Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/api/login', [AuthController::class, 'login']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/api/register', [AuthController::class, 'register']);
});

// Authenticated Tenant Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/api/logout', [AuthController::class, 'logout']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Clients Management
    Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
    Route::post('/clients', [ClientController::class, 'store'])->name('clients.store');
    Route::delete('/clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

    // Deliverables Catalog
    Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');
    Route::post('/catalog', [CatalogController::class, 'store'])->name('catalog.store');
    Route::post('/catalog/ai-generate', [CatalogController::class, 'aiGenerate'])->name('catalog.ai-generate');
    Route::delete('/catalog/{catalogItem}', [CatalogController::class, 'destroy'])->name('catalog.destroy');

    // AI Proposals Workflow
    Route::prefix('proposals')->name('proposals.')->group(function () {
        Route::get('/', [ProposalController::class, 'index'])->name('index');
        Route::get('/create', [ProposalController::class, 'create'])->name('create');
        Route::post('/', [ProposalController::class, 'store'])->name('store');
        Route::get('/{proposal}', [ProposalController::class, 'show'])->name('show');
        Route::patch('/{proposal}/status', [ProposalController::class, 'updateStatus'])->name('status.update');
    });
});

// Platform Administration Routes
use App\Http\Controllers\Admin\AdminController;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminController::class, 'showLogin'])->name('login');
    Route::post('/login', [AdminController::class, 'login']);
    Route::post('/logout', [AdminController::class, 'logout'])->name('logout');

    Route::middleware(['auth', 'admin'])->group(function () {
        Route::get('/', function () {
            return redirect()->route('admin.dashboard');
        });
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::post('/test-ai-studio', [AdminController::class, 'testAiStudio'])->name('test-ai-studio');
        Route::post('/users/{user}/toggle-pro', [AdminController::class, 'toggleUserPro'])->name('users.toggle-pro');
    });
});

