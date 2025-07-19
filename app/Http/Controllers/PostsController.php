<?php

namespace App\Http\Controllers;

use App\Enums\UserType;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use Illuminate\Support\Facades\Gate;

class PostsController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Post::class);

        $user = auth()->user();
        $is_admin = $user->user_type == UserType::Admin->value;
        $posts = Post::query()
            ->with('author:id,name,user_type')
            ->when($is_admin, fn($query) => $query->where('author_id', $user->id))
            ->latest()
            ->get();

        return inertia('Posts/Index', [
            'posts' => $posts,
            'isAdmin' => $is_admin,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create', Post::class);
        return inertia('Posts/Create', [
            'post' => new Post(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePostRequest $request)
    {
        Gate::authorize('create', Post::class);
        $data = $request->except(['image']);
        $data['author_id'] = auth()->id();
        $data['attachment_path'] = parent::storeFile($request->file('image'));
        Post::create($data);

        return redirect()->route('posts.index')
            ->with('success', __('Post created successfully.'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        Gate::authorize('view', $post);
        return inertia('Posts/Show', [
            'post' => $post->load('author:id,name,user_type'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        Gate::authorize('update', $post);
        return inertia('Posts/Edit', [
            'post' => $post->load('author:id,name,user_type'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        Gate::authorize('update', $post);
        $data = $request->all();
        logger($data);

        $data['attachment_path'] = parent::storeFile($request->file('image'), path: 'posts');

        $post->update($data);

        return redirect()->route('posts.index')
            ->with('success', __('Post updated successfully.'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        Gate::authorize('delete', $post);
        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', __('Post deleted successfully.'));
    }
}
