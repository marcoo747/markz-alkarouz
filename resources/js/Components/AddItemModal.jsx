import React, { useState } from "react";
import styles from "../../css/AddModal.module.css";

const AddItemModal = ({ onClose, onConfirm }) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [inventory_quantity, setQuantity] = useState("");

  const handleConfirm = () => {
    if (!name || !brand || !description || !price|| !inventory_quantity) return alert("All fields are required!");
    onConfirm({ name, brand, description, price, inventory_quantity });
    resetFields();
  };

  const resetFields = () => { setName(""); setBrand(""); setDescription(""); setPrice(""); setQuantity(""); };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addModal}>
        <div className={styles.modalHeader}>
          <h3>Add Item</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <label>Item Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Item Brand</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} />

          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />

          <label>Price</label>
          <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />

          <label>Product Quantity</label>
          <input type="number" min="0" value={inventory_quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-success" onClick={handleConfirm}>Add Item</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
