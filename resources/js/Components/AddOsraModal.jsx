import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import styles from "../../css/AddModal.module.css";

const AddOsraModal = ({ onClose }) => {
  const { data, setData, post, reset, errors } = useForm({
    osra_name: "", osra_code: "", osra_place: "", osra_time: ""
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
          <h3>Add Family</h3>
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
          <button className="btn btn-success" onClick={handleConfirm}>Add Family</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddOsraModal;
