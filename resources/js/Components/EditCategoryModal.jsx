import React, { useState } from "react";
import { router } from "@inertiajs/react";
import styles from "../../css/EditModal.module.css";

const EditCategoryModal = ({ category, onClose }) => {
    const [name, setName] = useState(category.category_name || "");
    const [description, setDescription] = useState(
        category.category_description || ""
    );
    const [photo, setPhoto] = useState(null);
    const [fileName, setFileName] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleConfirm = () => {
    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("category_description", description);
    if (photo) formData.append("category_photo", photo);

    // Spoof PUT over POST (important for FormData)
    formData.append("_method", "put");

    setProcessing(true);
    router.post(route("categories.update", category.category_id), formData, {
        forceFormData: true,
        onSuccess: () => {
        setProcessing(false);
        onClose();
        },
        onError: () => setProcessing(false),
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
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label>Category Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

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
                        {fileName && (
                            <span className={styles.fileName}>{fileName}</span>
                        )}
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
                    <button
                        className="btn btn-outline-secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCategoryModal;
