<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return Inertia::render('Categories', [
            'categories' => $categories
        ]);
    }

    public function show(Category $category)
    {
        $category->load([
            'products.images' => function ($q) {
                $q->orderBy('photo_id');
            },
            'products.colors',
            'products.sizes',
        ]);

        $defaultImage = asset('imgs/shopping.webp');
        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->select('products.product_id')
                ->pluck('product_id')
                ->toArray();
        }

        $products = $category->products->map(function ($product) use ($defaultImage) {
            $firstColor = $product->colors->first();
            $firstSize = $product->sizes->first();
            return [
                'id'          => $product->product_id,
                'title'       => $product->pr_name,
                'brand'       => $product->brand,
                'description' => $product->pr_description,
                'price'       => $product->pr_price,
                'rating'      => 5,
                'image'       => $product->images->first()
                    ? '/markaz_alkarouz/public/storage/' . $product->images->first()->photo
                    : $defaultImage,
                'color'       => optional($firstColor)->color,
                'color_id'    => optional($firstColor)->color_id,
                'size'        => optional($firstSize)->size,
                'size_id'     => optional($firstSize)->size_id,
            ];
        });

        return Inertia::render('CategoryPage', [
            'category'      => $category,
            'products'      => $products,
            'default_image' => $defaultImage,
            'cartItems'     => $cartItems,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:100',
            'category_description' => 'required|string',
            'category_photo' => 'required|image|mimes:jpg,png,jpeg,gif,webp|max:2048',
        ]);

        $photoPath = $request->file('category_photo')->store('categories', 'public');

        Category::create([
            'category_name' => $request->category_name,
            'category_description' => $request->category_description,
            'category_photo' => $photoPath,
        ]);

        return redirect()->back()->with('success', 'Category added!');
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'category_name' => 'required|string|max:255',
            'category_description' => 'nullable|string',
            'category_photo' => 'nullable|image|mimes:jpg,png,jpeg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('category_photo')) {
            if (!empty($category->category_photo) && Storage::disk('public')->exists($category->category_photo)) {
                Storage::disk('public')->delete($category->category_photo);
            }
            $data['category_photo'] = $request->file('category_photo')->store('categories', 'public');
        }
        $category->update($data);
        return redirect()->back()->with('success', 'Category Updated!');
    }

    public function destroy(Category $category)
    {
        if ($category->category_photo) {
            Storage::disk('public')->delete($category->category_photo);
        }

        foreach ($category->products as $product) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->photo);
            }
        }

        $category->delete();

        return redirect()->route('categories')->with('success', 'Category Deleted!');
    }
}
