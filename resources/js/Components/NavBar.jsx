import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Container from "./Container";
import Button from "./Button";
import logo from "../../imgs/AlkaroozCom.png";
import searchIcon from "../../imgs/search.svg";
import "../../css/NavBar.css";
import cartIcon from "../../imgs/cart.svg";

const NavBar = ({ page_name }) => {
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

    const linkBase =
        "no-underline text-slate-800 font-medium px-3 py-2 rounded-md transition-colors hover:bg-[rgba(31,41,55,0.05)] hover:text-blue-600";

    const linkActive = "font-bold text-[#0d6efd]";

    return (
        <header className="w-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.05)] sticky top-0 z-[800]">
            <Container>
                <nav
                    className="relative flex justify-between items-center py-3 px-4"
                    aria-label="Main navigation"
                >
                    {/* Logo */}
                    <Link
                        href={route("home")}
                        className="site-logo"
                        onClick={() => setOpen(false)}
                    >
                        <img
                            src={logo}
                            alt="Alkarooz"
                            className="
                                block h-auto
                                xl:absolute xl:left-[2%] xl:w-[10%] xl:top-1/2 xl:-translate-y-1/2
                                max-xl:relative max-xl:w-[25%] max-xl:mt-[0.5%]
                            "
                        />
                    </Link>

                    {/* Actions wrapper (right side) */}
                    <div className="flex items-center gap-3">
                        {/* Toggle (hidden on desktop >= ~1200) */}
                        <button
                            className="
                                xl:hidden
                                inline-flex items-center justify-center
                                min-w-10 min-h-10
                                rounded-md
                                p-[clamp(6px,1.5vw,10px)]
                                focus:outline-none focus:ring-2 focus:ring-[rgba(11,94,215,0.25)] focus:ring-offset-2
                            "
                            aria-controls="main-navigation"
                            aria-expanded={open}
                            aria-label={open ? "Close menu" : "Open menu"}
                            onClick={() => setOpen((s) => !s)}
                        >
                            <svg
                                className="block w-[clamp(18px,3vw,24px)] h-[clamp(18px,3vw,24px)]"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <rect
                                    x="3"
                                    y="6"
                                    width="18"
                                    height="2"
                                    rx="1"
                                    fill="currentColor"
                                    className={[
                                        "origin-center transition-transform duration-300 ease-in-out",
                                        open
                                            ? "translate-y-[5px] rotate-45"
                                            : "",
                                    ].join(" ")}
                                />
                                <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="2"
                                    rx="1"
                                    fill="currentColor"
                                    className={[
                                        "origin-center transition-all duration-300 ease-in-out",
                                        open
                                            ? "opacity-0 scale-x-0"
                                            : "opacity-100 scale-x-100",
                                    ].join(" ")}
                                />
                                <rect
                                    x="3"
                                    y="16"
                                    width="18"
                                    height="2"
                                    rx="1"
                                    fill="currentColor"
                                    className={[
                                        "origin-center transition-transform duration-300 ease-in-out",
                                        open
                                            ? "-translate-y-[5px] -rotate-45"
                                            : "",
                                    ].join(" ")}
                                />
                            </svg>
                        </button>

                        {/* Nav Links (desktop inline, mobile dropdown) */}
                        <div
                            id="main-navigation"
                            role="menu"
                            className={[
                                // desktop
                                "xl:flex xl:items-center xl:gap-4 xl:static xl:p-0 xl:shadow-none xl:rounded-none xl:border-0 xl:bg-transparent xl:opacity-100 xl:pointer-events-auto xl:translate-y-0",

                                // mobile base dropdown container
                                "max-xl:absolute max-xl:top-full max-xl:right-4 max-xl:bg-white max-xl:flex max-xl:flex-col max-xl:items-stretch",
                                "max-xl:w-[clamp(220px,90vw,360px)] max-xl:max-w-[calc(100%-2rem)] max-xl:p-4",
                                "max-xl:shadow-[0_8px_20px_rgba(0,0,0,0.08)] max-xl:rounded-lg max-xl:border-0",
                                "max-xl:transition-all max-xl:duration-300 max-xl:ease-in-out",

                                // closed/open states (mobile)
                                open
                                    ? "max-xl:opacity-100 max-xl:pointer-events-auto max-xl:translate-y-0"
                                    : "max-xl:opacity-0 max-xl:pointer-events-none max-xl:-translate-y-2",

                                // very small screens (<=420px): full width
                                "max-[420px]:left-0 max-[420px]:right-0 max-[420px]:w-full max-[420px]:rounded-none max-[420px]:p-3",
                            ].join(" ")}
                        >
                            <Link
                                href={route("home")}
                                className={`${linkBase} ${page_name === "home" ? linkActive : ""} max-xl:w-full max-xl:px-0 max-xl:py-2 max-xl:rounded-none`}
                                onClick={() => setOpen(false)}
                            >
                                Home
                            </Link>

                            <Link
                                href={route("categories")}
                                className={`${linkBase} ${page_name === "categories" ? linkActive : ""} max-xl:w-full max-xl:px-0 max-xl:py-2 max-xl:rounded-none`}
                                onClick={() => setOpen(false)}
                            >
                                Categories
                            </Link>

                            {user ? (
                                <Link
                                    href={route("cart")}
                                    className={`${linkBase} ${page_name === "cart" ? linkActive : ""} max-xl:w-full max-xl:px-0 max-xl:py-2 max-xl:rounded-none`}
                                    onClick={() => setOpen(false)}
                                >
                                    <img
                                        src={cartIcon}
                                        alt="Search"
                                        className="h- w-12 mx-auto text-white"
                                    />
                                </Link>
                            ) : null}

                            {manager ? (
                                <>
                                    <Link
                                        href={route("osra.index")}
                                        className={`${linkBase} ${page_name === "osras" ? linkActive : ""} max-xl:w-full max-xl:px-0 max-xl:py-2 max-xl:rounded-none`}
                                        onClick={() => setOpen(false)}
                                    >
                                        Families
                                    </Link>

                                    <Link
                                        href={route("users.index")}
                                        className={`${linkBase} ${page_name === "users" ? linkActive : ""} max-xl:w-full max-xl:px-0 max-xl:py-2 max-xl:rounded-none`}
                                        onClick={() => setOpen(false)}
                                    >
                                        Users
                                    </Link>
                                </>
                            ) : null}

                            {admin || manager ? (
                                <Link
                                    href={route("requests")}
                                    className={`${linkBase} ${page_name === "requests" ? linkActive : ""} max-xl:w-full max-xl:px-0 max-xl:py-2 max-xl:rounded-none`}
                                    onClick={() => setOpen(false)}
                                >
                                    Requests
                                </Link>
                            ) : null}

                            {user ? (
                                <Link
                                    href={route("profile")}
                                    className={`${linkBase} ${page_name === "profile" ? linkActive : ""} max-xl:w-full max-xl:px-0 max-xl:py-2 max-xl:rounded-none`}
                                    onClick={() => setOpen(false)}
                                >
                                    Profile
                                </Link>
                            ) : null}

                            <div
                                className={[
                                    "flex items-center gap-3",
                                    // mobile: grid buttons like old CSS
                                    "max-xl:mt-2 max-xl:grid max-xl:grid-cols-2 max-xl:gap-2",
                                ].join(" ")}
                            >
                                <form
                                    role="search"
                                    onSubmit={handleSearch}
                                    className={[
                                        "flex w-full max-w-[400px]",
                                        "max-xl:col-span-2 max-xl:w-full max-xl:max-w-none",
                                    ].join(" ")}
                                >
                                    <input
                                        type="search"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="
                                            flex-1
                                            outline-none
                                            border border-[rgba(15,23,42,0.15)]
                                            border-r-0
                                            rounded-l-[25px]
                                            py-[clamp(6px,1vw,10px)]
                                            px-[clamp(8px,2vw,14px)]
                                            text-[clamp(12px,2vw,14px)]
                                        "
                                    />

                                    <Button
                                        type="submit"
                                        className="
                                            btn btn-primary btn-sm
                                            rounded-r-[30px]
                                            flex items-center justify-center
                                            xl:w-12 xl:h-10
                                            max-xl:w-[140px]
                                        "
                                    >
                                        <img
                                            src={searchIcon}
                                            alt="Search"
                                            className="h- w-12 mx-auto text-white"
                                        />
                                    </Button>
                                </form>

                                {user ? (
                                    <button
                                        className="btn btn-outline-danger btn-sm min-w-[100px] px-4 py-[6px] text-[0.9rem]"
                                        onClick={() => {
                                            setOpen(false);
                                            router.post(route("logout"));
                                        }}
                                    >
                                        Log Out
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="btn btn-outline-primary btn-sm min-w-[100px] px-4 py-[6px] text-[0.9rem]"
                                            onClick={() => setOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href={route("sign_up")}
                                            className="btn btn-outline-success btn-sm min-w-[100px] px-4 py-[6px] text-[0.9rem]"
                                            onClick={() => setOpen(false)}
                                        >
                                            Sign Up
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
    );
};

export default NavBar;
