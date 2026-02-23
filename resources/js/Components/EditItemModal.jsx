import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import styles from "../../css/EditModal.module.css";

const EditItemModal = ({ currentItem, onClose }) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (currentItem) {
      setName(currentItem.title || "");
      setBrand(currentItem.brand || "");
      setDescription(currentItem.description || "");
      setPrice(currentItem.price || "");
    }
  }, [currentItem]);

  const handleConfirm = () => {
    router.put(
      route("items.update", {item: currentItem.id}),
      { name, brand, description, price: parseFloat(price) || 0 },
      { preserveScroll: true, onSuccess: () => onClose() }
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal}>
        <div className={styles.modalHeader}>
          <h3>Edit Item</h3>
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
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-primary" onClick={handleConfirm}>Save Changes</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
