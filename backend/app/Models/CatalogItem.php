<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatalogItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'category',
        'unit_price',
        'unit',
        'default_quantity',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'default_quantity' => 'integer',
        ];
    }

    /**
     * Get all proposal line items that reference this catalog item.
     *
     * @return HasMany<ProposalLineItem, $this>
     */
    public function proposalLineItems(): HasMany
    {
        return $this->hasMany(ProposalLineItem::class);
    }
}

