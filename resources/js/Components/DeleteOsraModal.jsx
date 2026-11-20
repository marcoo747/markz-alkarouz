import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import styles from "../../css/DeleteModal.module.css";
import { useTranslation } from "react-i18next";

const DeleteOsraModal = ({ osra, onClose }) => {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleDelete = () => {
    setError("");
    setProcessing(true);
    router.delete(route("osra.destroy", osra.osra_id), {
      preserveScroll: true,
      onSuccess: () => {
        setProcessing(false);
        onClose();
      },
      onError: (errs) => {
        setProcessing(false);
        setError(errs?.osra || "Cannot delete this family while users are assigned to it.");
      },
    });
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
          {error && <p className="text-danger small mt-2 mb-0">{error}</p>}
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-danger" onClick={handleDelete} disabled={processing}>{t('osra.delete')}</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>{t('profile.cancel')}</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteOsraModal;
