<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Osra;
use Carbon\Carbon;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $osra = null;
        $osraTime = null;
        $osraNumericTime = null;
        $nextSameDay = null;
        $canGoOutside = 1;

        if ($user) {
            if ($user->osra_id) {
                $osra = Osra::find($user->osra_id);
            } elseif (isset($user->osra_code) && $user->osra_code) {
                $osra = Osra::where('osra_code', $user->osra_code)->first();
            }

            if ($osra) {
                $osraTime = $osra->osra_time;
                $osraNumericTime = $osra->example_time;

                if ($osra->example_date) {
                    $oldDate = Carbon::parse($osra->example_date);
                    $nextSameDayDate = now()->next($oldDate->dayOfWeek);
                    $nextSameDay = $nextSameDayDate->toDateString();
                }
            }
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'osra_info' => [
                'osra_time'         => $osraTime,
                'osra_numeric_time' => $osraNumericTime,
                'next_same_day'     => $nextSameDay,
                'osra_code'         => $osra?->osra_code,
                'osra_name'         => $osra?->osra_name,
            ],
        ];
    }
}
