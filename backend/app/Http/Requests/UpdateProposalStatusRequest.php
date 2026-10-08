<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Proposal;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateProposalStatusRequest extends FormRequest
{
    /**
     * Allowed status transitions graph.
     */
    protected const ALLOWED_TRANSITIONS = [
        Proposal::STATUS_DRAFT => [Proposal::STATUS_SENT, Proposal::STATUS_LOST, Proposal::STATUS_DRAFT],
        Proposal::STATUS_SENT => [Proposal::STATUS_WON, Proposal::STATUS_LOST, Proposal::STATUS_DRAFT, Proposal::STATUS_SENT],
        Proposal::STATUS_WON => [Proposal::STATUS_WON], // Won proposals are immutable or terminal
        Proposal::STATUS_LOST => [Proposal::STATUS_DRAFT, Proposal::STATUS_LOST], // Can be reopened to draft
    ];

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
            'status' => [
                'required',
                'string',
                Rule::in(Proposal::VALID_STATUSES),
            ],
        ];
    }

    /**
     * Configure the validator instance with business transition rules.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            /** @var Proposal|null $proposal */
            $proposal = $this->route('proposal');
            $newStatus = (string) $this->input('status');

            if ($proposal instanceof Proposal) {
                $currentStatus = $proposal->status;
                $allowed = self::ALLOWED_TRANSITIONS[$currentStatus] ?? Proposal::VALID_STATUSES;

                if (!in_array($newStatus, $allowed, true)) {
                    $validator->errors()->add(
                        'status',
                        "Invalid status transition from '{$currentStatus}' to '{$newStatus}'."
                    );
                }
            }
        });
    }

    /**
     * Custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.in' => 'The proposal status must be one of: draft, sent, won, lost.',
        ];
    }
}

