<?php

use App\Http\Controllers\Api\ListUsersController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


//TODO enable route authentication
//Route::middleware(['auth:sanctum'])->group(function () {
Route::get('users', ListUsersController::class)->name('api.users.search');

//});
