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
    const { auth, cart_items_count } = usePage().props;
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

    const [imgError, setImgError] = useState(false);

    const imageSrc = user?.user_photo
    ? `/markaz_alkarouz/public/storage/${user.user_photo}`
    : null;
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
                        {cart_items_count}
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
                                    {user && user.user_photo && !imgError ? (
                                        <img
                                            src={imageSrc}
                                            alt="user photo"
                                            width="110"
                                            height="110"
                                            className="rounded-circle border"
                                            onError={() => setImgError(true)}
                                        />
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="35"
                                            height="35"
                                            fill="currentColor"
                                            className="bi bi-person-circle"
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
                                    gap: 16,
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
                                        placeholder={t("navbar.search")}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
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
                                        className={`nav-link p-0 hide-on-mobile d-flex align-items-center justify-content-center ${page_name === "profile" ? "active" : ""}`}
                                        onClick={() => setOpen(false)}
                                        aria-label={t("navbar.profile")}
                                        title={t("navbar.profile")}
                                        style={{ width: "35px", height: "35px" }}
                                    >
                                        {user && user.user_photo && !imgError ? (
                                            <img
                                                src={imageSrc}
                                                alt="user photo"
                                                className="rounded-circle border"
                                                style={{ width: "35px", height: "35px", objectFit: "cover" }}
                                                onError={() => setImgError(true)}
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
                                        className={`nav-link position-relative ${page_name === "cart" ? "active" : ""}`}
                                        onClick={() => setOpen(false)}
                                        style={{ marginLeft: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', padding: 0 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l1.25 5h8.22l1.25-5zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
                                        </svg>
                                        <span
                                            style={{ top: '0', right: '0', transform: 'translate(30%, -30%)', fontSize: '0.65rem', padding: '0.25rem 0.4rem' }}
                                            className="badge position-absolute rounded-circle bg-primary"
                                        >
                                            {cart_items_count}
                                            <span className="visually-hidden">
                                                items in cart
                                            </span>
                                        </span>
                                    </Link>
                                ) : null}

                                {user ? (
                                    <button
                                        className="btn btn-sm d-flex align-items-center justify-content-center text-danger hover:bg-red-50 transition-colors"
                                        style={{ width: "35px", height: "35px", borderRadius: "50%", padding: 0 }}
                                        onClick={() => {
                                            setOpen(false);
                                            router.post(route("logout"));
                                        }}
                                        title={t("navbar.logout")}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                        </svg>
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
                                    </>
                                )}
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
