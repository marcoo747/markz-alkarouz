import React, { useState } from "react";
import { route } from "ziggy-js";
import axios from "axios";
import styles from "../../css/ImageUploadModal.module.css";

const ImageUploadModal = ({ product, onClose, onUploaded }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const maxAllowed = 5 - (product?.images?.length || 0);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > maxAllowed) {
      setErrorMsg(`You can only select up to ${maxAllowed} more photo(s).`);
      setPhotos([]);
      return;
    }
    setErrorMsg("");
    setPhotos(files);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (photos.length === 0) return alert("Please select a photo!");
    if (photos.length > maxAllowed) return alert(`Maximum ${maxAllowed} photos allowed.`);

    const formData = new FormData();
    photos.forEach(photo => formData.append("photos[]", photo));
    formData.append("product_id", product.product_id);
    formData.append("_token", document.querySelector('meta[name="csrf-token"]').content);

    try {
      setLoading(true);
      await axios.post(route("products.upload_image"), formData, { 
          headers: { 
              "Content-Type": "multipart/form-data",
              "Accept": "application/json"
          } 
      });
      setLoading(false);
      onUploaded?.();
      onClose();
    } catch (err) {
      setLoading(false);
      console.error(err);
      if (err.response?.data?.errors?.photos) {
          setErrorMsg(err.response.data.errors.photos[0] || "Upload failed due to validation.");
      } else if (err.response?.data?.message) {
          setErrorMsg(err.response.data.message);
      } else {
          setErrorMsg("Upload failed! Please check image sizes (max 2MB each).");
      }
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.greenModal}>
        <div className={styles.modalHeader}>
          <h3>Upload Photo(s)</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleUpload}>
            {maxAllowed > 0 ? (
                <>
                    <p className="text-muted small mb-3">You can upload up to <strong>{maxAllowed}</strong> more photo(s). Max 2MB each.</p>
                    <label className={styles.uploadBtn}>
                      {photos.length > 0 ? `${photos.length} photo(s) selected` : "Choose Photos"}
                      <input type="file" accept="image/*" hidden multiple onChange={handleFileChange} />
                    </label>
                </>
            ) : (
                <p className="text-danger fw-bold text-center">Maximum 5 photos reached for this product.</p>
            )}

            {errorMsg && <div className="alert alert-danger mt-3 py-2 text-center small">{errorMsg}</div>}

            <div className={styles.modalFooter}>
              {maxAllowed > 0 && (
                  <button type="submit" className="btn btn-success" disabled={loading || photos.length === 0}>
                    {loading ? "Uploading..." : "Upload"}
                  </button>
              )}
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
