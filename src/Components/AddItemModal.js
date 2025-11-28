import React, { useState } from "react";
import "../styles/checkoutModal.css";

const AddItemModal = ({ onClose, onConfirm }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleConfirm = () => {
    onConfirm({ name, description, price });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Item</h3>
        <label>Item Name</label>
        <input
          type="text"
          placeholder="Enter item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Description</label>
        <input
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Price</label>
        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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

export default AddItemModal;
