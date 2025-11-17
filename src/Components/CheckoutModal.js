import React from "react";
import "../styles/checkoutModal.css";

const CheckoutModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Booking Details</h3>

        <label>Full Name</label>
        <input type="text" placeholder="Enter your name" />

        <label>ID Code</label>
        <input type="text" placeholder="Enter your ID" />

        <label>Start Date</label>
        <input type="date" />

        <label>End Date</label>
        <input type="date" />

        <button className="btn btn-success mt-3">Confirm Booking</button>
        <button className="btn btn-secondary mt-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CheckoutModal;
