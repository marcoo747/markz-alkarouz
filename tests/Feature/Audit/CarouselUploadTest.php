<?php

namespace Tests\Feature\Audit;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CarouselUploadTest extends TestCase
{
    use DatabaseTransactions;

    private function tinyPng(string $name = 'slide.png'): UploadedFile
    {
        $png = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        );

        return UploadedFile::fake()->createWithContent($name, $png);
    }

    public function test_guests_and_non_managers_cannot_upload_carousel_photos(): void
    {
        Storage::fake('public');
        $file = $this->tinyPng();

        $this->postJson('/carousel-photos/upload', ['photo' => [$file]])
            ->assertStatus(401);

        $user = User::factory()->create();
        $this->actingAs($user)
            ->postJson('/carousel-photos/upload', ['photo' => [$file]])
            ->assertStatus(403);
    }

    public function test_carousel_upload_rejects_svg_php_html_non_array_and_oversized_files(): void
    {
        Storage::fake('public');
        $manager = User::factory()->manager()->create();

        foreach ([
            'xss.svg' => '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
            'shell.php' => '<?php phpinfo(); ?>',
            'evil.html' => '<html><body><script>alert(1)</script></body></html>',
        ] as $badName => $content) {
            $badFile = UploadedFile::fake()->createWithContent($badName, $content);
            $this->actingAs($manager)
                ->postJson('/carousel-photos/upload', ['photo' => [$badFile]])
                ->assertStatus(422);
        }

        // Single non-array file must return validation error instead of 500
        $this->actingAs($manager)
            ->postJson('/carousel-photos/upload', [
                'photo' => $this->tinyPng('single.png'),
            ])
            ->assertStatus(422);

        // Oversized (> 2048 KB) valid PNG header padded past 2048 KB
        $pngHeader = base64_decode(
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        );
        $hugeFile = UploadedFile::fake()->createWithContent('huge.png', $pngHeader . str_repeat("\0", 2200 * 1024));
        $this->actingAs($manager)
            ->postJson('/carousel-photos/upload', ['photo' => [$hugeFile]])
            ->assertStatus(422);

        $this->assertCount(0, Storage::disk('public')->allFiles('carousel_photos'));
    }

    public function test_manager_can_upload_valid_bounded_images(): void
    {
        Storage::fake('public');
        $manager = User::factory()->manager()->create();

        $img1 = $this->tinyPng('slide1.png');
        $img2 = $this->tinyPng('slide2.png');

        $response = $this->actingAs($manager)
            ->postJson('/carousel-photos/upload', [
                'photo' => [$img1, $img2],
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['message', 'photos'])
            ->assertJsonCount(2, 'photos');

        $this->assertCount(2, Storage::disk('public')->allFiles('carousel_photos'));
    }
}
