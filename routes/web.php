<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Home_controller;
use App\Http\Controllers\CategoriesController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\OsraController;
use App\Http\Controllers\ImportController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Public routes (guests + users)
|--------------------------------------------------------------------------
*/

Route::get('/', [Home_controller::class, 'index'])->name('home');

/*
    Sub Categories
*/

Route::get('/all-categories', [CategoriesController::class, 'index'])->name('categories.all');

Route::get('/categories/{category}', [CategoriesController::class, 'show'])->name('categories.show');

/*
    Main Categories
*/

Route::get('/categories', [CategoriesController::class, 'show_main'])->name('categories');

Route::get('/main_categories/{main_category_id}', [CategoriesController::class, 'show_one_main'])->name('show_main_category');

/*
    Products
*/

Route::get('/items/{id}', [ProductController::class, 'show'])->name('items.show');
Route::get('/search', [ProductController::class, 'search'])->name('search');

/*
|--------------------------------------------------------------------------
| Guest only
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'login'])->name('login.store');

    Route::get('/sign_up', [RegisteredUserController::class, 'user_sign_up'])->name('sign_up');
    Route::post('/sign_up', [RegisteredUserController::class, 'sign_up'])->name('sign_up.store');
});

/*
|--------------------------------------------------------------------------
| Authenticated users
|--------------------------------------------------------------------------
*/

Route::middleware('role:user,admin,manager')->group(function () {
    Route::get('/requests/{request}', [RequestController::class, 'show'])->name('requests.show');

    // Cart
    Route::get('/cart', [CartController::class, 'index'])->name('cart');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::delete('/cart/product', [CartController::class, 'removeProduct'])->name('cart.remove');

    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::post('/profile/update', [ProfileController::class, 'updateProfile'])->name('profile.update');
    Route::post('/profile/change-password', [ProfileController::class, 'changePassword'])->name('password.change');

    // Requests
    Route::post('/requests/create-from-cart', [RequestController::class, 'createFromCart'])
        ->name('requests.createFromCart');

    // Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});

/*
|--------------------------------------------------------------------------
| Admin & Manager
|--------------------------------------------------------------------------
*/

Route::middleware('role:admin,manager')->group(function () {
    Route::get('/requests', [RequestController::class, 'index'])->name('requests');
    Route::post('/requests/{request}/accept', [RequestController::class, 'accept'])->name('requests.accept');
    Route::post('/requests/{request}/done', [RequestController::class, 'done'])->name('requests.done');
});

/*
|--------------------------------------------------------------------------
| Manager only
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:manager'])->group(function () {

    // Main Categories
    Route::post('/main_categories', [CategoriesController::class, 'store_main'])->name('main_categories.store');
    Route::post('/main_categories/update/{category}', [CategoriesController::class, 'update_main'])->name('main_categories.update');
    Route::delete('/main_categories/delete/{category}', [CategoriesController::class, 'destroy_main'])->name('main_categories.destroy');

    // Sub Categories
    Route::post('/categories', [CategoriesController::class, 'store'])->name('categories.store');
    Route::put('/categories/{category}', [CategoriesController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoriesController::class, 'destroy'])->name('categories.destroy');

    // Products
    Route::post('/categories/{category}/items', [ProductController::class, 'store'])->name('categories.items.store');
    Route::put('/items/{item}', [ProductController::class, 'update'])->name('items.update');
    Route::delete('/items/{item}', [ProductController::class, 'destroy'])->name('items.destroy');

    Route::post('/images/add', [ProductController::class, 'upload_image'])->name('products.upload_image');
    Route::post('/products/add-material', [ProductController::class, 'addMaterial'])->name('products.add-material');
    Route::post('/products/add-color', [ProductController::class, 'addColor'])->name('products.add-color');
    Route::post('/products/add-size', [ProductController::class, 'addSize'])->name('products.add-size');

    // Osra
    Route::get('/osras', [OsraController::class, 'index'])->name('osra.index');
    Route::post('/osras/store', [OsraController::class, 'store'])->name('osra.store');
    Route::put('/osras/{osra}', [OsraController::class, 'update'])->name('osra.update');
    Route::delete('/osras/{osra}', [OsraController::class, 'destroy'])->name('osra.destroy');

    // Users
    Route::get('/users', [ProfileController::class, 'show_all_users'])->name('users.index');
    Route::get('/register', [RegisteredUserController::class, 'show'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
    Route::put('/users/{user:user_id}/update', [ProfileController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [ProfileController::class, 'destroy'])->name('users.destroy');
});

/*
|--------------------------------------------------------------------------
| Fallback
|--------------------------------------------------------------------------
*/

Route::fallback(function () {
    return Inertia::render('Errors/404');
});
