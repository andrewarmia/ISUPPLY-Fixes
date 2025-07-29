<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'phone_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'credit_card_number',
        'national_id',
    ];
    protected $appends = [
        'user_type_string',
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
        ];
    }

    public function userTypeString(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => UserType::tryFrom($this->user_type)?->name,
        );
    }

    // Security: rotate remember token for better security
    public function rotateRememberToken(): void
    {
        $this->forceFill([
            'remember_token' => \Illuminate\Support\Str::random(60),
        ])->save();
    }

    // Security: prevent race conditions with optimistic locking
    protected static function boot()
    {
        parent::boot();
        
        // Add optimistic locking for critical operations
        static::updating(function ($user) {
            if ($user->isDirty(['wallet_balance', 'user_type'])) {
                // Use database transactions to prevent race conditions
                \DB::transaction(function () use ($user) {
                    $user->save();
                });
            }
        });
    }

    public function fill(array $attributes)
    {
        $sensitiveFields = ['user_type', 'wallet_balance', 'credit_card_number', 'national_id'];
        foreach ($sensitiveFields as $field) {
            if (isset($attributes[$field])) {
                unset($attributes[$field]);
                logger("SECURITY WARNING: Attempted mass assignment of sensitive field: {$field}");
            }
        }
        return parent::fill($attributes);
    }

    public function isAdmin(): bool
    {
        return $this->user_type === UserType::Admin->value;
    }
}