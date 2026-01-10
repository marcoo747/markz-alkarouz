import React from "react";
import { Link } from "@inertiajs/react";

const NotFoundPage = () => {
  return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
          padding: "0 20px",
          background: "linear-gradient(135deg, #e0f7ff 0%, #c3e0ff 100%)",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "40px 30px",
            borderRadius: "16px",
            boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
            maxWidth: "500px",
            width: "100%",
          }}
        >
        <h1
        style={{
            fontSize: "8rem",
            margin: 0,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #1a73ff, #0047b3)", // darker blues
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
        }}
        >
        404
        </h1>

          <h2 style={{ fontSize: "2rem", margin: "20px 0", color: "#333" }}>
            Page Not Found
          </h2>

          <p style={{ fontSize: "1rem", color: "#666", marginBottom: "30px" }}>
            Oops! The page you are looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>

          <Link
            href={route("home")}
            style={{
              display: "inline-block",
              padding: "12px 30px",
              backgroundColor: "#4ca1ff",
              backgroundImage: "linear-gradient(90deg, #4ca1ff, #1a73ff)",
              color: "#fff",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
              transition: "transform 0.2s, box-shadow 0.2s",
              border: "no-border",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 8px 20px rgba(28,115,255,0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Go to Home
          </Link>
        </div>

        <div
          style={{
            marginTop: "40px",
            fontSize: "5rem",
            opacity: 0.05,
            position: "absolute",
            bottom: "10%",
            pointerEvents: "none",
            color: "#1a73ff",
          }}
        >
          404
        </div>
      </div>
  );
};

export default NotFoundPage;
