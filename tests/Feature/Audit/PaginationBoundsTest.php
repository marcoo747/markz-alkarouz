<?php

namespace Tests\Feature\Audit;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PaginationBoundsTest extends TestCase
{
    use DatabaseTransactions;

    public function test_per_page_is_clamped_between_1_and_48_across_paginated_endpoints(): void
    {
        $manager = User::factory()->manager()->create();

        $this->get(route('home', ['per_page' => 999999]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('pagination.per_page', 48));

        $this->get(route('home', ['per_page' => -10]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('pagination.per_page', 1));

        $this->get(route('categories.all', ['per_page' => 5000]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('pagination.per_page', 48));

        $this->get(route('search', ['query' => 'a', 'per_page' => 0]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('pagination.per_page', 1));

        $this->actingAs($manager)
            ->get(route('osra.index', ['per_page' => 1000]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('pagination.per_page', 48));

        $this->actingAs($manager)
            ->get(route('profile', ['per_page' => 1000]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('pagination.per_page', 48));
    }
}
