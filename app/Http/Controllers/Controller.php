<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\UploadedFile;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected function storeFile(?UploadedFile $file, ?string $path = 'uploads'): ?string
    {
        if (!$file) return null;
        $filename = basename($file->getClientOriginalName()); // Security: sanitize filename
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
        $filename = time() . '_' . $filename; // Add timestamp for uniqueness
        return $file->storePubliclyAs($path, $filename, 'public');
    }
}