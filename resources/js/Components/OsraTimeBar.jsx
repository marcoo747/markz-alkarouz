import React from "react";
import { usePage } from "@inertiajs/react";
import { useBooking } from "@/Components/BookingContext";

const formatTime = (time24) => {
    if (!time24) return "";
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

const CalendarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        viewBox="0 0 16 16"
        className="text-emerald-600 shrink-0"
    >
        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
    </svg>
);

const OsraTimeBar = () => {
    const { auth, osra_info } = usePage().props;
    const user = auth?.user;

    const { timeType, startDate, startTime, endDate, endTime, selectedOsraDate, openCheckout } = useBooking();

    // Don't render for admins/managers
    if (user?.user_type === "admin" || user?.user_type === "manager") {
        return null;
    }

    const osraTime    = osra_info?.osra_time    || "";
    const osraName    = osra_info?.osra_name    || "";

    const getSummary = () => {
        if (timeType === "customTime") {
            if (startDate && endDate) {
                return `${startDate} ${startTime ? formatTime(startTime) : ""} — ${endDate} ${endTime ? formatTime(endTime) : ""}`;
            }
            return "Custom Time — Click to select dates";
        }

        if (selectedOsraDate) {
            return `${selectedOsraDate} • ${osraTime || "Family Time"}`;
        }
        if (osraTime) {
            return osraTime;
        }
        return "Family Time — Click to select dates";
    };

    return (
        <div className="w-full bg-emerald-50/70 border-b border-emerald-100 py-2.5 px-4 shadow-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                        <CalendarIcon />
                    </div>
                    <div>
                        <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                            {timeType === "customTime"
                                ? "Custom Booking Interval"
                                : osraName
                                ? osraName
                                : "Family Booking Interval"}
                        </div>
                        <div className="text-sm font-bold text-slate-800">
                            {getSummary()}
                        </div>
                    </div>
                </div>

                <button
                    onClick={openCheckout}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow active:scale-95 flex items-center gap-2"
                    aria-label="Select booking dates and time"
                >
                    <CalendarIcon />
                    <span>Select Booking Dates</span>
                </button>
            </div>
        </div>
    );
};

export default OsraTimeBar;