<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS vector;');
        }

        Schema::create('successful_pitch_embeddings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('proposal_id')->nullable()->constrained('proposals')->nullOnDelete();
            $table->text('text_chunk');

            if (DB::getDriverName() === 'pgsql') {
                $table->vector('embedding', 768)->nullable();
            } else {
                $table->text('embedding')->nullable();
            }

            $table->string('industry')->nullable()->index();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });

        // Add HNSW vector index for high-speed cosine similarity searches if PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE INDEX IF NOT EXISTS pitch_embeddings_cosine_idx ON successful_pitch_embeddings USING hnsw (embedding vector_cosine_ops);');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('successful_pitch_embeddings');
    }
};
