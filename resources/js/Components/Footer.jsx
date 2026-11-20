import React from "react";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <footer
            role="contentinfo"
            className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-12 py-8 px-4"
        >
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <div className="text-center sm:text-start">
                    <p className="font-bold text-white m-0">
                        {t("home.hero_title") || "Markaz Alkarooz - St. Mark's Church"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 mb-0">
                        © {year} {t("home.page_title") || "Markaz Alkarooz"}.
                    </p>
                </div>

                <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
                    <Link
                        href={route("home")}
                        className="text-slate-300 hover:text-white no-underline transition-colors"
                    >
                        {t("navbar.home") || "Home"}
                    </Link>
                    <Link
                        href={route("categories")}
                        className="text-slate-300 hover:text-white no-underline transition-colors"
                    >
                        {t("navbar.categories") || "Categories"}
                    </Link>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;
