import React, { useState } from "react";
import { router } from "@inertiajs/react";

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
        <div className="modal-overlay">
            <div className="modal-content add-modal">
                <div className="modal-header">
                    <h3>Booking Details</h3>
                    <button className="close-btn fs-2" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <div className="option-group">
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

                <div className="modal-footer">
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
                <style>{`
                  .modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999;
                    padding: 20px; /* add padding so content isn't flush to edges */
                    box-sizing: border-box;
                  }
                  .add-modal {
                    width: 420px;
                    max-height: 90vh; /* limit height to viewport */
                    background: #e6f4ea;
                    border-radius: 14px;
                    box-shadow: 0 20px 40px rgba(46,204,113,0.2);
                    animation: scaleIn 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden; /* contain scroll inside body */
                  }
                  .add-modal .modal-header {
                    background: linear-gradient(135deg, #2ecc71, #27ae60);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 14px 14px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                  }
                  .modal-body {
                    padding: 20px;
                    overflow-y: auto; /* scrollable body */
                    flex: 1; /* take remaining space */
                  }
                  .modal-body label {
                    font-weight: 600;
                    margin-top: 12px;
                    display: block;
                  }
                  .modal-body input {
                    width: 100%;
                    margin-top: 6px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    border: 1px solid #ced4da;
                  }
                  .modal-body input:focus {
                    outline: none;
                    border-color: #27ae60;
                  }
                  .modal-footer {
                    padding: 16px 20px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    border-top: 1px solid #dee2e6;
                    flex-shrink: 0;
                    background: #f8f9fa;
                  }
                  @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                  }
                  .option-group {
                    display: flex;
                    gap: 12px;
                    margin-top: 16px;
                  }
                  .option-group input[type="radio"] {
                    display: none;
                  }
                  .option-group label {
                    flex: 1;
                    text-align: center;
                    padding: 10px 14px;
                    border-radius: 8px;
                    border: 2px solid #27ae60;
                    background: #fff;
                    color: #27ae60;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                  }
                  .option-group input[type="radio"]:checked + label {
                    background: #27ae60;
                    color: #fff;
                    box-shadow: 0 4px 10px rgba(39,174,96,0.3);
                  }
                  .option-group label:hover {
                    background: #e6f4ea;
                  }
        `}</style>
            </div>
        </div>
    );
};

export default CheckoutModal;
