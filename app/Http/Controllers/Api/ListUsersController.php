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
        UserSearchResource::withoutWrapping();
        $keyword = $request->input('query');
        $users = User::query()
            ->when($keyword, function ($query) use ($keyword) {
                return $query->where('name', 'like', '%' . $keyword . '%')
                    ->orWhere('email', 'like', '%' . $keyword . '%')
                    ->orWhere('national_id', 'like', '%' . $keyword . '%');
            })
            ->get();

        return UserSearchResource::collection($users);
    }
}
