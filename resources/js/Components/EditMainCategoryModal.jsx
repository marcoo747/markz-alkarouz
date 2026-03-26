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

          <div className="flex items-center justify-between mt-2 py-2 border-b border-gray-100 mb-2">
            <span className="font-medium text-slate-700 text-sm">Can Be Requested Outside The Church?</span>
            <button
              type="button"
              onClick={() => setCanGoOutside(!canGoOutside)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2 ${canGoOutside ? 'bg-[#2563eb]' : 'bg-gray-200'}`}
              id="can_go_outside"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 flex items-center justify-center transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${canGoOutside ? 'translate-x-5' : 'translate-x-0'}`}
              >
                  <svg className={`h-3.5 w-3.5 text-[#2563eb] transition-all duration-300 ${canGoOutside ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
              </span>
            </button>
          </div>

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