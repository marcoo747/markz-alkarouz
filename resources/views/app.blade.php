<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Markaz Alkarooz') }}</title>
        <meta name="description" content="Markaz Alkarooz - St. Mark's Church visual aids and event resources rental platform. Discover and reserve educational aids, costumes, and equipment.">
        <link rel="canonical" href="{{ url()->current() }}">
        <meta property="og:site_name" content="Markaz Alkarooz">
        <meta property="og:title" content="{{ config('app.name', 'Markaz Alkarooz') }}">
        <meta property="og:description" content="Markaz Alkarooz - St. Mark's Church visual aids and event resources rental platform.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta property="og:image" content="{{ asset('imgs/AlkaroozCom.png') }}">
        <meta name="twitter:card" content="summary_large_image">
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#8936FF">
        <link rel="icon" href="{{ asset('imgs/icon.png') }}?v=2" type="image/png">
        <link rel="shortcut icon" href="{{ asset('imgs/icon.png') }}?v=2" type="image/png">
        <link rel="apple-touch-icon" href="{{ asset('imgs/icon.png') }}?v=2">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
