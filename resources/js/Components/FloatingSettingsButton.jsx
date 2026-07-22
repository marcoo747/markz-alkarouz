import React from "react";
import { useBooking } from "@/Components/BookingContext";

const FloatingSettingsButton = () => {
    const { openCheckout, timeType, startDate, endDate, selectedOsraDate } = useBooking();
    const label = timeType === "customTime" && startDate && endDate
        ? `${startDate} → ${endDate}`
        : selectedOsraDate
        ? selectedOsraDate
        : "Booking Settings";

    return (
        <button
            onClick={openCheckout}
            className="fixed bottom-6 right-6 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-full px-6 py-4 shadow-[0_8px_20px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.5)] z-40 flex items-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0"
            aria-label="Open booking settings"
            title="Configure Date & Time Settings"
        >
            <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
            <span>{label}</span>
        </button>
    );
};

export default FloatingSettingsButton;
