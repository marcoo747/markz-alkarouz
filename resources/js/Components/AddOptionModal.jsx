import React, { useState } from "react";
import { route } from "ziggy-js";

const AddOptionModal = ({ type, productId, onClose }) => {
  const [value, setValue] = useState(type === "color" ? "#000000" : "");

  const urlMap = {
    material: route("products.add-material"),
    color: route("products.add-color"),
    size: route("products.add-size"),
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content green-modal">
        <div className="modal-header">
          <h3>Add {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
          <button className="close-btn fs-2" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <form
            action={urlMap[type]}
            method="POST"
            encType="multipart/form-data"
          >
            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]').content} />
            <input type="hidden" name="product_id" value={productId} />

            {type === "color" ? (
              <input
                type="color"
                name="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                style={{ width: "100%", height: "50px", border: "none", marginBottom: "16px", cursor: "pointer" }}
                required
              />
            ) : (
              <input
                type="text"
                name="value"
                value={value}
                placeholder={`Enter ${type}`}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            )}

            <div className="modal-footer">
              <button type="submit" className="btn btn-success">Add</button>
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
            </div>
          </form>
        </div>

        <style>{`
          .green-modal {
            width: 420px;
            background: #f0fff4;
            border-radius: 14px;
            box-shadow: 0 20px 40px rgba(0,128,0,0.2);
            animation: scaleIn 0.2s ease;
          }
          .green-modal .modal-header {
            background: linear-gradient(135deg, #28a745, #218838);
            color: white;
            padding: 16px 20px;
            border-radius: 14px 14px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .close-btn { background: transparent; border: none; color: white; font-size: 22px; cursor: pointer; }
          .modal-body { padding: 20px; }
          .modal-body input { width: 100%; margin-top: 6px; padding: 10px 12px; border-radius: 8px; border: 1px solid #ced4da; }
          .modal-body input:focus { outline: none; border-color: #28a745; }
          .modal-footer { padding: 16px 0 0; display: flex; justify-content: flex-end; gap: 10px; }
          @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `}</style>
      </div>
    </div>
  );
};

export default AddOptionModal;
