<?php

namespace Tests\Feature\Audit;

use App\Models\Category;
use App\Models\Main_Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SeoAndPwaTest extends TestCase
{
    use DatabaseTransactions;

    public function test_home_includes_meta_description_og_tags_and_root_manifest(): void
    {
        $response = $this->get('/home');

        $response->assertOk();
        $response->assertSee('<meta name="description"', false);
        $response->assertSee('<meta property="og:title"', false);
        $response->assertSee('<link rel="canonical"', false);
        $response->assertSee('<link rel="manifest" href="/manifest.json">', false);
    }

    public function test_sitemap_xml_lists_only_public_can_go_outside_resources(): void
    {
        $publicMain = Main_Category::create([
            'category_name' => 'Public Main SEO',
            'category_description' => 'Desc',
            'can_go_outside' => 1,
        ]);
        $hiddenMain = Main_Category::create([
            'category_name' => 'Hidden Main SEO',
            'category_description' => 'Desc',
            'can_go_outside' => 0,
        ]);

        $publicSub = Category::create([
            'category_name' => 'Public Sub SEO',
            'category_description' => 'Desc',
            'main_category_id' => $publicMain->category_id,
        ]);
        $hiddenSub = Category::create([
            'category_name' => 'Hidden Sub SEO',
            'category_description' => 'Desc',
            'main_category_id' => $hiddenMain->category_id,
        ]);

        $publicProd = Product::create([
            'pr_name' => 'Public Prod SEO',
            'brand' => 'B',
            'pr_description' => 'D',
            'pr_price' => 10,
            'inventory_quantity' => 2,
            'category_id' => $publicSub->category_id,
        ]);
        $hiddenProd = Product::create([
            'pr_name' => 'Hidden Prod SEO',
            'brand' => 'B',
            'pr_description' => 'D',
            'pr_price' => 10,
            'inventory_quantity' => 2,
            'category_id' => $hiddenSub->category_id,
        ]);

        $response = $this->get('/sitemap.xml');
        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $response->assertSee("/items/{$publicProd->product_id}", false);
        $response->assertDontSee("/items/{$hiddenProd->product_id}", false);
        $response->assertDontSee("/categories/{$hiddenSub->category_id}", false);
        $response->assertDontSee("/main_categories/{$hiddenMain->category_id}", false);
    }
}
