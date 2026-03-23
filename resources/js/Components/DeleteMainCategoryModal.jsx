import React from "react";
import styles from "../../css/DeleteModal.module.css";

const DeleteCategoryModal = ({ categoryName, onConfirm, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.redModal}>
        <div className={styles.modalHeader}>
          <h3>Delete Main Category</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <p>Are you sure you want to delete "<strong>{categoryName}</strong>", all of its Sub Categories and items?</p>
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryModal;
