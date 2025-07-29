<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     * 
     * SECURITY FIX: Replace unprotected $guarded = [] with explicit $fillable array
     * to prevent mass assignment vulnerabilities and privilege escalation attacks.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_number',
        // SECURITY NOTE: Sensitive fields are explicitly excluded:
        // - user_type (prevents privilege escalation)
        // - wallet_balance (prevents financial fraud)
        // - credit_card_number (prevents payment info modification)
        // - national_id (prevents identity theft)
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'credit_card_number', // SECURITY FIX: Hide sensitive payment data
        'national_id', // SECURITY FIX: Hide sensitive identity data
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
            'wallet_balance' => 'decimal:2', // SECURITY FIX: Proper data type casting
        ];
    }

    /**
     * SECURITY FIX: Add authorization methods to prevent unauthorized access
     */
    
    /**
     * Check if user is an admin
     */
    public function isAdmin(): bool
    {
        return $this->user_type === 1;
    }

    /**
     * Check if user can modify sensitive fields
     */
    public function canModifySensitiveData(): bool
    {
        return $this->isAdmin();
    }

    /**
     * SECURITY FIX: Override fill method to prevent mass assignment of sensitive fields
     */
    public function fill(array $attributes)
    {
        // Remove sensitive fields from mass assignment
        $sensitiveFields = ['user_type', 'wallet_balance', 'credit_card_number', 'national_id'];
        
        foreach ($sensitiveFields as $field) {
            if (isset($attributes[$field])) {
                unset($attributes[$field]);
                logger("SECURITY WARNING: Attempted mass assignment of sensitive field: {$field}");
            }
        }
        
        return parent::fill($attributes);
    }
}