<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Main_Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        $categories = Category::all();
        return Inertia::render('Categories', [
            'categories' => $categories,
            'cart_items_count' => $cart_items_count,
            'linkBase' => '/markaz_alkarouz/public',
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
                'inventory_quantity'       => $product->inventory_quantity,
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
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        return Inertia::render('CategoryPage', [
            'category'      => $category,
            'products'      => $products,
            'default_image' => $defaultImage,
            'cart_items_count' => $cart_items_count,
            'cartItems'     => $cartItems,
            'linkBase' => '/markaz_alkarouz/public',
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:100',
            'category_description' => 'required|string',
            'main_category_id' => 'required',
            'category_photo' => 'required|image|mimes:jpg,png,jpeg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('category_photo')) {
            $photoPath = $request->file('category_photo')->store('categories', 'public');
        }

        Category::create([
            'category_name' => $request->category_name,
            'category_description' => $request->category_description,
            'category_photo' => $photoPath,
            'main_category_id' => $request->main_category_id,
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

        return redirect()->back()->with('success', 'Category Deleted!');
    }

    public function store_main(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:100',
            'category_description' => 'required|string',
            'category_photo' => 'required|image|mimes:jpg,png,jpeg,gif,webp|max:2048',
            'can_go_outside' => 'required',
        ]);
        
        if ($request->hasFile('category_photo')) {
            $photoPath = $request->file('category_photo')->store('main_categories', 'public');
        }

        $canGoOutside = $request->boolean('can_go_outside');

        Main_Category::create([
            'category_name' => $request->category_name,
            'category_description' => $request->category_description,
            'category_photo' => $photoPath,
            'can_go_outside' => $canGoOutside,
        ]);

        return redirect()->back()->with('success', 'Main Category added!');
    }

    public function show_main()
    {
        $main_categories = Main_Category::all();
        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);
        return Inertia::render('MainCategories',[
            'main_categories' => $main_categories,
            'cart_items_count' => $cart_items_count,
        ]);
    }

    public function show_one_main($main_category_id)
    {
        $categories = Category::where('main_category_id', $main_category_id)->get();
        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        return Inertia::render('Categories', [
            'categories' => $categories,
            'linkBase' => '/markaz_alkarouz/public',
            'cart_items_count' => $cart_items_count,
            'main_category_id'=> $main_category_id,
        ]);
    }

    public function update_main(Request $request, Main_Category $category)
    {
        $data = $request->validate([
            'category_name' => 'required|string|max:255',
            'category_description' => 'nullable|string',
            'category_photo' => 'nullable|image|mimes:jpg,png,jpeg,gif,webp|max:2048',
            'can_go_outside' => 'required',
        ]);

        if ($request->hasFile('category_photo')) {
            if (!empty($category->category_photo) && Storage::disk('public')->exists($category->category_photo)) {
                Storage::disk('public')->delete($category->category_photo);
            }
            $data['category_photo'] = $request->file('category_photo')->store('main_categories', 'public');
        }
        $category->can_go_outside = $request->boolean('can_go_outside');

        $category->update($data);
        return redirect()->back()->with('success', 'Main Category Updated!');
    }

    public function destroy_main(Main_Category $category)
    {
        if ($category->category_photo) {
            Storage::disk('public')->delete($category->category_photo);
        }

        foreach ($category->products as $product) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->photo);
            }
        }

        $sub_categories = Category::where("main_category_id", $category->category_id)->get();
        foreach($sub_categories as $sub_category){
            if($sub_category->category_photo){
                Storage::disk('public')->delete($sub_category->category_photo);
            }

            foreach ($sub_category->products as $product) {
                foreach ($product->images as $image) {
                    Storage::disk('public')->delete($image->photo);
                }
            }
        }

        $category->delete();

        return redirect()->back()->with('success', 'Main Category Deleted!');
    }
}
