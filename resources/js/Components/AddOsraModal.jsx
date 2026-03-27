import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import styles from "../../css/AddModal.module.css";
import { useTranslation } from "react-i18next";

const AddOsraModal = ({ onClose }) => {
  const { t } = useTranslation();
  const { data, setData, post, reset, errors } = useForm({
    osra_name: "", osra_code: "", osra_place: "", osra_time: "", example_date: ""
  });

  const handleConfirm = () => {
    post(route("osra.store"), {
      onSuccess: () => { reset(); onClose(); window.location.reload(); }
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addModal}>
        <div className={styles.modalHeader}>
          <h3>{t('osra.add_family')}</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <label>{t('osra.input_fields.name')}</label>
          <input value={data.osra_name} onChange={(e) => setData("osra_name", e.target.value)} />
          {errors.osra_name && <p className="text-danger">{errors.osra_name}</p>}

          <label>{t('osra.input_fields.code')}</label>
          <input value={data.osra_code} onChange={(e) => setData("osra_code", e.target.value)} />
          {errors.osra_code && <p className="text-danger">{errors.osra_code}</p>}

          <label>{t('osra.input_fields.place')}</label>
          <input value={data.osra_place} onChange={(e) => setData("osra_place", e.target.value)} />
          {errors.osra_place && <p className="text-danger">{errors.osra_place}</p>}

          <label>{t('osra.input_fields.time')}</label>
          <input value={data.osra_time} onChange={(e) => setData("osra_time", e.target.value)} />
          {errors.osra_time && <p className="text-danger">{errors.osra_time}</p>}

          <label>{t('osra.input_fields.example_date')}</label>
          <input value={data.example_date} onChange={(e) => setData("example_date", e.target.value)} type="date"/>
          {errors.example_date && <p className="text-danger">{errors.example_date}</p>}
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-success" onClick={handleConfirm}>{t('osra.add_family')}</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>{t('profile.cancel')}</button>
        </div>
      </div>
    </div>
  );
};

export default AddOsraModal;
