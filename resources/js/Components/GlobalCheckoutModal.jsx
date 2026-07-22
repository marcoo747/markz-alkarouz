import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { useBooking } from "@/Components/BookingContext";
import styles from "../../css/CheckoutModal.module.css";

/**
 * Global checkout modal that renders at the app root level.
 * Opened/closed via BookingContext.openCheckout() / closeCheckout().
 * Supports Option 1 (Family Time) and Option 2 (Custom Time).
 * Submits directly to requests.createFromCart carrying dates and times in the URL.
 */
const GlobalCheckoutModal = () => {
    const {
        isCheckoutOpen,
        closeCheckout,
        saveBookingInterval,
        buildTimeParams,
        timeType,
        setTimeType,
        startDate,
        setStartDate,
        startTime,
        setStartTime,
        endDate,
        setEndDate,
        endTime,
        setEndTime,
        selectedOsraDate,
        setSelectedOsraDate,
    } = useBooking();

    const { auth, osra_info, cart_items_count, cart } = usePage().props;
    const user = auth?.user;
    const osraTime = osra_info?.osra_time;
    const osraNumericTime = osra_info?.osra_numeric_time;
    const nextSameDay = osra_info?.next_same_day;
    const osraCode = osra_info?.osra_code;

    const [idCode, setIdCode] = useState(osraCode || "");
    const [loading, setLoading] = useState(false);
    const [showOsraChoice, setShowOsraChoice] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    if (!isCheckoutOpen) return null;

    const cartProducts = cart?.products ?? [];
    const cartTotal = cartProducts.reduce((acc, p) => acc + Number(p.pr_price), 0);
    const hasCartItems = (cart_items_count > 0) && (cartProducts.length > 0);

    const validateCustomTime = () => {
        if (!startDate || !startTime || !endDate || !endTime) {
            alert("Please select a complete start date, start time, end date, and end time.");
            return false;
        }

        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);

        if (end <= start) {
            alert("End date/time must be after start date/time.");
            return false;
        }

        return true;
    };

    const validateFamilyTime = () => {
        const dateToUse = selectedOsraDate || nextSameDay;
        if (!dateToUse) {
            alert("Please select a booking day for Family Time.");
            return false;
        }
        return true;
    };

    const handleConfirmBooking = () => {
        if (timeType === "customTime") {
            if (!validateCustomTime()) return;
        } else {
            if (!validateFamilyTime()) return;
        }

        setLoading(true);

        if (hasCartItems) {
            const timeParams = buildTimeParams();

            const payload = timeType === "customTime" ? {
                full_name: user?.full_name || "",
                osra_code: null,
                start_date: startDate,
                start_time: startTime,
                end_date: endDate,
                end_time: endTime,
                total_price: cartTotal,
            } : {
                full_name: user?.full_name || "",
                osra_code: idCode.trim() || osraCode || null,
                osra_time: osraTime || "",
                osra_date: selectedOsraDate || nextSameDay || "",
                osra_numeric_time: osraNumericTime || "",
                total_price: cartTotal,
            };

            router.post(route("requests.createFromCart", timeParams), payload, {
                onSuccess: () => {
                    closeCheckout();
                },
                onFinish: () => setLoading(false),
            });
        } else {
            saveBookingInterval().finally(() => setLoading(false));
        }
    };

    const handleSaveFamilyDate = (dateValue) => {
        if (!dateValue) {
            alert("Please select a booking date.");
            return;
        }
        setSelectedOsraDate(dateValue);
        setShowOsraChoice(false);
        saveBookingInterval();
    };

    return (
        <div className={styles.modalOverlay} onClick={closeCheckout}>
            <div
                className={styles.addModal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h3>Booking Details</h3>
                    <button className={styles.closeBtn} onClick={closeCheckout}>
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {/* Option Selector */}
                    <div className={styles.optionGroup}>
                        <input
                            type="radio"
                            id="global_osra_Time"
                            name="globalTimeOption"
                            value="familyTime"
                            checked={timeType === "familyTime"}
                            onChange={() => setTimeType("familyTime")}
                        />
                        <label htmlFor="global_osra_Time">Family Time</label>

                        <input
                            type="radio"
                            id="global_Custom_time"
                            name="globalTimeOption"
                            value="customTime"
                            checked={timeType === "customTime"}
                            onChange={() => setTimeType("customTime")}
                        />
                        <label htmlFor="global_Custom_time">Custom Time</label>
                    </div>

                    {/* Option 1: Family Time */}
                    {timeType === "familyTime" && (
                        <>
                            <label htmlFor="global_osra_time_display">Family Time</label>
                            <input
                                type="text"
                                id="global_osra_time_display"
                                value={osraTime || "—"}
                                readOnly
                            />

                            <label htmlFor="global_osra_code_input">Family Code</label>
                            <input
                                type="text"
                                id="global_osra_code_input"
                                value={idCode}
                                onChange={(e) => setIdCode(e.target.value)}
                                placeholder="Enter Family Code"
                            />

                            <label htmlFor="global_osra_date_picker">Booking Date</label>
                            <div className="flex flex-col gap-2 mb-3">
                                {nextSameDay && (
                                    <button
                                        type="button"
                                        className={`btn btn-sm ${
                                            (selectedOsraDate || nextSameDay) === nextSameDay
                                                ? "btn-success"
                                                : "btn-outline-success"
                                        }`}
                                        onClick={() => setSelectedOsraDate(nextSameDay)}
                                    >
                                        Next Same Day ({nextSameDay})
                                    </button>
                                )}
                                <input
                                    type="date"
                                    id="global_osra_date_picker"
                                    min={today}
                                    value={selectedOsraDate || nextSameDay || ""}
                                    onChange={(e) => setSelectedOsraDate(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {/* Option 2: Custom Time */}
                    {timeType === "customTime" && (
                        <>
                            <label htmlFor="global_start_date">Start Date</label>
                            <input
                                id="global_start_date"
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                            <label htmlFor="global_start_time">Start Time</label>
                            <input
                                id="global_start_time"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />

                            <label htmlFor="global_end_date">End Date</label>
                            <input
                                type="date"
                                id="global_end_date"
                                min={today}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />

                            <label htmlFor="global_end_time">End Time</label>
                            <input
                                id="global_end_time"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </>
                    )}

                    {hasCartItems && (
                        <div className="mt-4 text-lg font-bold text-[#10b981] bg-[#ecfdf5] border border-[#10b981]/20 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
                            <span>Total Amount</span>
                            <span>EGP {cartTotal}</span>
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button
                        disabled={loading}
                        className="btn btn-success"
                        onClick={handleConfirmBooking}
                    >
                        {loading ? "Processing..." : hasCartItems ? "Confirm Booking" : "Save Time Interval"}
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={closeCheckout}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Osra choice modal */}
            {showOsraChoice && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 animate-scale-in">
                        <p className="font-semibold mb-4 text-lg">
                            Choose Booking Day
                        </p>
                        <div className="flex flex-col gap-3">
                            {nextSameDay && (
                                <button
                                    className={`btn btn-outline-success btn-sm ${
                                        selectedOsraDate === nextSameDay
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => setSelectedOsraDate(nextSameDay)}
                                >
                                    Next Same Day ({nextSameDay})
                                </button>
                            )}
                            <input
                                type="date"
                                className="form-control form-control-sm bg-gray-50 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                                min={today}
                                value={selectedOsraDate || nextSameDay || ""}
                                onChange={(e) => setSelectedOsraDate(e.target.value)}
                            />
                            <button
                                className="btn btn-success btn-sm"
                                disabled={!selectedOsraDate && !nextSameDay}
                                onClick={() => handleSaveFamilyDate(selectedOsraDate || nextSameDay)}
                            >
                                Save Selected Date
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setShowOsraChoice(false)}
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalCheckoutModal;