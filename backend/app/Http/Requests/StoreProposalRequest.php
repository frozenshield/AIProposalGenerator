<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProposalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'ai_prompt_context' => ['required', 'string', 'max:1000'],
            'title' => ['nullable', 'string', 'max:255'],
            'ai_tone' => ['nullable', 'string', 'in:persuasive,formal,technical,executive,cost-saving'],
            'target_audience' => ['nullable', 'string', 'max:255'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'valid_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.catalog_item_id' => ['required', 'integer', 'exists:catalog_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.discount' => ['nullable', 'numeric', 'min:0', 'max:100'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'client_id' => 'client',
            'ai_prompt_context' => 'AI prompt context',
            'items.*.catalog_item_id' => 'catalog item',
            'items.*.quantity' => 'quantity',
            'items.*.discount' => 'discount',
        ];
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ai_prompt_context.max' => 'The AI prompt context must not exceed 1000 characters.',
            'items.min' => 'You must attach at least one deliverable item to the proposal.',
            'items.*.catalog_item_id.exists' => 'The selected catalog deliverable does not exist.',
        ];
    }
}

