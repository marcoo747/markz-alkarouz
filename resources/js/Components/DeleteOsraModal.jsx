import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { route } from "ziggy-js";
import styles from "../../css/DeleteModal.module.css";

const DeleteOsraModal = ({ osra, onClose }) => {
  const handleDelete = () => {
    Inertia.delete(route("osra.destroy", osra.osra_id));
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.redModal}>
        <div className={styles.modalHeader}>
          <h3>Delete Family</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <p>Are you sure you want to delete <strong>{osra.osra_name}</strong>?</p>
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOsraModal;
