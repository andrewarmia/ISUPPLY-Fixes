<?php

namespace App\Http\Controllers;

use App\Enums\UserType;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $user = auth()->user();
        $is_admin = $user->user_type != UserType::Admin->value;
        $posts = collect();


        return Inertia::render('Dashboard', [
            'posts' => $posts,
            'isAdmin' => $is_admin,
        ]);
    }
}
