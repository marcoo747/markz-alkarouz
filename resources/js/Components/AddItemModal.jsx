import React, { useState } from "react";
import styles from "../../css/AddModal.module.css";

const AddItemModal = ({ onClose, onConfirm }) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [inventory_quantity, setQuantity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirm = () => {
    if (!name.trim() || !brand.trim() || !description.trim() || price === "" || inventory_quantity === "") {
      setErrorMessage("All fields are required!");
      return;
    }
    setErrorMessage("");
    onConfirm({ name, brand, description, price, inventory_quantity });
    resetFields();
  };

  const resetFields = () => { setName(""); setBrand(""); setDescription(""); setPrice(""); setQuantity(""); setErrorMessage(""); };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="add-item-modal-title">
      <div className={styles.addModal}>
        <div className={styles.modalHeader}>
          <h3 id="add-item-modal-title">Add Item</h3>
          <button type="button" aria-label="Close" className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          {errorMessage && (
            <div className="alert alert-danger py-2 small mb-3" role="alert">
              {errorMessage}
            </div>
          )}
          <label htmlFor="add-item-name">Item Name</label>
          <input id="add-item-name" value={name} onChange={(e) => { setName(e.target.value); setErrorMessage(""); }} />

          <label htmlFor="add-item-brand">Item Brand</label>
          <input id="add-item-brand" value={brand} onChange={(e) => { setBrand(e.target.value); setErrorMessage(""); }} />

          <label htmlFor="add-item-desc">Description</label>
          <input id="add-item-desc" value={description} onChange={(e) => { setDescription(e.target.value); setErrorMessage(""); }} />

          <label htmlFor="add-item-price">Price</label>
          <input id="add-item-price" type="number" min="0" value={price} onChange={(e) => { setPrice(e.target.value); setErrorMessage(""); }} />

          <label htmlFor="add-item-qty">Product Quantity</label>
          <input id="add-item-qty" type="number" min="0" value={inventory_quantity} onChange={(e) => { setQuantity(e.target.value); setErrorMessage(""); }} />
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className="btn btn-success" onClick={handleConfirm}>Add Item</button>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
