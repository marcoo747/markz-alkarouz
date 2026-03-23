import React, { useState } from "react";
import { router } from "@inertiajs/react";
import styles from "../../css/EditModal.module.css";

const EditCategoryModal = ({ category, onClose, onConfirm }) => {
  const [name, setName] = useState(category.category_name || "");
  const [description, setDescription] = useState(
    category.category_description || ""
  );
  const [photo, setPhoto] = useState(null);
  const [fileName, setFileName] = useState("");
  const [canGoOutside, setCanGoOutside] = useState(
    category.can_go_outside ? true : false
  );
  const [processing, setProcessing] = useState(false);

  const handleConfirm = () => {
    if (!name) return alert("Category name is required");

    setProcessing(true);

    // Send back to parent
    onConfirm({
      name,
      description,
      photo,
      canGoOutside,
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal}>
        <div className={styles.modalHeader}>
          <h3>Edit Category</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <label>Category Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Category Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="flex items-center gap-2 mt-3">
            Can Be Requested Outside The Church?
            <input
              type="checkbox"
              checked={canGoOutside}
              onChange={(e) => setCanGoOutside(e.target.checked)}
            />
          </label>

          <div className={styles.fileUpload}>
            <label className={styles.uploadBtn}>
              Upload Photo
              <input
                type="file"
                hidden
                onChange={(e) => {
                  setPhoto(e.target.files[0]);
                  setFileName(e.target.files[0].name);
                }}
              />
            </label>
            {fileName && <span className={styles.fileName}>{fileName}</span>}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={processing}
          >
            {processing ? "Saving..." : "Save Changes"}
          </button>
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;