<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->string('proposal_number')->unique();
            $table->string('title');
            $table->string('status')->default('draft')->index(); // 'draft', 'sent', 'won', 'lost'
            $table->text('ai_prompt_context');
            $table->string('ai_tone')->default('persuasive');
            $table->string('target_audience')->nullable();
            $table->decimal('subtotal', 12, 2)->default(0.00);
            $table->decimal('total_discount', 12, 2)->default(0.00);
            $table->decimal('discounted_subtotal', 12, 2)->default(0.00);
            $table->decimal('tax_rate', 5, 2)->default(0.00);
            $table->decimal('tax_amount', 12, 2)->default(0.00);
            $table->decimal('grand_total', 12, 2)->default(0.00);
            $table->unsignedInteger('valid_days')->default(30);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
