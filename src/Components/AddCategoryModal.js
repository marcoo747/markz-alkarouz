import React, { useState } from "react";
import "../styles/checkoutModal.css"; // Reuse styles

const AddCategoryModal = ({ onClose, onConfirm }) => {
  const [name, setName] = useState("");

  const handleConfirm = () => {
    onConfirm(name);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Category</h3>
        <label>Category Name</label>
        <input
          type="text"
          placeholder="Enter category name"
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

export default AddCategoryModal;
