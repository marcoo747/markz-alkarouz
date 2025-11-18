import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Container from "./Container";
import Button from "./Button";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Container>
        <nav className="site-nav" aria-label="Main navigation">
          <NavLink to="/" className="site-logo">
            <img
              src="/imgs/AlkaroozCom.png"
              alt="Alkarooz"
              style={{ height: 60 }}
            />
          </NavLink>

          <div
            style={{ display: "flex", alignItems: "center", gap: 12 }}
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
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
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
              <NavLink
                to="/Home"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/categories"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                Categories
              </NavLink>
              <NavLink
                to="/cart"
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                Cart
              </NavLink>

              <div
                className="nav-search"
                role="search"
                style={{ marginTop: 6 }}
              >
                <label className="visually-hidden" htmlFor="site-search">
                  Search
                </label>
                <input
                  id="site-search"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid rgba(15,23,42,0.06)",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <Button
                  className="btn-sm"
                  variant="outline"
                  aria-label="Sign in"
                  onClick={() => {
                    setOpen(false);
                    window.location = "/login";
                  }}
                >
                  Sign in
                </Button>
                <Button
                  className="btn-sm"
                  variant="primary"
                  onClick={() => {
                    setOpen(false);
                    window.location = "/signup";
                  }}
                >
                  Sign up
                </Button>
              </div>
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
};

export default NavBar;
