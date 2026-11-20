import React, { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Container from "./Container";
import Button from "./Button";
import logo from "../../imgs/AlkaroozCom.png";
import "../../css/NavBar.css";
import searchIcon from "../../imgs/search.svg";
import cartIcon from "../../imgs/cart.svg";
import OsraTimeBar from "@/Components/OsraTimeBar";

const NavBar = ({ page_name, linkBase }) => {
    const { t, i18n } = useTranslation();
    const { props, url } = usePage();
    const { auth, cart_items_count, query } = props;
    const user = auth.user;
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(() => query ?? "");

    useEffect(() => {
        setSearchTerm(query ?? "");
    }, [query]);

    useEffect(() => {
        setOpen(false);
    }, [url]);

    useEffect(() => {
        const mql = window.matchMedia("(max-width: 1000px)");
        const root = document.documentElement;

        const syncScrollLock = () => {
            if (open && mql.matches) {
                root.classList.add("nav-scroll-locked");
            } else {
                root.classList.remove("nav-scroll-locked");
                if (!mql.matches && open) {
                    setOpen(false);
                }
            }
        };

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
            }
        };

        const handleTouchMove = (e) => {
            if (!open || !mql.matches) return;
            const navMenu = document.getElementById("main-navigation");
            if (!navMenu?.contains(e.target)) {
                e.preventDefault();
            }
        };

        syncScrollLock();

        if (mql.addEventListener) {
            mql.addEventListener("change", syncScrollLock);
        } else {
            mql.addListener(syncScrollLock);
        }

        if (open) {
            window.addEventListener("keydown", handleKeyDown);
            document.addEventListener("touchmove", handleTouchMove, {
                passive: false,
            });
        }

        return () => {
            root.classList.remove("nav-scroll-locked");
            if (mql.removeEventListener) {
                mql.removeEventListener("change", syncScrollLock);
            } else {
                mql.removeListener(syncScrollLock);
            }
            window.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, [open]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        router.get(route("search"), { query: searchTerm });
        setOpen(false);
    };

    const manager = user?.user_type === "manager";
    const admin = user?.user_type === "admin";

    const [imgError, setImgError] = useState(false);

    const imageSrc = user?.user_photo
        ? `/storage/${user.user_photo}`
        : null;
    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-slate-900/25 backdrop-blur-[1px] z-[790] touch-none"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}
            <header className="site-header" role="banner">
                <Container>
                    <nav className="site-nav" aria-label="Main navigation">
                        <Link
                            href={route("home")}
                            className="site-logo"
                            onClick={() => setOpen(false)}
                        >
                            <img src={logo} alt="Alkarooz" />
                        </Link>

                        <div className="nav-actions flex items-center gap-3">
                            {user && (
                                <div className="show-on-mobile-only">
                                    {/* Mobile Cart Icon */}
                                    <Link
                                        href={route("cart")}
                                        className={`nav-link position-relative flex items-center justify-center !w-[44px] !h-[44px] p-0 ${page_name === "cart" ? "active" : ""}`}
                                        onClick={() => setOpen(false)}
                                        aria-label={t("cart.title") || "Cart"}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                                        </svg>
                                        <span className="badge position-absolute rounded-pill bg-primary -top-1 -end-1 text-[10px] leading-none px-1.5 py-0.5">
                                            {cart_items_count ?? 0}
                                            <span className="visually-hidden">
                                                {cart_items_count === 1 ? "item in cart" : "items in cart"}
                                            </span>
                                        </span>
                                    </Link>
                                </div>
                            )}
                            <button
                                className={`nav-toggle ${open ? "open" : ""}`}
                                aria-controls="main-navigation"
                                aria-expanded={open}
                                aria-label={open ? "Close menu" : "Open menu"}
                                onClick={() => setOpen((s) => !s)}
                            >
                                {open ? (
                                    <svg
                                        className="hamburger"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                ) : (
                                    <svg
                                        className="hamburger"
                                        width="100%"
                                        height="100%"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <rect
                                            className="bar bar1"
                                            x="3"
                                            y="6"
                                            width="18"
                                            height="2"
                                            rx="1"
                                            fill="currentColor"
                                        />
                                        <rect
                                            className="bar bar2"
                                            x="3"
                                            y="11"
                                            width="18"
                                            height="2"
                                            rx="1"
                                            fill="currentColor"
                                        />
                                        <rect
                                            className="bar bar3"
                                            x="3"
                                            y="16"
                                            width="18"
                                            height="2"
                                            rx="1"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                            </button>

                            <div
                                id="main-navigation"
                                className={`nav-links ${open ? "open" : ""}`}
                            >
                                <Link
                                    href={route("categories")}
                                    className={`nav-link ${page_name === "categories" ? "active" : ""}`}
                                    onClick={() => setOpen(false)}
                                >
                                    {t("navbar.categories")}
                                </Link>


                                {manager ? (
                                    <>
                                        <Link
                                            href={route("osra.index")}
                                            className={`nav-link ${page_name === "osras" ? "active" : ""}`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {t("navbar.osras")}
                                        </Link>

                                        <Link
                                            href={route("users.index")}
                                            className={`nav-link ${page_name === "users" ? "active" : ""}`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {t("navbar.users")}
                                        </Link>
                                    </>
                                ) : null}

                                {admin || manager ? (
                                    <>
                                        <Link
                                            href={route("requests")}
                                            className={`nav-link ${page_name === "requests" ? "active" : ""}`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {t("navbar.requests")}
                                        </Link>
                                        <Link
                                            href={route("missings.index")}
                                            className={`nav-link ${page_name === "missings" ? "active" : ""}`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {t("navbar.missings") || "المفقودات"}
                                        </Link>
                                    </>
                                ) : null}

                                {user ? (
                                    <Link
                                        href={route("profile")}
                                        className={`mobile-drawer-only nav-link flex items-center gap-2.5 ${page_name === "profile" ? "active" : ""}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        {user.user_photo && !imgError ? (
                                            <img
                                                src={imageSrc}
                                                alt="user photo"
                                                className="rounded-circle border w-[26px] h-[26px] object-cover shrink-0"
                                                onError={() => setImgError(true)}
                                            />
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="currentColor"
                                                className="bi bi-person-circle text-secondary shrink-0"
                                                viewBox="0 0 16 16"
                                                aria-hidden="true"
                                            >
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                                />
                                            </svg>
                                        )}
                                        <span>{t("navbar.profile")}</span>
                                    </Link>
                                ) : null}

                                <div className="flex items-center gap-4 mt-2">
                                    <form
                                        role="search"
                                        onSubmit={handleSearch}
                                        className="flex w-full max-w-[400px]"
                                    >
                                        <input
                                            id="navbar-search-input"
                                            name="query"
                                            type="search"
                                            aria-label={t("navbar.search")}
                                            placeholder={t("navbar.search")}
                                            value={searchTerm}
                                            onChange={(e) =>
                                                setSearchTerm(e.target.value)
                                            }
                                            className="search-input"
                                        />

                                        <Button
                                            type="submit"
                                            className="btn btn-sm search-submit-btn"
                                        >
                                            <img
                                                src={searchIcon}
                                                alt="Search"
                                                className="search-icon"
                                            />
                                        </Button>
                                    </form>

                                    {/* Language Switcher */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nextLang =
                                                i18n.language.startsWith("ar")
                                                    ? "en"
                                                    : "ar";
                                            i18n.changeLanguage(nextLang);
                                        }}
                                        className="btn btn-outline-secondary d-flex align-items-center justify-content-center fw-bold hide-on-mobile rounded-full p-0 h-[35px] !w-[100px] !min-w-[100px] text-[13px] shrink-0"
                                        aria-label={
                                            i18n.language.startsWith("ar")
                                                ? "EN - Switch to English"
                                                : "عر - التبديل إلى العربية"
                                        }
                                    >
                                        {i18n.language.startsWith("ar")
                                            ? "EN"
                                            : "عر"}
                                    </button>
                                    {user ? (
                                        <Link
                                            href={route("profile")}
                                            className={`nav-link p-0 hide-on-mobile d-flex align-items-center justify-content-center w-[35px] h-[35px] ${page_name === "profile" ? "active" : ""}`}
                                            onClick={() => setOpen(false)}
                                            aria-label={t("navbar.profile")}
                                            title={t("navbar.profile")}
                                        >
                                            {user &&
                                            user.user_photo &&
                                            !imgError ? (
                                                <img
                                                    src={imageSrc}
                                                    alt="user photo"
                                                    className="rounded-circle border w-[35px] h-[35px] object-cover"
                                                    onError={() =>
                                                        setImgError(true)
                                                    }
                                                />
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="30"
                                                    height="30"
                                                    fill="currentColor"
                                                    className="bi bi-person-circle text-secondary"
                                                    viewBox="0 0 16 16"
                                                >
                                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                                    />
                                                </svg>
                                            )}
                                        </Link>
                                    ) : null}
                                    {user ? (
                                        <Link
                                            href={route("cart")}
                                            className={`nav-link position-relative hide-on-mobile ml-2.5 flex items-center justify-center w-[38px] h-[38px] p-0 ${page_name === "cart" ? "active" : ""}`}
                                            onClick={() => setOpen(false)}
                                            aria-label={t("cart.title") || "Cart"}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="28"
                                                height="28"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                                            </svg>
                                            <span className="badge position-absolute rounded-circle bg-primary top-0 right-0 translate-x-[30%] -translate-y-[30%] text-[0.65rem] px-[0.4rem] py-[0.25rem]">
                                                {cart_items_count}
                                                <span className="visually-hidden">
                                                    {cart_items_count === 1 ? "item in cart" : "items in cart"}
                                                </span>
                                            </span>
                                        </Link>
                                    ) : null}

                                    {/* Mobile Hamburger Language Switcher */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nextLang =
                                                i18n.language.startsWith("ar")
                                                    ? "en"
                                                    : "ar";
                                            i18n.changeLanguage(nextLang);
                                            setOpen(false);
                                        }}
                                        className="mobile-drawer-only btn btn-outline-secondary btn-sm col-span-2 w-full flex items-center justify-center gap-2 min-h-[44px]"
                                    >
                                        {i18n.language.startsWith("ar")
                                            ? "EN — English"
                                            : "عربي — Arabic"}
                                    </button>

                                    {!user && (
                                        <>
                                            <Link
                                                href={route("login")}
                                                className="btn btn-outline-primary btn-sm col-span-2 w-full"
                                                onClick={() => setOpen(false)}
                                            >
                                                {t("navbar.login")}
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                </Container>
            </header>

            {/* OsraTimeBar — بيبان بس للـ user العادي مش للأدمن والمنجر */}
            <OsraTimeBar />
        </>
    );
};

NavBar.propTypes = {
    page_name: PropTypes.string,
    linkBase: PropTypes.string,
};

export default NavBar;
