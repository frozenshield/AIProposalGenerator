<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Exceptions\GeminiApiException;
use App\Services\GeminiService;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiServiceTest extends TestCase
{
    protected GeminiService $service;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.gemini.api_key', 'test_gemini_api_key_123');
        Config::set('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta');
        Config::set('services.gemini.models.embedding', 'gemini-embedding-2');
        Config::set('services.gemini.models.pro', 'gemini-2.5-pro');
        Config::set('services.gemini.models.flash', 'gemini-2.5-flash');

        $this->service = new GeminiService();
    }

    public function test_throws_exception_if_api_key_is_missing(): void
    {
        Config::set('services.gemini.api_key', '');
        $service = new GeminiService();

        $this->expectException(GeminiApiException::class);
        $this->expectExceptionMessage('Gemini API key is not configured');

        $service->generateEmbedding('test prompt');
    }

    public function test_generate_embedding_success(): void
    {
        Http::fake([
            '*/models/gemini-embedding-2:embedContent*' => Http::response([
                'embedding' => [
                    'values' => [0.123, -0.456, 0.789],
                ],
            ], 200),
        ]);

        $vector = $this->service->generateEmbedding('enterprise cloud migration');

        $this->assertCount(3, $vector);
        $this->assertEquals([0.123, -0.456, 0.789], $vector);

        Http::assertSent(function ($request) {
            return $request->hasHeader('x-goog-api-key', 'test_gemini_api_key_123')
                && str_contains($request->url(), 'models/gemini-embedding-2:embedContent');
        });
    }

    public function test_generate_content_structured_json(): void
    {
        $mockJson = json_encode([
            'executive_summary' => 'Sample summary pitch',
            'scope_and_timeline' => [
                [
                    'title' => 'Phase 1',
                    'duration' => 'Week 1',
                    'description' => 'Discovery',
                    'deliverable' => 'Roadmap',
                ],
            ],
            'closing' => 'Closing terms',
        ]);

        Http::fake([
            '*/models/gemini-2.5-pro:generateContent*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => $mockJson],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $schema = ['type' => 'OBJECT'];
        $result = $this->service->generateContent('Generate pitch', 'gemini-2.5-pro', $schema);

        $this->assertIsArray($result);
        $this->assertEquals('Sample summary pitch', $result['executive_summary']);
        $this->assertCount(1, $result['scope_and_timeline']);
    }

    public function test_handles_markdown_wrapped_json_response(): void
    {
        $wrapped = "```json\n" . json_encode(['status' => 'success']) . "\n```";

        $parsed = $this->service->parseJsonPayload($wrapped);

        $this->assertEquals(['status' => 'success'], $parsed);
    }

    public function test_api_failure_throws_gemini_api_exception(): void
    {
        Http::fake([
            '*/models/gemini-2.5-pro:generateContent*' => Http::response([
                'error' => [
                    'code' => 429,
                    'message' => 'Resource has been exhausted (rate limit).',
                ],
            ], 429),
        ]);

        $this->expectException(GeminiApiException::class);
        $this->expectExceptionMessage('Gemini generation failed');

        $this->service->generateContent('Test prompt');
    }
}

