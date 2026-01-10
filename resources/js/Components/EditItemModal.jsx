import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import "../../css/checkoutModal.css";

const EditItemModal = ({ currentItem, onClose }) => {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (currentItem) {
      setName(currentItem.title || "");
      setBrand(currentItem.brand || "");
      setDescription(currentItem.description || "");
      setPrice(currentItem.price || "");
    }
  }, [currentItem]);

  const handleConfirm = () => {
    router.put(
      route("items.update", {item: currentItem.id}),
      { name, brand, description, price: parseFloat(price) || 0 },
      { preserveScroll: true, onSuccess: () => onClose() }
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content edit-modal">
        <div className="modal-header">
          <h3>Edit Item</h3>
          <button className="close-btn fs-2" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <label>Item Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />

          <label>Item Brand</label>
          <input value={brand} onChange={(e) => setBrand(e.target.value)} />

          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />

          <label>Price</label>
          <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleConfirm}>Save Changes</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>

        <style>{`
          .edit-modal {margin-top: 5.5%; width: 420px; background: #f0f5ff; border-radius: 14px; box-shadow: 0 20px 40px rgba(13,110,253,0.2); animation: scaleIn 0.2s ease; }
          .edit-modal .modal-header { background: linear-gradient(135deg,#0d6efd,#0b5ed7); color:white; padding:16px 20px; border-radius:14px 14px 0 0; display:flex; justify-content:space-between; align-items:center; }
          .close-btn { background:transparent; border:none; color:white; font-size:22px; cursor:pointer; }
          .modal-body { padding:20px; }
          .modal-body label { font-weight:600; margin-top:12px; display:block; }
          .modal-body input, .modal-body textarea { width:100%; margin-top:6px; padding:10px 12px; border-radius:8px; border:1px solid #ced4da; }
          .modal-body input:focus, .modal-body textarea:focus { outline:none; border-color:#0d6efd; }
          .file-upload { margin-top:16px; display:flex; align-items:center; gap:10px; }
          .upload-btn { background-color:#0d6efd; color:white; padding:8px 14px; border-radius:8px; cursor:pointer; font-weight:500; }
          .file-name { font-size:0.9rem; color:#495057; }
          .modal-footer { padding:16px 20px; display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #dee2e6; }
          @keyframes scaleIn { from { transform:scale(0.9); opacity:0; } to { transform:scale(1); opacity:1; } }
        `}</style>
      </div>
    </div>
  );
};

export default EditItemModal;
