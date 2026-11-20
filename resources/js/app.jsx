import "../css/app.css";
import "../css/theme.css";
import "../css/responsive-tables.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./bootstrap";
import "./i18n";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

import { BookingProvider } from "@/Components/BookingContext";
import GlobalCheckoutModal from "@/Components/GlobalCheckoutModal";
import Footer from "@/Components/Footer";

createInertiaApp({
    title: (title) => title || "Markz alkarooz",

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),

    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <App
                {...props}
                children={({ Component, props: pageProps, key }) => (
                    <BookingProvider>
                        <div className="min-h-screen flex flex-col">
                            <main id="main-content" className="flex-1">
                                <Component {...pageProps} key={key} />
                            </main>
                            <Footer />
                        </div>
                        <GlobalCheckoutModal />
                    </BookingProvider>
                )}
            />
        );
    },

    progress: {
        color: "#4B5563",
    },
});