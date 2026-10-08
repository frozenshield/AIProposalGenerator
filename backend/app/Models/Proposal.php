<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proposal extends Model
{
    use HasFactory;

    public const STATUS_DRAFT = 'draft';
    public const STATUS_SENT = 'sent';
    public const STATUS_WON = 'won';
    public const STATUS_LOST = 'lost';

    public const VALID_STATUSES = [
        self::STATUS_DRAFT,
        self::STATUS_SENT,
        self::STATUS_WON,
        self::STATUS_LOST,
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'client_id',
        'proposal_number',
        'title',
        'status',
        'ai_prompt_context',
        'ai_tone',
        'target_audience',
        'subtotal',
        'total_discount',
        'discounted_subtotal',
        'tax_rate',
        'tax_amount',
        'grand_total',
        'valid_days',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'subtotal' => 'decimal:2',
            'total_discount' => 'decimal:2',
            'discounted_subtotal' => 'decimal:2',
            'tax_rate' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'grand_total' => 'decimal:2',
            'valid_days' => 'integer',
        ];
    }

    /**
     * The client this proposal belongs to.
     *
     * @return BelongsTo<Client, $this>
     */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * The modular content sections generated for this proposal.
     *
     * @return HasMany<ProposalSection, $this>
     */
    public function sections(): HasMany
    {
        return $this->hasMany(ProposalSection::class)->orderBy('order_index');
    }

    /**
     * The itemized pricing and deliverables for this proposal.
     *
     * @return HasMany<ProposalLineItem, $this>
     */
    public function lineItems(): HasMany
    {
        return $this->hasMany(ProposalLineItem::class);
    }

    /**
     * Vector embeddings associated with this proposal (e.g. from won pitches).
     *
     * @return HasMany<SuccessfulPitchEmbedding, $this>
     */
    public function pitchEmbeddings(): HasMany
    {
        return $this->hasMany(SuccessfulPitchEmbedding::class);
    }

    /**
     * Check if proposal is marked as won.
     */
    public function isWon(): bool
    {
        return $this->status === self::STATUS_WON;
    }
}

