import React, { useState } from "react";
import { route } from "ziggy-js";
import axios from "axios";

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
    <div className="modal-overlay">
      <div className="modal-content green-modal">
        <div className="modal-header">
          <h3>Upload Photo</h3>
          <button className="close-btn fs-2" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleUpload}>
            <label className="upload-btn">
              {photo ? photo.name : "Choose Photo"}
              <input type="file" accept="image/*" hidden onChange={(e) => setPhoto(e.target.files[0])} required />
            </label>

            <div className="modal-footer">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>Close</button>
            </div>
          </form>
        </div>

        <style>{`
          .green-modal { width: 420px; background: #f0fff4; border-radius: 14px; box-shadow: 0 20px 40px rgba(0,128,0,0.2); animation: scaleIn 0.2s ease; }
          .green-modal .modal-header { background: linear-gradient(135deg, #28a745, #218838); color: white; padding: 16px 20px; border-radius: 14px 14px 0 0; display:flex; justify-content:space-between; align-items:center; }
          .close-btn { background:transparent; border:none; color:white; font-size:22px; cursor:pointer; }
          .modal-body { padding:20px; }
          .upload-btn { background-color:#28a745; color:white; padding:8px 14px; border-radius:8px; cursor:pointer; font-weight:500; display:inline-block; }
          .modal-footer { padding:16px 0 0; display:flex; justify-content:flex-end; gap:10px; }
          @keyframes scaleIn { from { transform:scale(0.9); opacity:0; } to { transform:scale(1); opacity:1; } }
        `}</style>
      </div>
    </div>
  );
};

export default ImageUploadModal;
