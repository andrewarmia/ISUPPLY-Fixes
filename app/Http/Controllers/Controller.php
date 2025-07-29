<?php

namespace App\Http\Controllers;

use Illuminate\Http\UploadedFile;

abstract class Controller
{

protected function storeFile(?UploadedFile $file, ?string $path = 'uploads'): ?string
{
    if (!$file) return null;
    
    // Security: sanitize filename to prevent path traversal
    $filename = basename($file->getClientOriginalName());
    $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
    $filename = time() . '_' . $filename;
    
    return $file->storePubliclyAs($path, $filename, 'public');
}
}
