import React, { useState } from "react";
import { route } from 'ziggy-js';
import { Inertia } from "@inertiajs/inertia";
import styles from "../../css/AddModal.module.css";

const AddCategoryModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [fileName, setFileName] = useState("");
  const [canGoOutside, setCanGoOutside] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleConfirm = () => {
    if (!name || !description || !photo) return alert("All fields are required!");
    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("category_description", description);
    formData.append("category_photo", photo);
    formData.append("can_go_outside", canGoOutside ? 1 : 0);

    setProcessing(true);
    Inertia.post(route("main_categories.store"), formData, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => { setProcessing(false); onClose(); },
      onError: () => setProcessing(false),
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.addModal}>
        <div className={styles.modalHeader}>
          <h3>Add Main Category</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <label>Category Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Category Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <label className="flex items-center gap-2">
            Can Be Requested Outside The Church?
            <input
              type="checkbox"
              id="can_go_outside"
              className="text-green-500"
              checked={canGoOutside}
              onChange={(e) => setCanGoOutside(e.target.checked)}
            />
          </label>

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
            {processing ? "Adding..." : "Add Main Category"}
          </button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
