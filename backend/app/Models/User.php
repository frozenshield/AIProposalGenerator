<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'ref_role',
        'role',
        'proposals_count',
        'is_subscribed',
        'subscription_tier',
        'subscribed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The accessors to append to the model's array and JSON representation.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'role',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'ref_role' => 'string',
            'role' => 'string',
            'is_subscribed' => 'boolean',
            'subscription_tier' => 'string',
            'subscribed_at' => 'datetime',
            'proposals_count' => 'integer',
        ];
    }

    /**
     * Accessor for role to maintain backward compatibility mapping to ref_role.
     */
    public function getRoleAttribute(): string
    {
        return $this->attributes['ref_role'] ?? 'user';
    }

    /**
     * Mutator for role to set ref_role correctly.
     */
    public function setRoleAttribute(?string $value): void
    {
        $this->attributes['ref_role'] = ($value === 'admin') ? 'admin' : 'user';
    }

    /**
     * Check if the user has an active Pro subscription with perks unlocked.
     */
    public function isPro(): bool
    {
        return (bool) ($this->is_subscribed || $this->subscription_tier === 'pro' || $this->isAdmin());
    }

    /**
     * Check if the user is a platform administrator strictly by ref_role enum.
     */
    public function isAdmin(): bool
    {
        return ($this->ref_role === 'admin');
    }

    /**
     * Client accounts owned by the user.
     *
     * @return HasMany<Client, $this>
     */
    public function clients(): HasMany
    {
        return $this->hasMany(Client::class);
    }

    /**
     * Proposals created by the user.
     *
     * @return HasMany<Proposal, $this>
     */
    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class);
    }

    /**
     * Custom catalog items configured by the user.
     *
     * @return HasMany<CatalogItem, $this>
     */
    public function catalogItems(): HasMany
    {
        return $this->hasMany(CatalogItem::class);
    }

    /**
     * Check if user is eligible to create another proposal under the freemium model.
     */
    public function canCreateProposal(int $freeLimit = 3): bool
    {
        return $this->is_subscribed || $this->proposals_count < $freeLimit;
    }
}
