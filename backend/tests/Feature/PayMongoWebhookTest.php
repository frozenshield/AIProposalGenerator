<?php

declare(strict_types=1);

namespace Tests\Feature;

use Tests\TestCase;

class PayMongoWebhookTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['services.paymongo.webhook_secret' => 'whsec_test_secret_key_12345']);
    }
    public function test_rejects_webhook_without_signature(): void
    {
        $response = $this->postJson('/api/webhooks/paymongo', [
            'data' => ['attributes' => ['type' => 'checkout_session.payment.paid']],
        ]);

        $response->assertStatus(400);
        $response->assertJson(['error' => 'Invalid or missing signature.']);
    }

    public function test_rejects_webhook_with_invalid_signature(): void
    {
        $payload = json_encode(['data' => ['attributes' => ['type' => 'checkout_session.payment.paid']]]);

        $response = $this->call(
            'POST',
            '/api/webhooks/paymongo',
            [],
            [],
            [],
            [
                'HTTP_PAYMONGO_SIGNATURE' => 't=1614238545,te=invalidhash,li=invalidhash',
                'CONTENT_TYPE' => 'application/json',
            ],
            $payload
        );

        $response->assertStatus(400);
        $response->assertJson(['error' => 'Signature verification failed.']);
    }

    public function test_accepts_and_verifies_valid_signature_and_upgrades_user_to_pro(): void
    {
        config(['services.paymongo.webhook_secret' => 'whsec_test_secret_key_12345']);

        $user = \App\Models\User::factory()->create([
            'is_subscribed' => false,
            'subscription_tier' => 'free',
        ]);

        $payload = json_encode([
            'data' => [
                'id' => 'evt_test_123',
                'attributes' => [
                    'type' => 'checkout_session.payment.paid',
                    'data' => [
                        'attributes' => [
                            'reference_number' => 'PROP-SUB-' . $user->id . '-' . time(),
                            'metadata' => [
                                'user_id' => $user->id,
                            ],
                        ],
                    ],
                ],
            ],
        ]);

        $timestamp = (string) time();
        $secret = 'whsec_test_secret_key_12345';
        $computedHash = hash_hmac('sha256', "{$timestamp}.{$payload}", $secret);
        $signatureHeader = "t={$timestamp},te={$computedHash}";

        $response = $this->call(
            'POST',
            '/api/webhooks/paymongo',
            [],
            [],
            [],
            [
                'HTTP_PAYMONGO_SIGNATURE' => $signatureHeader,
                'CONTENT_TYPE' => 'application/json',
            ],
            $payload
        );

        $response->assertStatus(200);
        $response->assertJson([
            'status' => 'success',
            'message' => 'Webhook received and processed.',
        ]);

        // Assert user record in database is upgraded to Pro
        $this->assertTrue($user->fresh()->is_subscribed);
        $this->assertEquals('pro', $user->fresh()->subscription_tier);
        $this->assertNotNull($user->fresh()->subscribed_at);
    }
}
