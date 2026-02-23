import React, { useState } from "react";
import { route } from "ziggy-js";
import styles from "../../css/OptionModal.module.css";

const AddOptionModal = ({ type, productId, onClose }) => {
  const [value, setValue] = useState(type === "color" ? "#000000" : "");

  const urlMap = {
    material: route("products.add-material"),
    color: route("products.add-color"),
    size: route("products.add-size"),
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.greenModal}>
        <div className={styles.modalHeader}>
          <h3>Add {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <form
            action={urlMap[type]}
            method="POST"
            encType="multipart/form-data"
          >
            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').content} />
            <input type="hidden" name="product_id" value={productId} />

            {type === "color" ? (
              <input
                type="color"
                name="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={styles.colorInput}
                required
              />
            ) : (
              <input
                type="text"
                name="value"
                value={value}
                placeholder={`Enter ${type}`}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            )}

            <div className={styles.modalFooter}>
              <button type="submit" className="btn btn-success">Add</button>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOptionModal;
