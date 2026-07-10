import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { useBooking } from "@/Components/BookingContext";
import styles from "../../css/CheckoutModal.module.css";
/**
 * Global checkout modal that renders at the app root level.
 * Opened/closed via BookingContext.openCheckout() / closeCheckout().
 * Reads time state from BookingContext and submits directly to createFromCart.
 */
const GlobalCheckoutModal = () => {
    const {
        isCheckoutOpen,
        closeCheckout,
        saveBookingInterval,
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
    // FIX: previously read only { auth, osra_info } and hardcoded
    // `const can_go_outside = true`, so every user saw "Custom Time" as an
    // option regardless of their cart's categories. can_go_outside is now
    // shared globally from HandleInertiaRequests (mirrors the same logic
    // CartController::index already used), so it's read here for real.
    // cart_items_count is also read here now to block checkout on an empty cart.
    const { auth, osra_info, can_go_outside, cart_items_count } = usePage().props;
    const user = auth?.user;
    const osraTime = osra_info?.osra_time;
    const osraNumericTime = osra_info?.osra_numeric_time;
    const nextSameDay = osra_info?.next_same_day;
    const osraCode = osra_info?.osra_code;
    const [loading, setLoading] = useState(false);
    const [showOsraChoice, setShowOsraChoice] = useState(false);
    const today = new Date().toISOString().split("T")[0];
    if (!isCheckoutOpen) return null;
    // FIX: nothing previously stopped "Confirm Booking" from being clicked
    // with an empty cart. The server now rejects that too (see
    // RequestController::createFromCart), but blocking it here avoids a
    // pointless round trip and gives the user an inline explanation.
    const cartEmpty = !cart_items_count || cart_items_count <= 0;
    // ── Save Time Interval ───────────────────────────────────────────────────

    const validateCustomTime = () => {
        if (!startDate || !startTime || !endDate || !endTime) {
            alert("Please select a complete date and time interval.");
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

    const handleSaveCustomTime = () => {
        if (!validateCustomTime()) return;

        setLoading(true);

        saveBookingInterval();

        setLoading(false);
    };

    const handleSaveFamilyTime = (dateValue) => {
        if (!dateValue) {
            alert("Please choose a booking date.");
            return;
        }

        setSelectedOsraDate(dateValue);

        setLoading(true);

        saveBookingInterval();

        setShowOsraChoice(false);

        setLoading(false);
    };

    const handleCheckoutClick = () => {
        if (timeType === "familyTime") {
            setShowOsraChoice(true);
            return;
        }

        handleSaveCustomTime();
    };
    // ── Render ───────────────────────────────────────────────────────────────
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
                    {cartEmpty && (
                        <div className="mb-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl">
                            Your cart is empty — add items before checking out.
                        </div>
                    )}
                    {/* Time type selector */}
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
                        {!!can_go_outside && (
                            <>
                                <input
                                    type="radio"
                                    id="global_Custom_time"
                                    name="globalTimeOption"
                                    value="customTime"
                                    checked={timeType === "customTime"}
                                    onChange={() => setTimeType("customTime")}
                                />
                                <label htmlFor="global_Custom_time">
                                    Custom Time
                                </label>
                            </>
                        )}
                    </div>
                    {/* Family time display */}
                    {timeType === "familyTime" && (
                        <>
                            <label htmlFor="global_osra_time_display">
                                Family Time
                            </label>
                            <input
                                type="text"
                                id="global_osra_time_display"
                                value={osraTime || "—"}
                                readOnly
                            />
                        </>
                    )}
                    {/* Custom time inputs */}
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
                    {/* Cart total note */}
                    <div className="mt-4 text-sm text-[#6b7280] bg-[#f9fafb] border border-[#e5e7eb] px-4 py-3 rounded-xl">
                        The selected booking interval will be saved and used to filter available products. Your booking request will be created from the Cart page.
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <button
                        disabled={loading || cartEmpty}
                        className="btn btn-success"
                        onClick={handleCheckoutClick}
                    >
                        {loading ? "Saving..." : "Save Time Interval"}
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        onClick={closeCheckout}
                    >
                        Cancel
                    </button>
                </div>
            </div>
            {/* Osra date picker sub-modal */}
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
                                    onClick={() =>
                                        setSelectedOsraDate(nextSameDay)
                                    }
                                >
                                    Next Same Day ({nextSameDay})
                                </button>
                            )}
                            <input
                                type="date"
                                className="form-control form-control-sm bg-gray-50 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
                                min={today}
                                value={selectedOsraDate}
                                onChange={(e) =>
                                    setSelectedOsraDate(e.target.value)
                                }
                            />
                            <button
                                className="btn btn-success btn-sm"
                                disabled={!selectedOsraDate || loading}
                                onClick={() =>
                                    handleSaveFamilyTime(selectedOsraDate)
                                }
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Selected Date"}
                            </button>
                            <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => setShowOsraChoice(false)}
                                disabled={loading}
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