import React, { useState } from "react";
import { router } from "@inertiajs/react";
import styles from "../../css/CheckoutModal.module.css";

const CheckoutModal = ({ total, user, onClose, osraTime }) => {
    const [idCode, setIdCode] = useState("");
    const [startDate, setStartDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endDate, setEndDate] = useState("");
    const [endTime, setEndTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [timeType, setTimeType] = useState("osraTime");

    const today = new Date().toISOString().split("T")[0];

    const handleConfirmCustomTime = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post(
            route("requests.createFromCart"),
            {
                full_name: user?.full_name || "",
                osra_code: null,
                start_date: startDate,
                end_date: endDate,
                start_time: startTime,
                end_time: endTime,
                total_price: total,
            },
            {
                onSuccess: () => {
                    onClose();
                    setIdCode("");
                    setStartDate("");
                    setEndDate("");
                    setStartTime("");
                    setEndTime("");
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    const handleConfirmOsraTime = (e) => {
        e.preventDefault();
        setLoading(true);

        router.post(
            route("requests.createFromCart"),
            {
                full_name: user?.full_name || "",
                osra_code: idCode.trim(),
                osra_time: osraTime,
                total_price: idCode.trim() ? 0 : total,
            },
            {
                onSuccess: () => {
                    onClose();
                    setIdCode("");
                    setStartDate("");
                    setEndDate("");
                    setStartTime("");
                    setEndTime("");
                },
                onFinish: () => setLoading(false),
            }
        );
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.addModal}`}>
                <div className={styles.modalHeader}>
                    <h3>Booking Details</h3>
                    <button className="close-btn fs-2" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.optionGroup}>
                        <input
                            type="radio"
                            id="osra_Time"
                            name="timeOption"
                            value="osraTime"
                            checked={timeType === "osraTime"}
                            onChange={() => setTimeType("osraTime")}
                        />
                        <label htmlFor="osra_Time">Family Time</label>

                        <input
                            type="radio"
                            id="Custom_time"
                            name="timeOption"
                            value="customTime"
                            checked={timeType === "customTime"}
                            onChange={() => setTimeType("customTime")}
                        />
                        <label htmlFor="Custom_time">Custom Time</label>
                    </div>

                    {timeType === "osraTime" && (
                        <>
                            <label htmlFor="osra_time">Family Time</label>
                            <input
                                type="text"
                                id="osra_time"
                                value={osraTime}
                                readOnly
                            />

                            <label htmlFor="osra_code_one">Family Code</label>{" "}
                            <input
                                type="text"
                                value={idCode}
                                id="osra_code_one"
                                onChange={(e) => setIdCode(e.target.value)}
                                placeholder="Enter Osra Code"
                            />
                        </>
                    )}

                    {timeType === "customTime" && (
                        <>
                            <label htmlFor="start_date">Start Date</label>
                            <input
                                id="start_date"
                                type="date"
                                min={today}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                            <label htmlFor="start_time">Start Time</label>
                            <input
                                id="start_time"
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />

                            <label htmlFor="end_date">End Date</label>
                            <input
                                type="date"
                                id="end_date"
                                min={today}
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />

                            <label htmlFor="end_time">End Time</label>
                            <input
                                id="end_time"
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </>
                    )}

                    <p className="mt-2">Total Amount: EGP {total}</p>
                </div>

                <div className={styles.modalFooter}>
                    <button
                        disabled={loading}
                        className="btn btn-success"
                    onClick={
                        timeType === "osraTime"
                        ? handleConfirmOsraTime
                        : handleConfirmCustomTime
                    }
                    >
                    {loading ? "Booking..." : "Confirm Booking"}
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
