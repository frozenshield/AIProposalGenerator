<?php

declare(strict_types=1);

use App\Http\Controllers\ProposalController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/proposals/create');

Route::prefix('proposals')->name('proposals.')->group(function () {
    Route::get('/', [ProposalController::class, 'index'])->name('index');
    Route::get('/create', [ProposalController::class, 'create'])->name('create');
    Route::post('/', [ProposalController::class, 'store'])->name('store');
    Route::get('/{proposal}', [ProposalController::class, 'show'])->name('show');
    Route::patch('/{proposal}/status', [ProposalController::class, 'updateStatus'])->name('status.update');
});
