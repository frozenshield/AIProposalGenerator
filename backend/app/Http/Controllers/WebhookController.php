<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * Handle incoming PayMongo Webhook events.
     * Listens for checkout_session.payment.paid to upgrade user to Pro.
     */
    public function paymongo(Request $request): JsonResponse
    {
        $payload = $request->all();
        $eventType = $request->input('data.attributes.type');

        Log::info('PayMongo webhook received', [
            'type' => $eventType,
            'id' => $request->input('data.id'),
        ]);

        // Verify the event type
        if ($eventType === 'checkout_session.payment.paid' || $eventType === 'payment.paid') {
            // Extract user_id from checkout_session metadata
            $metadata = $request->input('data.attributes.data.attributes.metadata', []);
            $userId = $metadata['user_id'] ?? null;

            // Fallback: extract from reference_number (e.g. PROP-SUB-1-1718000000)
            if (!$userId) {
                $ref = $request->input('data.attributes.data.attributes.reference_number');
                if ($ref && preg_match('/PROP-SUB-(\d+)-/', $ref, $matches)) {
                    $userId = $matches[1];
                }
            }

            if ($userId) {
                $user = User::find($userId);

                if ($user) {
                    $user->update([
                        'is_subscribed' => true,
                    ]);

                    Log::info("User ID {$userId} upgraded to Pro via PayMongo Webhook", [
                        'email' => $user->email,
                    ]);

                    return response()->json([
                        'status' => 'success',
                        'message' => 'User subscription updated successfully',
                        'user_id' => $userId,
                    ], 200);
                } else {
                    Log::warning("PayMongo webhook user ID {$userId} not found in database");
                }
            } else {
                Log::warning('PayMongo webhook received without recognizable user_id in metadata', [
                    'payload' => $payload,
                ]);
            }
        }

        // Always return 200 OK to acknowledge receipt to PayMongo
        return response()->json([
            'status' => 'acknowledged',
            'event' => $eventType,
        ], 200);
    }
}

