<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PayMongoWebhookController extends Controller
{
    /**
     * Handle incoming PayMongo Webhook events.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function handle(Request $request): JsonResponse
    {
        $signatureHeader = $request->header('paymongo-signature');
        $rawPayload = $request->getContent();
        $webhookSecret = (string) (config('services.paymongo.webhook_secret') ?: env('PAYMONGO_WEBHOOK_SECRET'));

        // 1. Signature validation: Ensure header and secret are present
        if (empty($signatureHeader) || empty($webhookSecret) || empty($rawPayload)) {
            Log::warning('PayMongo webhook rejected: missing signature, secret, or payload.', [
                'has_signature' => !empty($signatureHeader),
                'has_secret' => !empty($webhookSecret),
            ]);

            return response()->json([
                'error' => 'Invalid or missing signature.',
            ], 400);
        }

        // 2. PayMongo Signature Verification (HMAC-SHA256)
        // PayMongo sends signatures in the format: t=<timestamp>,te=<test_signature>,li=<live_signature>
        if (!$this->verifyPayMongoSignature($signatureHeader, $rawPayload, $webhookSecret)) {
            Log::warning('PayMongo webhook rejected: signature verification failed.', [
                'signature_header' => $signatureHeader,
            ]);

            return response()->json([
                'error' => 'Signature verification failed.',
            ], 400);
        }

        // 3. Parse JSON payload
        $payload = json_decode($rawPayload, true);

        if (!is_array($payload)) {
            return response()->json([
                'error' => 'Invalid JSON payload.',
            ], 400);
        }

        $eventType = $payload['data']['attributes']['type'] ?? null;

        Log::info('PayMongo webhook signature verified successfully.', [
            'event_type' => $eventType,
            'event_id' => $payload['data']['id'] ?? null,
        ]);

        // 4. Handle checkout_session.payment.paid event
        if ($eventType === 'checkout_session.payment.paid') {
            $eventData = $payload['data']['attributes']['data'] ?? [];
            $attributes = $eventData['attributes'] ?? [];

            // Extract metadata passed when creating the checkout session
            $metadata = $attributes['metadata'] ?? [];
            $userId = $metadata['user_id'] ?? null;
            $proposalId = $metadata['proposal_id'] ?? null;
            $referenceNumber = $attributes['reference_number'] ?? null;

            // =========================================================================
            // DATABASE LOGIC PLACEHOLDER: MARK PROPOSAL AS PAID / UNLOCK USER CREDITS
            // =========================================================================
            // Example:
            // 1. If paying for a specific AI Proposal:
            //    if ($proposalId) {
            //        $proposal = Proposal::find($proposalId);
            //        if ($proposal) {
            //            $proposal->update([
            //                'status' => 'won', // or 'paid'
            //                'paid_at' => now(),
            //            ]);
            //        }
            //    }
            //
            // 2. If upgrading user subscription or unlocking AI proposal credits:
            //    if ($userId) {
            //        $user = User::find($userId);
            //        if ($user) {
            //            $user->update([
            //                'is_subscribed' => true,
            //                // 'credits' => $user->credits + 100, // or unlock quota
            //            ]);
            //        }
            //    }
            // =========================================================================

            Log::info('PayMongo checkout session paid event processed.', [
                'user_id' => $userId,
                'proposal_id' => $proposalId,
                'reference_number' => $referenceNumber,
            ]);
        }

        // 5. Return 200 HTTP status code so PayMongo acknowledges receipt
        return response()->json([
            'status' => 'success',
            'message' => 'Webhook received and processed.',
        ], 200);
    }

    /**
     * Verify PayMongo webhook signature.
     *
     * Header format: "t=1614238545,te=xxxx,li=yyyy"
     * - t: Timestamp
     * - te: Test mode signature
     * - li: Live mode signature
     *
     * Signature hash: hash_hmac('sha256', "{$timestamp}.{$rawPayload}", $webhookSecret)
     */
    protected function verifyPayMongoSignature(string $header, string $rawPayload, string $secret): bool
    {
        $parts = explode(',', $header);
        $signatureData = [];

        foreach ($parts as $part) {
            $pair = explode('=', trim($part), 2);
            if (count($pair) === 2) {
                $signatureData[$pair[0]] = $pair[1];
            }
        }

        $timestamp = $signatureData['t'] ?? null;
        $testSignature = $signatureData['te'] ?? null;
        $liveSignature = $signatureData['li'] ?? null;

        // If PayMongo signature header is in standard format (t + te/li)
        if ($timestamp && ($testSignature || $liveSignature)) {
            $computedHash = hash_hmac('sha256', "{$timestamp}.{$rawPayload}", $secret);

            if ($testSignature && hash_equals($computedHash, $testSignature)) {
                return true;
            }

            if ($liveSignature && hash_equals($computedHash, $liveSignature)) {
                return true;
            }

            return false;
        }

        // Direct fallback: In case signature is passed directly as a hash
        $directHash = hash_hmac('sha256', $rawPayload, $secret);
        return hash_equals($directHash, $header);
    }
}

