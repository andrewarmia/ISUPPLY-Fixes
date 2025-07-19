<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

abstract class BaseModelWithSecondaryUlid extends Model
{
    use HasUlids;

    public function uniqueIds(): array
    {
        return ['ulid'];
    }
}
