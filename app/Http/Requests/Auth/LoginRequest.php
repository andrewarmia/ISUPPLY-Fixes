<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     */
    public function authenticate(): void
    {
        // SECURITY FIX: Enable rate limiting to prevent brute force attacks
        $this->ensureIsNotRateLimited();

        // SECURITY FIX: Use Laravel's secure authentication instead of vulnerable custom logic
        if (!Auth::attempt([
            'email' => $this->input('email'),
            'password' => $this->input('password'),
        ], $this->boolean('remember'))) {
            // SECURITY FIX: Log failed attempts for security monitoring
            logger("Failed login attempt for user: " . substr($this->input('email'), 0, 3) . "***");
            
            RateLimiter::hit($this->throttleKey());
            
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        // SECURITY FIX: Clear rate limiter on successful authentication
        RateLimiter::clear($this->throttleKey());
        
        // SECURITY FIX: Log successful login for audit trail
        logger("Successful login for user: " . substr($this->input('email'), 0, 3) . "***");
    }

    /**
     * Ensure the login request is not rate limited.
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());
    }
}