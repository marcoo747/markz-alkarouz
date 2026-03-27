import React from "react";
import { Inertia } from "@inertiajs/inertia";
import { route } from "ziggy-js";
import styles from "../../css/DeleteModal.module.css";
import { useTranslation } from "react-i18next";

const DeleteOsraModal = ({ osra, onClose }) => {
  const { t } = useTranslation();
  const handleDelete = () => {
    Inertia.delete(route("osra.destroy", osra.osra_id));
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.redModal}>
        <div className={styles.modalHeader}>
          <h3>{t('osra.delete_family')}</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <p>
            {t('osra.delete_confirmation', { name: osra.osra_name })}
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-danger" onClick={handleDelete}>{t('osra.delete')}</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>{t('profile.cancel')}</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOsraModal;
