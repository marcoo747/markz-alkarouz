import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import styles from "../../css/EditModal.module.css";

const EditOsraModal = ({ osra, onClose }) => {
  const { data, setData, put, errors } = useForm({
    osra_name: osra.osra_name,
    osra_code: osra.osra_code,
    osra_place: osra.osra_place,
    osra_time: osra.osra_time,
  });

  const handleConfirm = () => {
    put(route("osra.update", osra.osra_id), {
      onSuccess: () => { onClose(); window.location.reload(); }
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal}>
        <div className={styles.modalHeader}>
          <h3>Edit Family</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <label>Name</label>
          <input value={data.osra_name} onChange={(e) => setData("osra_name", e.target.value)} />
          {errors.osra_name && <p className="text-danger">{errors.osra_name}</p>}

          <label>Code</label>
          <input value={data.osra_code} onChange={(e) => setData("osra_code", e.target.value)} />
          {errors.osra_code && <p className="text-danger">{errors.osra_code}</p>}

          <label>Place</label>
          <input value={data.osra_place} onChange={(e) => setData("osra_place", e.target.value)} />
          {errors.osra_place && <p className="text-danger">{errors.osra_place}</p>}

          <label>Time</label>
          <input value={data.osra_time} onChange={(e) => setData("osra_time", e.target.value)} />
          {errors.osra_time && <p className="text-danger">{errors.osra_time}</p>}
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-primary" onClick={handleConfirm}>Save Changes</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditOsraModal;
