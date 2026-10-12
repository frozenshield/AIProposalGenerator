<?php

declare(strict_types=1);

use App\Http\Controllers\PayMongoWebhookController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and assigned to the "api"
| middleware group. Enjoy building your API!
|
*/

Route::post('/webhooks/paymongo', [PayMongoWebhookController::class, 'handle'])->name('api.webhooks.paymongo');
Route::post('/subscription/checkout', [SubscriptionController::class, 'checkout'])->name('api.subscription.checkout');
// Clients API
Route::get('/clients', [\App\Http\Controllers\ClientController::class, 'index']);
Route::post('/clients', [\App\Http\Controllers\ClientController::class, 'store']);
Route::delete('/clients/{client}', [\App\Http\Controllers\ClientController::class, 'destroy']);

// Catalog API
Route::get('/catalog', [\App\Http\Controllers\CatalogController::class, 'index']);
Route::post('/catalog', [\App\Http\Controllers\CatalogController::class, 'store']);
Route::post('/catalog/ai-generate', [\App\Http\Controllers\CatalogController::class, 'aiGenerate']);
Route::delete('/catalog/{catalogItem}', [\App\Http\Controllers\CatalogController::class, 'destroy']);

// Admin API endpoints
use App\Http\Controllers\Admin\AdminController;

Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminController::class, 'login']);
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
    Route::post('/test-ai-studio', [AdminController::class, 'testAiStudio']);
    Route::post('/users/{user}/toggle-pro', [AdminController::class, 'toggleUserPro']);
});

