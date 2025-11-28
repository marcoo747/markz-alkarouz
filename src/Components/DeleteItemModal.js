import React from "react";
import "../styles/checkoutModal.css";

const DeleteItemModal = ({ onClose, onConfirm, itemName }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Delete Item</h3>
        <p>Are you sure you want to delete "{itemName}"?</p>
        <button className="btn btn-danger mt-3" onClick={onConfirm}>
          Confirm
        </button>
        <button className="btn btn-secondary mt-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DeleteItemModal;
