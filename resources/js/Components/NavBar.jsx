import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Container from "./Container";
import Button from "./Button";
import logo from "../../imgs/AlkaroozCom.png";
import "../../css/NavBar.css";
import searchIcon from "../../imgs/search.svg";
import cartIcon from "../../imgs/cart.svg";

const NavBar = ({ page_name, linkBase }) => {
    const { t, i18n } = useTranslation();
    const { auth } = usePage().props;
    const user = auth.user;
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        router.get(route("search"), { query: searchTerm });
        setOpen(false);
    };

    const manager = user?.user_type === "manager";
    const admin = user?.user_type === "admin";

    return (
        <>
            {user && (
                <Link
                    href={route("cart")}
                    className="mobile-floating-cart"
                    aria-label="Cart"
                >
                    <img src={cartIcon} alt="Cart" className="cart-icon" />
                    <span className="badge">
                        3
                        <span className="visually-hidden">
                            items in cart
                        </span>
                    </span>
                </Link>
            )}
            <header className="site-header">
                <Container>
                    <nav className="site-nav" aria-label="Main navigation">
                    <Link
                        href={route("home")}
                        className={`nav-link ${page_name === "home" ? "active" : ""} site-logo`}
                        onClick={() => setOpen(false)}
                    >
                        <img src={logo} alt="Alkarooz" />
                    </Link>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                        className="nav-actions"
                    >
                        <div className="show-on-mobile-only">
                            {/* Mobile Language Switcher */}
                            <button
                                type="button"
                                onClick={() => {
                                    const nextLang =
                                        i18n.language.startsWith("ar")
                                            ? "en"
                                            : "ar";
                                    i18n.changeLanguage(nextLang);
                                }}
                                className="mobile-lang-btn"
                                aria-label="Toggle language"
                            >
                                {i18n.language.startsWith("ar")
                                    ? "EN"
                                    : "عربي"}
                            </button>
                            {/* Mobile Profile Icon */}
                            {user && (
                                <Link
                                    href={route("profile")}
                                    className={`mobile-profile-icon ${page_name === "profile" ? "active" : ""}`}
                                    onClick={() => setOpen(false)}
                                    aria-label={t("navbar.profile")}
                                    title={t("navbar.profile")}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path
                                            fillRule="evenodd"
                                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                                        />
                                    </svg>
                                </Link>
                            )}
                        </div>
                        <button
                            className={`nav-toggle ${open ? "open" : ""}`}
                            aria-controls="main-navigation"
                            aria-expanded={open}
                            aria-label={open ? "Close menu" : "Open menu"}
                            onClick={() => setOpen((s) => !s)}
                        >
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
                        </button>

                        <div
                            id="main-navigation"
                            className={`nav-links ${open ? "open" : ""}`}
                            role="menu"
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
                                <Link
                                    href={route("requests")}
                                    className={`nav-link ${page_name === "requests" ? "active" : ""}`}
                                    onClick={() => setOpen(false)}
                                >
                                    {t("navbar.requests")}
                                </Link>
                            ) : null}

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginTop: 8,
                                }}
                            >
                                <form
                                    role="search"
                                    onSubmit={handleSearch}
                                    style={{
                                        display: "flex",
                                        width: "100%",
                                        maxWidth: 400,
                                    }}
                                >
                                    <input
                                        type="search"
                                        placeholder={t(
                                            "navbar.search_placeholder",
                                            "Search",
                                        )}
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        style={{
                                            flex: 1,
                                            padding:
                                                "clamp(6px, 1vw, 10px) clamp(8px, 2vw, 14px)",
                                            fontSize: "clamp(12px, 2vw, 14px)",
                                            borderStartStartRadius: 25,
                                            borderEndStartRadius: 25,
                                            border: "1px solid rgba(15,23,42,0.15)",
                                            borderInlineEnd: "none",
                                            outline: "none",
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        className="btn btn-sm"
                                        style={{
                                            borderStartEndRadius: 30,
                                            borderEndEndRadius: 30,
                                        }}
                                    >
                                        <img
                                            src={searchIcon}
                                            alt="Search"
                                            className="search-icon"
                                        />
                                    </Button>
                                </form>

                                {user ? (
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => {
                                            setOpen(false);
                                            router.post(route("logout"));
                                        }}
                                    >
                                        {t("navbar.logout")}
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => setOpen(false)}
                                        >
                                            {t("navbar.login")}
                                        </Link>
                                        {/* <Link
                                            href={route('sign_up')}
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() => setOpen(false)}
                                        >
                                            Sign Up
                                        </Link> */}
                                    </>
                                )}
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
                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center fw-bold hide-on-mobile"
                                    style={{
                                        borderRadius: "16px",
                                        padding: "0 8px",
                                        height: "28px",
                                        width: "10px",
                                        fontSize: "12px",
                                        flexShrink: 0,
                                    }}
                                    aria-label="Toggle language"
                                >
                                    {i18n.language.startsWith("ar")
                                        ? "EN"
                                        : "عربي"}
                                </button>
                                {user ? (
                                    <Link
                                        href={route("profile")}
                                        className={`nav-link hide-on-mobile ${page_name === "profile" ? "active" : ""}`}
                                        onClick={() => setOpen(false)}
                                        aria-label={t("navbar.profile")}
                                        title={t("navbar.profile")}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                                            />
                                        </svg>
                                    </Link>
                                ) : null}
                                {user ? (
                                    <Link
                                        id="cart-icon"
                                        href={route("cart")}
                                        className={`nav-link position-relative ${page_name === "cart" ? "active" : ""}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        <img
                                            src={cartIcon}
                                            alt="Cart"
                                            className="cart-icon"
                                        />
                                        <span
                                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary"
                                            style={{
                                                fontSize: "0.8rem",
                                                padding: "0.4em 0.6em",
                                            }}
                                        >
                                            3
                                            <span className="visually-hidden">
                                                items in cart
                                            </span>
                                        </span>
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
        </>
    );
};

NavBar.propTypes = {
    page_name: PropTypes.string,
    linkBase: PropTypes.string,
};

export default NavBar;
