<?php

namespace Tests\Feature\Audit;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    use DatabaseTransactions;

    public function test_responses_include_hardened_security_headers_and_strip_powered_by(): void
    {
        $response = $this->get(route('home'))->assertOk();

        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        $csp = (string) $response->headers->get('Content-Security-Policy');
        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString("frame-ancestors 'none'", $csp);
        $this->assertFalse($response->headers->has('X-Powered-By'));
    }
}
