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
        Schema::create('reference_options', function (Blueprint $table) {
            $table->id();
            $table->string('category')->index(); // 'ai_tone', 'strategic_angle', 'ai_model', 'industry'
            $table->string('key')->index();      // e.g. 'persuasive', 'cost_saving', 'gemini-flash-lite'
            $table->string('label');             // Display name
            $table->text('value')->nullable();   // Prompt template text or metadata
            $table->string('badge')->nullable(); // e.g. 'Popular', 'Pro Only'
            $table->unsignedInteger('order_index')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reference_options');
    }
};
