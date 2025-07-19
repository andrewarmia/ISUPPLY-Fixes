<?php

namespace App\Http\Controllers;

use Illuminate\Http\UploadedFile;

abstract class Controller
{

    protected function storeFile(?UploadedFile $file, ?string $path = 'uploads'): ?string
    {
        return $file?->storePubliclyAs($path, $file->getClientOriginalName(), 'public');
    }
}
