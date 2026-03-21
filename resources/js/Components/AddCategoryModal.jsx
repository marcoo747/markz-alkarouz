import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import styles from "../../css/AddModal.module.css";

const AddCategoryModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [fileName, setFileName] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleConfirm = () => {
    if (!name || !description || !photo) return alert("All fields are required!");
    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("category_description", description);
    formData.append("category_photo", photo);

    setProcessing(true);
    Inertia.post(route("categories.store"), formData, {
      onSuccess: () => { setProcessing(false); onClose(); },
      onError: () => setProcessing(false),
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addModal}>
        <div className={styles.modalHeader}>
          <h3>Add Category</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <label>Category Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Category Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className={styles.fileUpload}>
            <label className={styles.uploadBtn}>
              Upload Photo
              <input type="file" hidden onChange={(e) => { setPhoto(e.target.files[0]); setFileName(e.target.files[0].name); }} />
            </label>
            {fileName && <span className={styles.fileName}>{fileName}</span>}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-success" onClick={handleConfirm} disabled={processing}>
            {processing ? "Adding..." : "Add Category"}
          </button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
