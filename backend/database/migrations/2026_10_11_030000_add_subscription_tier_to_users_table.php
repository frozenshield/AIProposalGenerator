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
        Schema::table('users', function (Blueprint $table) {
            $table->string('subscription_tier')
                ->default('free')
                ->after('is_subscribed')
                ->comment('Subscription plan tier: free, pro, enterprise');

            $table->timestamp('subscribed_at')
                ->nullable()
                ->after('subscription_tier')
                ->comment('Timestamp when the user upgraded to Pro');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['subscription_tier', 'subscribed_at']);
        });
    }
};

