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

        $perPage = request()->input('per_page', 8);
        $relatedProductsPaginated = Product::with(['images', 'colors', 'sizes'])
            ->where('category_id', $product->category_id)
            ->where('product_id', '!=', $product->product_id)
            ->latest()
            ->paginate($perPage);

        $relatedProducts = $relatedProductsPaginated->map(function ($product) {
                    return [
                        'id' => $product->product_id,
                        'title' => $product->pr_name,
                        'description' => $product->pr_description,
                        'inventory_quantity' => $product->inventory_quantity,
                        'price' => $product->pr_price,
                        'image' => $product->images->first() ? '/markaz_alkarouz/public/storage/' . $product->images->first()->photo : '/markaz_alkarouz/public/imgs/shopping.webp',
                        'color_id' => optional($product->colors->first())->color_id,
                        'color' => optional($product->colors->first())->color,
                        'size_id' => optional($product->sizes->first())->size_id,
                        'size' => optional($product->sizes->first())->size,
                    ];
                }
            );
        $cartItems = [];

        if ($user && $user->cart) {
            $cartItems = $user->cart->products()
                ->pluck('products.product_id')
                ->toArray();
        }

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

        $resultsPaginated = Product::availableAt($date, $time)
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
     * Returns products available (or partially available) in a given booking time window.
     * Used by the frontend BookingContext to refresh product lists when dates/times change.
     *
     * Accepts query params:
     *   time_type: "familyTime" | "customTime"
     *   For customTime: start_date, start_time, end_date, end_time
     *   For familyTime: osra_date, osra_numeric_time
     */
    public function getAvailableProducts(Request $request)
    {
        $timeType        = $request->input('time_type', 'familyTime');
        $startDate       = $request->input('start_date');
        $startTime       = $request->input('start_time');
        $endDate         = $request->input('end_date');
        $endTime         = $request->input('end_time');
        $osraDate        = $request->input('osra_date');
        $osraNumericTime = $request->input('osra_numeric_time');
        $categoryId      = $request->input('category_id');
        $searchQuery     = $request->input('query');

        // Base query with images
        $baseQuery = Product::with(['images', 'colors', 'sizes']);

        // Filter by category or search if provided
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

        // Determine which date/time to use for filtering
        if ($timeType === 'customTime' && $startDate && $startTime && $endDate && $endTime) {
            $filterDate = $startDate;
            $filterTime = $startTime;
        } elseif ($timeType === 'familyTime' && $osraDate && $osraNumericTime) {
            $filterDate = $osraDate;
            $filterTime = $osraNumericTime;
        } else {
            // No valid time given — return all products
            $products = $baseQuery->latest()->get();
            return response()->json($this->formatProductsForApi($products));
        }

        // 1. Products NOT requested in this window (fully available)
        $availableProducts = (clone $baseQuery)->availableAt($filterDate, $filterTime)->latest()->get();

        // 2. Products that ARE requested in this window but have remaining stock
        //    We get ALL products matching the base query, then for those NOT in availableProducts,
        //    check if inventory_quantity - sum(requested qty in window) > 0
        $allProducts = (clone $baseQuery)->latest()->get();
        $availableIds = $availableProducts->pluck('product_id')->toArray();

        $partialProducts = $allProducts->filter(function ($product) use ($availableIds, $filterDate, $filterTime, $timeType, $startDate, $startTime, $endDate, $endTime, $osraDate, $osraNumericTime) {
            // Already in available list — skip
            if (in_array($product->product_id, $availableIds)) {
                return false;
            }

            // Sum requested quantity for this product in the overlapping window
            $requestedQty = DB::table('request_products')
                ->join('requests', 'request_products.request_id', '=', 'requests.request_id')
                ->where('request_products.product_id', $product->product_id)
                ->where(function ($q) {
                    $q->where('requests.request_status', '!=', 'done')
                      ->orWhereNull('requests.request_status');
                })
                ->where(function ($q) use ($filterDate, $filterTime, $timeType, $startDate, $startTime, $endDate, $endTime, $osraDate, $osraNumericTime) {
                    if ($timeType === 'customTime') {
                        // Overlap: request overlaps with [startDate+startTime, endDate+endTime]
                        $q->where(function ($interval) use ($startDate, $startTime, $endDate, $endTime) {
                            $interval->whereNotNull('requests.start_date')
                                ->whereNotNull('requests.start_time')
                                ->whereNotNull('requests.end_date')
                                ->whereNotNull('requests.end_time')
                                ->where(function ($range) use ($startDate, $startTime, $endDate, $endTime) {
                                    $range->where(function ($rs) use ($endDate, $endTime) {
                                        $rs->where('requests.start_date', '<', $endDate)
                                           ->orWhere(function ($s) use ($endDate, $endTime) {
                                               $s->where('requests.start_date', $endDate)
                                                 ->where('requests.start_time', '<=', $endTime);
                                           });
                                    })->where(function ($re) use ($startDate, $startTime) {
                                        $re->where('requests.end_date', '>', $startDate)
                                           ->orWhere(function ($e) use ($startDate, $startTime) {
                                               $e->where('requests.end_date', $startDate)
                                                 ->where('requests.end_time', '>=', $startTime);
                                           });
                                    });
                                });
                        });
                    } else {
                        // Family time: exact match on osra_date + osra_numeric_time
                        $q->where('requests.osra_date', $osraDate)
                          ->where('requests.osra_numeric_time', $osraNumericTime);
                    }
                })
                ->sum('request_products.quantity');

            $remaining = $product->inventory_quantity - $requestedQty;
            return $remaining > 0;
        });

        // Merge: available first, then partial
        $result = $availableProducts->concat($partialProducts->values());

        return response()->json($this->formatProductsForApi($result));
    }

    private function formatProductsForApi($products)
    {
        return $products->map(function ($product) {
            $firstColor = $product->colors->first();
            $firstSize  = $product->sizes->first();
            return [
                'id'                 => $product->product_id,
                'title'              => $product->pr_name,
                'brand'              => $product->brand ?? '',
                'description'        => $product->pr_description ?? '',
                'price'              => $product->pr_price,
                'inventory_quantity' => $product->inventory_quantity,
                'image'              => $product->images->first()
                    ? '/markaz_alkarouz/public/storage/' . $product->images->first()->photo
                    : '/markaz_alkarouz/public/imgs/shopping.webp',
                'color'              => optional($firstColor)->color,
                'color_id'           => optional($firstColor)->color_id,
                'size'               => optional($firstSize)->size,
                'size_id'            => optional($firstSize)->size_id,
            ];
        })->values();
    }
}

