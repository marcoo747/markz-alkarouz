import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import PropTypes from "prop-types";
import Container from "./Container";
import Button from "./Button";
import logo from "../../imgs/AlkaroozCom.png";
import "../../css/NavBar.css";
import searchIcon from "../../imgs/search.svg";
import "../../css/NavBar.css";
import cartIcon from "../../imgs/cart.svg";

const NavBar = ({ page_name, linkBase }) => {
    const { auth } = usePage().props;
    const user = auth.user;
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        router.get(`${linkBase}/search`, { query: searchTerm });
        setOpen(false);
    };

    const manager = user?.user_type === "manager";
    const admin = user?.user_type === "admin";

    return (
        <header className="site-header">
            <Container>
                <nav className="site-nav" aria-label="Main navigation">
                    <Link href={linkBase || "/"} className="site-logo">
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
                                href={linkBase || "/"}
                                className={`nav-link ${page_name === "home" ? "active" : ""}`}
                                onClick={() => setOpen(false)}
                            >
                                Home
                            </Link>

                            <Link
                                href={`${linkBase}/categories`}
                                className={`nav-link ${page_name === "categories" ? "active" : ""}`}
                                onClick={() => setOpen(false)}
                            >
                                Categories
                            </Link>


                            {manager ? (
                                <>
                                    <Link
                                        href={`${linkBase}/osras`}
                                        className={`nav-link ${page_name === "osras" ? "active" : ""}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        Families
                                    </Link>

                                    <Link
                                        href={`${linkBase}/users`}
                                        className={`nav-link ${page_name === "users" ? "active" : ""}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        Users
                                    </Link>
                                </>
                            ) : null}

                            {admin || manager ? (
                                <Link
                                    href={`${linkBase}/requests`}
                                    className={`nav-link ${page_name === "requests" ? "active" : ""}`}
                                    onClick={() => setOpen(false)}
                                >
                                    Requests
                                </Link>
                            ) : null}

                            {user ? (
                                <Link
                                    href={`${linkBase}/profile`}
                                    className={`nav-link ${page_name === "profile" ? "active" : ""}`}
                                    onClick={() => setOpen(false)}
                                >
                                    Profile
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
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        style={{
                                            flex: 1,
                                            padding:
                                                "clamp(6px, 1vw, 10px) clamp(8px, 2vw, 14px)",
                                            fontSize: "clamp(12px, 2vw, 14px)",
                                            borderTopLeftRadius: 25,
                                            borderBottomLeftRadius: 25,
                                            border: "1px solid rgba(15,23,42,0.15)",
                                            borderRight: "none",
                                            outline: "none",
                                        }}
                                    />

                                    <Button
                                        type="submit"
                                        className="btn btn-sm"
                                        style={{
                                            borderTopRightRadius: 30,
                                            borderBottomRightRadius: 30,
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
                                            router.post(`${linkBase}/logout`);
                                        }}
                                    >
                                        Log Out
                                    </button>
                                ) : (
                                    <>
                                        <Link
                                            href={`${linkBase}/login`}
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => setOpen(false)}
                                        >
                                            Login
                                        </Link>
                                        {/* <Link
                                            href={`${linkBase}/sign_up`}
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() => setOpen(false)}
                                        >
                                            Sign Up
                                        </Link> */}
                                    </>
                                )}

                                {user ? (
                                    <Link
                                        id="cart-icon"
                                        href={`${linkBase}/cart`}
                                        className={`nav-link ${page_name === "cart" ? "active" : ""}`}
                                        onClick={() => setOpen(false)}
                                    >
                                        <img
                                            src={cartIcon}
                                            alt="Cart"
                                            className="cart-icon"
                                        />
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </nav>
            </Container>
        </header>
    );
};

NavBar.propTypes = {
    page_name: PropTypes.string,
    linkBase: PropTypes.string.isRequired,
};

export default NavBar;
