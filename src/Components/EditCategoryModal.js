import React, { useState } from "react";
import "../styles/checkoutModal.css";

const EditCategoryModal = ({ onClose, onConfirm, currentName }) => {
  const [name, setName] = useState(currentName || "");

  const handleConfirm = () => {
    onConfirm(name);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Category</h3>
        <label>New Category Name</label>
        <input
          type="text"
          placeholder="Enter new category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-success mt-3" onClick={handleConfirm}>
          Confirm
        </button>
        <button className="btn btn-secondary mt-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default EditCategoryModal;
