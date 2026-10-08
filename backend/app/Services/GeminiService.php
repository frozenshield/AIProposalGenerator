<?php

declare(strict_types=1);

namespace App\Services;

use App\Exceptions\GeminiApiException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $embeddingModel;
    protected string $proModel;
    protected string $flashModel;

    public function __construct()
    {
        $this->apiKey = (string) config('services.gemini.api_key', '');
        $this->baseUrl = rtrim((string) config('services.gemini.base_url', 'https://generativelanguage.googleapis.com/v1beta'), '/');
        $this->embeddingModel = (string) config('services.gemini.models.embedding', 'gemini-embedding-2');
        $this->proModel = (string) config('services.gemini.models.pro', 'gemini-2.5-pro');
        $this->flashModel = (string) config('services.gemini.models.flash', 'gemini-2.5-flash');
    }

    /**
     * Generate an embedding vector using the Gemini embedding API.
     *
     * @param string $text
     * @param string|null $model
     * @return array<float>
     * @throws GeminiApiException
     */
    public function generateEmbedding(string $text, ?string $model = null): array
    {
        $this->ensureApiKeyConfigured();

        $targetModel = $model ?? $this->embeddingModel;
        $url = "{$this->baseUrl}/models/{$targetModel}:embedContent";

        $payload = [
            'model' => "models/{$targetModel}",
            'content' => [
                'parts' => [
                    ['text' => $text],
                ],
            ],
        ];

        try {
            $response = Http::withHeaders([
                'x-goog-api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])
            ->timeout(30)
            ->retry(2, 500, throw: false)
            ->post($url, $payload);

            if ($response->failed()) {
                Log::error('Gemini Embedding API Error', [
                    'status' => $response->status(),
                    'body' => $response->json(),
                ]);
                throw new GeminiApiException(
                    message: "Gemini embedding request failed: " . ($response->json('error.message') ?? $response->body()),
                    statusCode: $response->status(),
                    responseBody: $response->json()
                );
            }

            $data = $response->json();
            $values = $data['embedding']['values'] ?? null;

            if (!is_array($values) || empty($values)) {
                throw new GeminiApiException(
                    message: 'Gemini embedding response did not contain valid vector values.',
                    responseBody: $data
                );
            }

            return array_map('floatval', $values);
        } catch (ConnectionException | RequestException $e) {
            Log::error('Gemini Embedding Connection Exception', ['error' => $e->getMessage()]);
            throw new GeminiApiException("Network error connecting to Gemini API: {$e->getMessage()}", 0, null, null, $e);
        }
    }

    /**
     * Generate content with Gemini (text or structured JSON).
     *
     * @param string $prompt
     * @param string|null $model
     * @param array<string, mixed>|null $responseSchema
     * @param string|null $systemInstruction
     * @param float $temperature
     * @return array<string, mixed>|string
     * @throws GeminiApiException
     */
    public function generateContent(
        string $prompt,
        ?string $model = null,
        ?array $responseSchema = null,
        ?string $systemInstruction = null,
        float $temperature = 0.7
    ): array|string {
        $this->ensureApiKeyConfigured();

        $targetModel = $model ?? $this->proModel;
        $url = "{$this->baseUrl}/models/{$targetModel}:generateContent";

        $generationConfig = [
            'temperature' => $temperature,
        ];

        if ($responseSchema !== null) {
            $generationConfig['responseMimeType'] = 'application/json';
            $generationConfig['responseSchema'] = $responseSchema;
        }

        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $prompt],
                    ],
                ],
            ],
            'generationConfig' => $generationConfig,
        ];

        if ($systemInstruction !== null) {
            $payload['systemInstruction'] = [
                'parts' => [
                    ['text' => $systemInstruction],
                ],
            ];
        }

        try {
            $response = Http::withHeaders([
                'x-goog-api-key' => $this->apiKey,
                'Content-Type' => 'application/json',
            ])
            ->timeout(90)
            ->retry(2, 500, throw: false)
            ->post($url, $payload);

            if ($response->failed()) {
                Log::error('Gemini GenerateContent API Error', [
                    'status' => $response->status(),
                    'body' => $response->json(),
                ]);
                throw new GeminiApiException(
                    message: "Gemini generation failed: " . ($response->json('error.message') ?? $response->body()),
                    statusCode: $response->status(),
                    responseBody: $response->json()
                );
            }

            $data = $response->json();
            $rawText = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if ($rawText === null) {
                throw new GeminiApiException(
                    message: 'Gemini API returned an empty or invalid candidate structure.',
                    responseBody: $data
                );
            }

            // If a structured schema was requested, parse and validate JSON
            if ($responseSchema !== null) {
                return $this->parseJsonPayload($rawText);
            }

            return $rawText;
        } catch (ConnectionException | RequestException $e) {
            Log::error('Gemini GenerateContent Connection Error', ['error' => $e->getMessage()]);
            throw new GeminiApiException("Network error connecting to Gemini API: {$e->getMessage()}", 0, null, null, $e);
        }
    }

    /**
     * Extract structured pricing and totals using gemini-2.5-flash.
     *
     * @param array<int, array<string, mixed>> $rawItems
     * @param float $taxRate
     * @return array<string, mixed>
     * @throws GeminiApiException
     */
    public function extractStructuredPricing(array $rawItems, float $taxRate = 0.0): array
    {
        $schema = [
            'type' => 'OBJECT',
            'properties' => [
                'items' => [
                    'type' => 'ARRAY',
                    'items' => [
                        'type' => 'OBJECT',
                        'properties' => [
                            'catalog_item_id' => ['type' => 'INTEGER'],
                            'name' => ['type' => 'STRING'],
                            'unit_price' => ['type' => 'NUMBER'],
                            'quantity' => ['type' => 'INTEGER'],
                            'discount' => ['type' => 'NUMBER'],
                            'line_total' => ['type' => 'NUMBER'],
                        ],
                        'required' => ['name', 'unit_price', 'quantity', 'line_total'],
                    ],
                ],
                'subtotal' => ['type' => 'NUMBER'],
                'total_discount' => ['type' => 'NUMBER'],
                'discounted_subtotal' => ['type' => 'NUMBER'],
                'tax_rate' => ['type' => 'NUMBER'],
                'tax_amount' => ['type' => 'NUMBER'],
                'grand_total' => ['type' => 'NUMBER'],
            ],
            'required' => ['items', 'subtotal', 'grand_total'],
        ];

        $prompt = "Extract and normalize pricing line items and recalculate accurate financials given a tax rate of {$taxRate}%:\n"
            . json_encode($rawItems, JSON_PRETTY_PRINT);

        /** @var array<string, mixed> $result */
        $result = $this->generateContent(
            prompt: $prompt,
            model: $this->flashModel,
            responseSchema: $schema,
            systemInstruction: 'You are an enterprise financial auditor. Compute precise totals with zero rounding errors.',
            temperature: 0.1
        );

        return $result;
    }

    /**
     * Safely parse JSON strings, removing Markdown code block artifacts if present.
     *
     * @param string $rawJson
     * @return array<string, mixed>
     * @throws GeminiApiException
     */
    public function parseJsonPayload(string $rawJson): array
    {
        $cleaned = trim($rawJson);

        // Strip ```json ... ``` code fence if returned
        if (str_starts_with($cleaned, '```')) {
            $cleaned = (string) preg_replace('/^```(?:json)?\s*/i', '', $cleaned);
            $cleaned = (string) preg_replace('/\s*```$/', '', $cleaned);
        }

        $decoded = json_decode(trim($cleaned), true);

        if (!is_array($decoded)) {
            throw new GeminiApiException(
                message: "Failed to parse JSON response from Gemini API: " . json_last_error_msg(),
                responseBody: ['raw_content' => $rawJson]
            );
        }

        return $decoded;
    }

    /**
     * Ensure the API key is present before attempting an external HTTP call.
     *
     * @throws GeminiApiException
     */
    protected function ensureApiKeyConfigured(): void
    {
        if (empty($this->apiKey)) {
            throw new GeminiApiException(
                'Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file or config/services.php.'
            );
        }
    }
}
