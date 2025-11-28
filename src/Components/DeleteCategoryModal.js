import React from "react";
import "../styles/checkoutModal.css";

const DeleteCategoryModal = ({ onClose, onConfirm, categoryName }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Delete Category</h3>
        <p>Are you sure you want to delete "{categoryName}" and all its items?</p>
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

export default DeleteCategoryModal;
