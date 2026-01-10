import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import "../../css/checkoutModal.css";

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
    <div className="modal-overlay">
      <div className="modal-content add-modal">
        <div className="modal-header">
          <h3>Add Category</h3>
          <button className="close-btn fs-2" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <label>Category Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Category Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="file-upload">
            <label className="upload-btn">
              Upload Photo
              <input type="file" hidden onChange={(e) => { setPhoto(e.target.files[0]); setFileName(e.target.files[0].name); }} />
            </label>
            {fileName && <span className="file-name">{fileName}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-success" onClick={handleConfirm} disabled={processing}>
            {processing ? "Adding..." : "Add Category"}
          </button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>

        <style>{`
          .add-modal { width:420px; background:#e6f4ea; border-radius:14px; box-shadow:0 20px 40px rgba(46,204,113,0.2); animation: scaleIn 0.2s ease; }
          .add-modal .modal-header { background:linear-gradient(135deg,#2ecc71,#27ae60); color:white; padding:16px 20px; border-radius:14px 14px 0 0; display:flex; justify-content:space-between; align-items:center; }
          .close-btn { background:transparent; border:none; color:white; font-size:22px; cursor:pointer; }
          .modal-body { padding:20px; }
          .modal-body label { font-weight:600; margin-top:12px; display:block; }
          .modal-body input, .modal-body textarea { width:100%; margin-top:6px; padding:10px 12px; border-radius:8px; border:1px solid #ced4da; }
          .modal-body input:focus, .modal-body textarea:focus { outline:none; border-color:#27ae60; }
          .file-upload { margin-top:16px; display:flex; align-items:center; gap:10px; }
          .upload-btn { background-color:#27ae60; color:white; padding:8px 14px; border-radius:8px; cursor:pointer; font-weight:500; }
          .file-name { font-size:0.9rem; color:#495057; }
          .modal-footer { padding:16px 20px; display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #dee2e6; }
          @keyframes scaleIn { from { transform:scale(0.9); opacity:0; } to { transform:scale(1); opacity:1; } }
        `}</style>
      </div>
    </div>
  );
};

export default AddCategoryModal;
