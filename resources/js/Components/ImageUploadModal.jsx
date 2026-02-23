import React, { useState } from "react";
import { route } from "ziggy-js";
import axios from "axios";
import styles from "../../css/ImageUploadModal.module.css";

const ImageUploadModal = ({ product, onClose, onUploaded }) => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!photo) return alert("Please select a photo!");

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("product_id", product.product_id);
    formData.append("_token", document.querySelector('meta[name="csrf-token"]').content);

    try {
      setLoading(true);
      await axios.post(route("products.upload_image"), formData, { headers: { "Content-Type": "multipart/form-data" } });
      setLoading(false);
      onUploaded?.();
      onClose();
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Upload failed!");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.greenModal}>
        <div className={styles.modalHeader}>
          <h3>Upload Photo</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleUpload}>
            <label className={styles.uploadBtn}>
              {photo ? photo.name : "Choose Photo"}
              <input type="file" accept="image/*" hidden onChange={(e) => setPhoto(e.target.files[0])} required />
            </label>

            <div className={styles.modalFooter}>
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
