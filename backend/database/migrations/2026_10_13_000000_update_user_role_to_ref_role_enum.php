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
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'ref_role')) {
                $table->enum('ref_role', ['admin', 'user'])
                    ->default('user')
                    ->after('email')
                    ->comment('User authorization role: admin or user only');
            }
        });

        // Copy existing role values to ref_role if role column exists
        if (Schema::hasColumn('users', 'role') && Schema::hasColumn('users', 'ref_role')) {
            DB::statement("UPDATE users SET ref_role = 'admin' WHERE role = 'admin'");
            DB::statement("UPDATE users SET ref_role = 'user' WHERE role != 'admin' OR role IS NULL");

            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('role');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('user')->after('email');
            }
        });

        if (Schema::hasColumn('users', 'ref_role') && Schema::hasColumn('users', 'role')) {
            DB::statement("UPDATE users SET role = ref_role::text");

            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('ref_role');
            });
        }
    }
};

