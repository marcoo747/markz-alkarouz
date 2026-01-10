import '../css/app.css';
import '../css/theme.css';
import '../css/responsive-tables.css';
import "../css/bootstrap.min.css";
import "./bootstrap.bundle.min.js";
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    title: (title) => title || 'Markz alkarooz',
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);

        // ✅ Register Service Worker for PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log("Service Worker registered:", reg.scope))
                    .catch(err => console.error("Service Worker registration failed:", err));
            });
        }
    },
    progress: {
        color: '#4B5563',
    },
});
