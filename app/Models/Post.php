<?php

namespace App\Models;

use App\Policies\PostPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[UsePolicy(PostPolicy::class)]
class Post extends BaseModelWithSecondaryUlid
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'author_id', 'attachment_path'];

    protected $appends = [
        'attachment_url'
    ];

    public function uniqueIds(): array
    {
        return ['post_id'];
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function attachmentUrl(): Attribute
    {
        return new Attribute(
            get: fn($file) => Storage::disk('public')->url($this->attachment_path),
        );
    }
}
