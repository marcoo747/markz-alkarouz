import React, { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { useBooking } from "@/Components/BookingContext";
import styles from "../../css/CheckoutModal.module.css";

/**
 * Global checkout modal that renders at the app root level.
 * Opened/closed via BookingContext.openCheckout() / closeCheckout().
 * Supports Option 1 (Family Time) and Option 2 (Custom Time).
 * Submits directly to requests.createFromCart carrying dates and times in the URL.
 */
const GlobalCheckoutModal = () => {
    const { t } = useTranslation();
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
    const [validationError, setValidationError] = useState("");
    const [confirmClearCart, setConfirmClearCart] = useState(false);

    const nowLocal = new Date();
    const today = `${nowLocal.getFullYear()}-${String(nowLocal.getMonth() + 1).padStart(2, "0")}-${String(nowLocal.getDate()).padStart(2, "0")}`;

    useEffect(() => {
        if (!isCheckoutOpen) return;
        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                closeCheckout();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isCheckoutOpen, closeCheckout]);

    if (!isCheckoutOpen) return null;

    const cartProducts = cart?.products ?? [];
    const cartTotal = Number(
        cartProducts
            .reduce(
                (acc, p) =>
                    acc +
                    Number(p.pr_price || 0) * Number(p.pivot?.quantity ?? 1),
                0
            )
            .toFixed(2)
    );
    const hasCartItems = (cart_items_count > 0) && (cartProducts.length > 0);
    const willClearNonEmptyCart = !hasCartItems && Number(cart_items_count || 0) > 0;

    const validateCustomTime = () => {
        if (!startDate || !startTime || !endDate || !endTime) {
            setValidationError("Please select a complete start date, start time, end date, and end time.");
            return false;
        }

        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);

        if (end <= start) {
            setValidationError("End date/time must be after start date/time.");
            return false;
        }

        setValidationError("");
        return true;
    };

    const validateFamilyTime = () => {
        const dateToUse = selectedOsraDate || nextSameDay;
        if (!dateToUse) {
            setValidationError("Please select a booking day for Family Time.");
            return false;
        }
        setValidationError("");
        return true;
    };

    const handleConfirmBooking = () => {
        if (timeType === "customTime") {
            if (!validateCustomTime()) return;
        } else {
            if (!validateFamilyTime()) return;
        }

        if (willClearNonEmptyCart && !confirmClearCart) {
            setConfirmClearCart(true);
            return;
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
            } : {
                full_name: user?.full_name || "",
                osra_code: idCode.trim() || osraCode || null,
                osra_time: osraTime || "",
                osra_date: selectedOsraDate || nextSameDay || "",
                osra_numeric_time: osraNumericTime || "",
            };

            router.post(route("requests.createFromCart", timeParams), payload, {
                onSuccess: () => {
                    setConfirmClearCart(false);
                    closeCheckout();
                },
                onFinish: () => setLoading(false),
            });
        } else {
            saveBookingInterval({ shouldClearCart: willClearNonEmptyCart }).finally(() => {
                setConfirmClearCart(false);
                setLoading(false);
            });
        }
    };

    const handleSaveFamilyDate = (dateValue) => {
        if (!dateValue) {
            setValidationError("Please select a booking date.");
            return;
        }
        setValidationError("");
        setSelectedOsraDate(dateValue);
        setShowOsraChoice(false);
        saveBookingInterval({ shouldClearCart: Number(cart_items_count || 0) > 0 });
    };

    return (
        <div
            className={styles.modalOverlay}
            onClick={closeCheckout}
            role="dialog"
            aria-modal="true"
            aria-labelledby="global-checkout-title"
        >
            <div
                className={styles.addModal}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.modalHeader}>
                    <h3 id="global-checkout-title">{t("checkout_modal.title") || "Booking Details"}</h3>
                    <button type="button" className={styles.closeBtn} onClick={closeCheckout} aria-label={t("terms.close_button") || "Close"}>
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
                        <label htmlFor="global_osra_Time">{t("checkout_modal.family_time") || "Family Time"}</label>

                        <input
                            type="radio"
                            id="global_Custom_time"
                            name="globalTimeOption"
                            value="customTime"
                            checked={timeType === "customTime"}
                            onChange={() => setTimeType("customTime")}
                        />
                        <label htmlFor="global_Custom_time">{t("checkout_modal.custom_time") || "Custom Time"}</label>
                    </div>

                    {/* Option 1: Family Time */}
                    {timeType === "familyTime" && (
                        <>
                            <label htmlFor="global_osra_time_display">{t("checkout_modal.family_time") || "Family Time"}</label>
                            <input
                                type="text"
                                id="global_osra_time_display"
                                value={osraTime || "—"}
                                readOnly
                            />

                            <label htmlFor="global_osra_code_input">{t("profile.family_code") || "Family Code"}</label>
                            <input
                                type="text"
                                id="global_osra_code_input"
                                value={idCode}
                                onChange={(e) => setIdCode(e.target.value)}
                                placeholder={t("profile.enter_family_code") || "Enter Family Code"}
                            />

                            <label htmlFor="global_osra_date_picker">{t("checkout_modal.booking_date") || "Booking Date"}</label>
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
                                        {t("checkout_modal.next_same_day") || "Next Same Day"} ({nextSameDay})
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
                            <label htmlFor="global_start_date">{t("checkout_modal.start_date") || "Start Date"}</label>
                            <input
                                id="global_start_date"
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                            <label htmlFor="global_start_time">{t("checkout_modal.start_time") || "Start Time"}</label>
                            <input
                                id="global_start_time"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />

                            <label htmlFor="global_end_date">{t("checkout_modal.end_date") || "End Date"}</label>
                            <input
                                type="date"
                                id="global_end_date"
                                min={today}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />

                            <label htmlFor="global_end_time">{t("checkout_modal.end_time") || "End Time"}</label>
                            <input
                                id="global_end_time"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </>
                    )}

                    {validationError && (
                        <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm font-medium text-red-700" role="alert">
                            {validationError}
                        </div>
                    )}

                    {willClearNonEmptyCart && (
                        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs font-medium text-amber-800" role="status">
                            {confirmClearCart
                                ? `Click "Confirm & Clear Cart" below to apply the new booking time and clear the ${cart_items_count} item(s) currently in your cart.`
                                : `Note: Changing your booking interval will clear the ${cart_items_count} item(s) currently in your cart so item availability can be recalculated.`}
                        </div>
                    )}

                    {hasCartItems && (
                        <div className="mt-4 text-lg font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm">
                            <span>{t("checkout_modal.total_amount") || "Total Amount"}</span>
                            <span>{t("terms.currency") || "EGP"} {cartTotal}</span>
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button
                        type="button"
                        disabled={loading}
                        className="btn btn-success"
                        onClick={handleConfirmBooking}
                    >
                        {loading
                            ? (t("checkout_modal.processing") || "Processing...")
                            : hasCartItems
                            ? (t("checkout_modal.confirm_booking") || "Confirm Booking")
                            : confirmClearCart
                            ? (t("checkout_modal.confirm_clear_cart") || "Confirm & Clear Cart")
                            : (t("checkout_modal.save_interval") || "Save Time Interval")}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                            setConfirmClearCart(false);
                            setValidationError("");
                            closeCheckout();
                        }}
                        disabled={loading}
                    >
                        {t("terms.cancel_button") || "Cancel"}
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