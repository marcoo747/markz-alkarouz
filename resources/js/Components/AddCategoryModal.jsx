import React, { useState } from "react";
import { router } from "@inertiajs/react";
import styles from "../../css/AddModal.module.css";

const AddCategoryModal = ({ onClose, main_category_id, main_categories = [] }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState(main_category_id || "");
  const [photo, setPhoto] = useState(null);
  const [fileName, setFileName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});

  const handleConfirm = () => {
    const resolvedMainId = main_category_id || selectedMainCategoryId;
    if (!name.trim() || !description.trim() || !photo || !resolvedMainId) {
      setFormError("All fields (including main category and photo) are required.");
      return;
    }

    setFormError("");
    setErrors({});
    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("category_description", description);
    formData.append("category_photo", photo);
    formData.append("main_category_id", resolvedMainId);

    setProcessing(true);
    router.post(route("categories.store"), formData, {
      forceFormData: true,
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setProcessing(false);
        onClose();
      },
      onError: (errs) => {
        setErrors(errs || {});
        setProcessing(false);
      },
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
          {formError && <p className="text-danger small mb-2">{formError}</p>}

          {!main_category_id && (
            <>
              <label>Main Category</label>
              <select
                value={selectedMainCategoryId}
                onChange={(e) => setSelectedMainCategoryId(e.target.value)}
                className="form-select mb-2"
              >
                <option value="">Select Main Category</option>
                {main_categories.map((mc) => (
                  <option key={mc.category_id} value={mc.category_id}>
                    {mc.category_name}
                  </option>
                ))}
              </select>
              {errors.main_category_id && <p className="text-danger small">{errors.main_category_id}</p>}
            </>
          )}

          <label>Category Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          {errors.category_name && <p className="text-danger small">{errors.category_name}</p>}

          <label>Category Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          {errors.category_description && <p className="text-danger small">{errors.category_description}</p>}

          <div className={styles.fileUpload}>
            <label className={styles.uploadBtn}>
              Upload Photo
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPhoto(file);
                    setFileName(file.name);
                  }
                }}
              />
            </label>
            {fileName && <span className={styles.fileName}>{fileName}</span>}
          </div>
          {errors.category_photo && <p className="text-danger small">{errors.category_photo}</p>}
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
