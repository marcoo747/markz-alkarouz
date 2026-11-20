<?php

namespace App\Http\Controllers;

abstract class Controller
{
    protected function resolvePerPage(int $default = 12, int $max = 48): int
    {
        $raw = request()->input('per_page', $default);
        if (!is_numeric($raw)) {
            return $default;
        }

        return max(1, min($max, (int) $raw));
    }
}
