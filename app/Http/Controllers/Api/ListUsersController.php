<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserSearchResource;
use App\Models\User;
use Illuminate\Http\Request;

class ListUsersController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // Security: validate and sanitize input parameters
        $request->validate([
            'query' => 'nullable|string|max:100|regex:/^[a-zA-Z0-9\s@.-]+$/',
        ]);

        UserSearchResource::withoutWrapping();
        $keyword = $request->input('query');
        
        // Security: sanitize the keyword to prevent injection
        $keyword = $keyword ? htmlspecialchars($keyword, ENT_QUOTES, 'UTF-8') : null;
        
        $users = User::query()
            ->when($keyword, function ($query) use ($keyword) {
                return $query->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('email', 'like', '%' . $keyword . '%')
                    ->orWhere('national_id', 'like', '%' . $keyword . '%');
            })
            ->limit(50) // Security: limit results to prevent data exposure
            ->get();

        return UserSearchResource::collection($users);
    }
}