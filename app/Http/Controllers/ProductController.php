<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Product_photos;
use App\Models\Category;
use App\Models\Material;
use App\Models\Size;
use App\Models\Color;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index($id)
    {
        $product = Product::with('images')->findOrFail($id);

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('product_id', '!=', $id)
            ->with('images')
            ->get();

        return Inertia::render('ProductPage', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    // Store a new product/item under a category
    public function store(Request $request, $categoryId)
    {
        $request->validate([
            'name' => 'required|string|max:255',        // frontend sends 'name'
            'brand' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        $category = Category::findOrFail($categoryId);

        $category->products()->create([
            'pr_name' => $request->name,
            'pr_description' => $request->description,
            'brand' => $request->brand,
            'pr_price' => $request->price,
        ]);

        return redirect()->back()->with('success', 'Item added successfully!');
    }

    public function update(Request $request, Product $item)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        $item->update([
            'pr_name' => $request->name,
            'brand' => $request->brand,
            'pr_description' => $request->description,
            'pr_price' => $request->price,
        ]);

        return redirect()->back()->with('success', 'Item updated!');
    }

    public function destroy(Product $item)
    {
        $categoryId = $item->category_id;
        DB::transaction(function () use ($item) {

            foreach ($item->images as $photo) {
                if ($photo->photo && Storage::disk('public')->exists($photo->photo)) {
                    Storage::disk('public')->delete($photo->photo);
                }
            }

            $item->images()->delete();
            $item->materials()->delete();
            $item->colors()->delete();
            $item->sizes()->delete();

            $item->delete();
        });

        return redirect()->route('categories.show', $categoryId) ->with('success', 'Item and all related data deleted successfully!');
    }

    public function show($id)
    {
        $product = Product::with(['images', 'materials', 'colors', 'sizes'])->findOrFail($id);

        $product->materials = $product->materials?->pluck('material_name')->toArray() ?? [];
        $product->colors = $product->colors?->pluck('color_name')->toArray() ?? [];
        $product->sizes = $product->sizes?->pluck('size')->toArray() ?? [];

        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->select('products.product_id')
                ->pluck('product_id')
                ->toArray();
        }

        $flashMessage = session('success') ?? null;

        $relatedProducts = Product::with(['images', 'colors', 'sizes'])
            ->where('category_id', $product->category_id)
            ->where('product_id', '!=', $product->product_id)
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($product) {
                    return [
                        'id' => $product->product_id,
                        'title' => $product->pr_name,
                        'description' => $product->pr_description,
                        'price' => $product->pr_price,
                        'image' => $product->images->first() ? '/markaz_alkarouz/public/storage/' . $product->images->first()->photo : '/markaz_alkarouz/public/imgs/shopping.webp',
                        'color_id' => optional($product->colors->first())->color_id,
                        'color' => optional($product->colors->first())->color,
                        'size_id' => optional($product->sizes->first())->size_id,
                        'size' => optional($product->sizes->first())->size,
                    ];
                }
            );

        return Inertia::render('ProductPage', [
            'product' => $product,
            'cartItems' => $cartItems,
            'relatedProducts' => $relatedProducts,
            'flash' => [
                'success' => $flashMessage,
            ],
        ]);
    }

    public function upload_image(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_id' => 'required|exists:products,product_id',
        ]);

        $photoPath = $request->file('photo')->store('products', 'public');

        Product_photos::create([
            'product_id' => $request->product_id,
            'photo' => $photoPath,
        ]);

        return back()->with('success', 'Photo added successfully!');
    }

    public function addMaterial(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'value' => 'required|string|max:255', // material name
        ]);

        // Insert into materials table
        Material::create([
            'product_id' => $request->product_id,
            'material_name' => $request->value,
        ]);

        return back()->with('success', 'Material added successfully!');
    }

    public function addColor(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'value' => 'required|string|max:255',
        ]);

        // Store in the colors table
        Color::create([
            'product_id' => $request->product_id,
            'color' => $request->value,
        ]);

        return back()->with('success', 'Color added successfully!');
    }

    public function addSize(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'value' => 'required|string|max:255',
        ]);

        // Store in the sizes table
        Size::create([
            'product_id' => $request->product_id,
            'size' => $request->value,
        ]);

        return back()->with('success', 'Size added successfully!');
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        // Get products with their first image
        $results = Product::where('pr_name', 'like', "%{$query}%")
            ->orWhere('pr_description', 'like', "%{$query}%")
            ->orWhere('brand', 'like', "%{$query}%")
            ->with(['images' => function ($q) {
                $q->orderBy('product_id')->limit(1); // get only the first image
            }])
            ->get();

        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        return Inertia::render('SearchResult', [
            'query' => $query,
            'results' => $results,
            'cartItems' => $cartItems,
        ]);
    }
}
