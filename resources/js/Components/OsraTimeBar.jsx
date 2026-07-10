import React from "react";
import { usePage } from "@inertiajs/react";
import { useBooking } from "@/Components/BookingContext";

// ── Helpers ────────────────────────────────────────────────────────────────

const formatTime = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "م" : "ص";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

const CalendarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
        style={{ flexShrink: 0 }}
    >
        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
    </svg>
);

const ChevronIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="currentColor"
        viewBox="0 0 16 16"
        style={{ flexShrink: 0 }}
    >
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    </svg>
);

// ── Component ──────────────────────────────────────────────────────────────

const OsraTimeBar = () => {
    const { auth, osra_info } = usePage().props;
    const user = auth?.user;

    const { timeType, startDate, startTime, endDate, endTime, selectedOsraDate, openCheckout } = useBooking();

    // Don't render for admins/managers
    if (!user || user.user_type === "admin" || user.user_type === "manager") {
        return null;
    }

    const osraTime    = osra_info?.osra_time    || "";
    const osraName    = osra_info?.osra_name    || "";
    const nextSameDay = osra_info?.next_same_day || "";

    // Build display summary based on current booking state
    const getSummary = () => {
        if (timeType === "customTime") {
            if (startDate && endDate) {
                return `${startDate} ${startTime ? formatTime(startTime) : ""} — ${endDate} ${endTime ? formatTime(endTime) : ""}`;
            }
            return "Custom Time — click to set";
        }
        // familyTime
        if (selectedOsraDate) {
            return `${selectedOsraDate} • ${osraTime || "Family Time"}`;
        }
        if (osraTime) {
            return osraTime;
        }
        return "Family Time — click to set";
    };



    return (
        <div
            style={{
                width: "100%",
                backgroundColor: "#fff",
                borderBottom: "1px solid #e5e7eb",
            }}
        >
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: "8px 16px",
                }}
            >
                <button
                    onClick={openCheckout}
                    style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        direction: "rtl",
                    }}
                    aria-label="Open booking / checkout"
                >
                    <CalendarIcon />

                    <div style={{ textAlign: "right", lineHeight: 1.4 }}>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>
                            {timeType === "customTime"
                                ? "Custom Time"
                                : osraName
                                ? osraName
                                : "Family Time"}
                        </div>
                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "#111827",
                            }}
                        >
                            {getSummary()}
                        </div>
                    </div>

                    <ChevronIcon />
                </button>
            </div>
        </div>
    );
};

export default OsraTimeBar;