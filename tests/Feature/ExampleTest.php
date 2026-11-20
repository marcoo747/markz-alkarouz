<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use DatabaseTransactions;

    public function test_the_application_redirects_root_to_home_and_home_returns_ok(): void
    {
        $this->assertSame('markaz_alkarouz_test', config('database.connections.mysql.database'));

        $this->get('/')->assertRedirect('/home');
        $this->get('/home')->assertOk();
    }
}
