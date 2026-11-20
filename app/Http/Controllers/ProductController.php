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
        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        return Inertia::render('ProductPage', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'cart_items_count' => $cart_items_count,
        ]);
    }

    public function store(Request $request, $categoryId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'inventory_quantity' => 'required|numeric|min:0',
        ]);

        $category = Category::findOrFail($categoryId);

        Product::create([
            'pr_name' => $request->name,
            'pr_description' => $request->description,
            'brand' => $request->brand,
            'pr_price' => $request->price,
            'inventory_quantity' => $request->inventory_quantity,
            'category_id' => $category->category_id,
            'main_category_id' => $category->main_category_id,
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
            'inventory_quantity' => 'required|numeric|min:0',
        ]);

        $item->update([
            'pr_name' => $request->name,
            'brand' => $request->brand,
            'pr_description' => $request->description,
            'pr_price' => $request->price,
            'inventory_quantity' => $request->inventory_quantity,
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
        $product = Product::visibleTo(Auth::user())
            ->withAvailableInWindow(request(), false)
            ->with(['images', 'materials', 'colors', 'sizes'])
            ->findOrFail($id);

        $product->available_quantity = max(
            0,
            ((int) $product->inventory_quantity) - ((int) ($product->requested_quantity ?? 0))
        );

        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->select('products.product_id')
                ->pluck('product_id')
                ->toArray();
        }

        $flashMessage = session('success') ?? null;

        $perPage = request()->input('per_page', 8);
        $relatedProductsPaginated = Product::visibleTo(Auth::user())
            ->withAvailableInWindow(request())
            ->with(['images', 'colors', 'sizes'])
            ->where('category_id', $product->category_id)
            ->where('product_id', '!=', $product->product_id)
            ->latest()
            ->paginate($perPage);

        $relatedProducts = $relatedProductsPaginated->map(function ($related) {
                    return [
                        'id' => $related->product_id,
                        'title' => $related->pr_name,
                        'description' => $related->pr_description,
                        'inventory_quantity' => max(
                            0,
                            ((int) $related->inventory_quantity) - ((int) ($related->requested_quantity ?? 0))
                        ),
                        'price' => $related->pr_price,
                        'image' => ($related->images->first() && Storage::disk('public')->exists($related->images->first()->photo))
                            ? asset('storage/' . $related->images->first()->photo)
                            : asset('imgs/shopping.webp'),
                        'color_id' => optional($related->colors->first())->color_id,
                        'color' => optional($related->colors->first())->color,
                        'size_id' => optional($related->sizes->first())->size_id,
                        'size' => optional($related->sizes->first())->size,
                    ];
                }
            );

        $cart_items_count = count($cartItems);

        return Inertia::render('ProductPage', [
            'product' => $product,
            'cartItems' => $cartItems,
            'relatedProducts' => $relatedProducts,
            'pagination'    => [
                'current_page'  => $relatedProductsPaginated->currentPage(),
                'last_page'     => $relatedProductsPaginated->lastPage(),
                'per_page'      => $relatedProductsPaginated->perPage(),
                'total'         => $relatedProductsPaginated->total(),
                'path'          => $relatedProductsPaginated->path(),
            ],
            'cart_items_count' => $cart_items_count,
            'flash' => [
                'success' => $flashMessage,
            ],
        ]);
    }

    public function upload_image(Request $request)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'product_id' => 'required|exists:products,product_id',
        ]);

        $currentCount = Product_photos::where('product_id', $request->product_id)->count();
        $incomingCount = count($request->file('photos'));

        if ($currentCount + $incomingCount > 5) {
            return response()->json([
                'message' => 'Maximum of 5 images allowed per product. You can only add ' . (5 - $currentCount) . ' more.',
                'errors' => ['photos' => ['Exceeded maximum 5 images limit.']]
            ], 422);
        }

        foreach ($request->file('photos') as $photoFile) {
            $photoPath = $photoFile->store('products', 'public');
            Product_photos::create([
                'product_id' => $request->product_id,
                'photo' => $photoPath,
            ]);
        }

        return back()->with('success', 'Photos added successfully!');
    }

    public function addMaterial(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,product_id',
            'value' => 'required|string|max:255',
        ]);

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

        Size::create([
            'product_id' => $request->product_id,
            'size' => $request->value,
        ]);

        return back()->with('success', 'Size added successfully!');
    }

    public function search(Request $request, $date = null, $time = null)
    {
        $date = $date ?: $request->input('date', now()->format('Y-m-d'));
        $time = $time ?: $request->input('time', now()->format('H:i'));
        $query = $request->input('query');
        $perPage = request()->input('per_page', 12);

        $resultsPaginated = Product::visibleTo(Auth::user())
            ->withAvailableInWindow($request)
            ->where(function ($q) use ($query) {
                $q->where('pr_name', 'like', "%{$query}%")
                    ->orWhere('pr_description', 'like', "%{$query}%")
                    ->orWhere('brand', 'like', "%{$query}%");
            })
            ->with(['images' => function ($q) {
                $q->orderBy('product_id')->limit(1);
            }])
            ->paginate($perPage);

        $results = $resultsPaginated->map(function ($product) {
            $product->inventory_quantity = max(0, $product->inventory_quantity - ($product->requested_quantity ?? 0));
            return $product;
        });

        $user = Auth::user();
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

        $cart_items_count = count($cartItems);

        return Inertia::render('SearchResult', [
            'query' => $query,
            'results' => $results,
            'pagination'    => [
                'current_page'  => $resultsPaginated->currentPage(),
                'last_page'     => $resultsPaginated->lastPage(),
                'per_page'      => $resultsPaginated->perPage(),
                'total'         => $resultsPaginated->total(),
                'path'          => $resultsPaginated->path(),
            ],
            'cartItems' => $cartItems,
            'cart_items_count' => $cart_items_count,
        ]);
    }

    /**
     * Returns products available in a given booking time window with available quantities.
     */
    public function getAvailableProducts(Request $request)
    {
        $categoryId  = $request->input('category_id');
        $searchQuery = $request->input('query');

        $baseQuery = Product::visibleTo(Auth::user())
            ->with(['images', 'colors', 'sizes'])
            ->withAvailableInWindow($request);

        if ($categoryId) {
            $baseQuery->where('category_id', $categoryId);
        }
        if ($searchQuery) {
            $baseQuery->where(function ($q) use ($searchQuery) {
                $q->where('pr_name', 'like', "%{$searchQuery}%")
                  ->orWhere('pr_description', 'like', "%{$searchQuery}%")
                  ->orWhere('brand', 'like', "%{$searchQuery}%");
            });
        }

        $products = $baseQuery->latest()->get();

        return response()->json($this->formatProductsForApi($products));
    }

    private function formatProductsForApi($products)
    {
        return $products->map(function ($product) {
            $firstColor = $product->colors->first();
            $firstSize  = $product->sizes->first();
            $availQty   = max(0, $product->inventory_quantity - ($product->requested_quantity ?? 0));
            return [
                'id'                 => $product->product_id,
                'title'              => $product->pr_name,
                'brand'              => $product->brand ?? '',
                'description'        => $product->pr_description ?? '',
                'price'              => $product->pr_price,
                'inventory_quantity' => $availQty,
                'image'              => ($product->images->first() && Storage::disk('public')->exists($product->images->first()->photo))
                    ? asset('storage/' . $product->images->first()->photo)
                    : asset('imgs/shopping.webp'),
                'color'              => optional($firstColor)->color,
                'color_id'           => optional($firstColor)->color_id,
                'size'               => optional($firstSize)->size,
                'size_id'            => optional($firstSize)->size_id,
            ];
        })->values();
    }
}

