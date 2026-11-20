import React from "react";
import styles from "../../css/DeleteModal.module.css";

const DeleteUserModal = ({ userName, userNmae, onConfirm, onClose }) => {
  const displayName = userName ?? userNmae;
  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true">
      <div className={styles.redModal}>
        <div className={styles.modalHeader}>
          <h3>Delete User</h3>
          <button type="button" aria-label="Close" className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <p>Are you sure you want to delete "<strong>{displayName}</strong>"?</p>
        </div>

        <div className={styles.modalFooter}>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>Delete</button>
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
