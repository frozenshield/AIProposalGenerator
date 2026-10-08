<?php

declare(strict_types=1);

namespace App\Exceptions;

use Exception;
use Throwable;

class GeminiApiException extends Exception
{
    protected ?int $statusCode;
    protected ?array $responseBody;

    public function __construct(
        string $message = 'An error occurred while communicating with the Gemini API.',
        int $code = 0,
        ?int $statusCode = null,
        ?array $responseBody = null,
        ?Throwable $previous = null
    ) {
        parent::__construct($message, $code, $previous);
        $this->statusCode = $statusCode;
        $this->responseBody = $responseBody;
    }

    public function getStatusCode(): ?int
    {
        return $this->statusCode;
    }

    public function getResponseBody(): ?array
    {
        return $this->responseBody;
    }
}

