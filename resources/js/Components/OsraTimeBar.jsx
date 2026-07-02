import React, { useState } from "react";
import { usePage } from "@inertiajs/react";

// ================================================================
// MOCK DATA — الباك اند هيبعت الداتا دي من auth.user.osra
// ================================================================
const MOCK_OSRA = {
    osra_name: "أبطال الإيمان",
    osra_place: "الدور الأرضي",
    default_day: "الخميس",
    start_time: "17:00",
    end_time: "19:00",
};
// ================================================================

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

const ChevronIcon = ({ open }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        fill="currentColor"
        viewBox="0 0 16 16"
        style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            flexShrink: 0,
        }}
    >
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    </svg>
);

const OsraTimeBar = () => {
    const osra = MOCK_OSRA;

    const [isOpen,       setIsOpen]       = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [startTime,    setStartTime]    = useState(osra.start_time);
    const [endTime,      setEndTime]      = useState(osra.end_time);
    const [displayDay,   setDisplayDay]   = useState(osra.default_day);

    const handleConfirm = () => {
        if (selectedDate) {
            const dayName = new Date(selectedDate).toLocaleDateString("ar-EG", {
                weekday: "long",
            });
            setDisplayDay(dayName);
        }
        // TODO: router.visit(route("home.date", { date: selectedDate, start: startTime, end: endTime }))
        setIsOpen(false);
    };

    const handleReset = () => {
        setStartTime(osra.start_time);
        setEndTime(osra.end_time);
        setSelectedDate("");
        setDisplayDay(osra.default_day);
        setIsOpen(false);
    };

    return (
        <>
            {/* ── BAR — full width, part of normal flow */}
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
                        onClick={() => setIsOpen(true)}
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
                    >
                        <CalendarIcon />

                        <div style={{ textAlign: "right", lineHeight: 1.4 }}>
                            <div style={{ fontSize: 11, color: "#6b7280" }}>
                                {osra.osra_name} • {osra.osra_place}
                            </div>
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: "#111827",
                                }}
                            >
                                {displayDay} &nbsp;•&nbsp;
                                {formatTime(startTime)} — {formatTime(endTime)}
                            </div>
                        </div>

                        <ChevronIcon open={isOpen} />
                    </button>
                </div>
            </div>

            {/* ── MODAL */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        zIndex: 1050,
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        paddingTop: 80,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "#fff",
                            borderRadius: 12,
                            padding: "20px 16px",
                            width: "90%",
                            maxWidth: 380,
                            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                            direction: "rtl",
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 16,
                            }}
                        >
                            <span style={{ fontWeight: 700, fontSize: 15 }}>
                                تغيير الموعد
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#6b7280",
                                    fontSize: 18,
                                    lineHeight: 1,
                                    padding: 0,
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Default badge */}
                        <div
                            style={{
                                backgroundColor: "#eff6ff",
                                border: "1px solid #bfdbfe",
                                borderRadius: 8,
                                padding: "8px 12px",
                                marginBottom: 16,
                                fontSize: 12,
                                color: "#1d4ed8",
                            }}
                        >
                            الموعد الافتراضي: {osra.default_day} •{" "}
                            {formatTime(osra.start_time)} —{" "}
                            {formatTime(osra.end_time)}
                        </div>

                        {/* Date */}
                        <div style={{ marginBottom: 12 }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#374151",
                                    marginBottom: 4,
                                }}
                            >
                                التاريخ
                            </label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        {/* Times */}
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                marginBottom: 20,
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#374151",
                                        marginBottom: 4,
                                    }}
                                >
                                    من
                                </label>
                                <input
                                    type="time"
                                    className="form-control form-control-sm"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "#374151",
                                        marginBottom: 4,
                                    }}
                                >
                                    إلى
                                </label>
                                <input
                                    type="time"
                                    className="form-control form-control-sm"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                className="btn btn-outline-secondary btn-sm flex-grow-1"
                                onClick={handleReset}
                            >
                                رجوع للافتراضي
                            </button>
                            <button
                                className="btn btn-primary btn-sm flex-grow-1"
                                onClick={handleConfirm}
                            >
                                تأكيد
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OsraTimeBar;