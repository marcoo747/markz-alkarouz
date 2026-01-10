import React from "react";
import "../../css/checkoutModal.css";

const DeleteUserModal = ({ userNmae, onConfirm, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content red-modal">
        <div className="modal-header">
          <h3>Delete User</h3>
          <button className="close-btn fs-2" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to delete "<strong>{userNmae}</strong>"?</p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
        <style>{`
          .red-modal { width: 420px; background: #fff5f5; border-radius: 14px; box-shadow: 0 20px 40px rgba(220,53,69,0.2); animation: scaleIn 0.2s ease; }
          .modal-header { background: linear-gradient(135deg, #dc3545, #b02a37); color: white; padding: 16px 20px; border-radius: 14px 14px 0 0; display: flex; justify-content: space-between; align-items: center; }
          .close-btn { background: transparent; border: none; color: white; font-size: 22px; cursor: pointer; }
          .modal-body { padding: 20px; font-size: 1rem; }
          .modal-footer { padding: 16px 20px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #dee2e6; }
          @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `}</style>
      </div>
    </div>
  );
};

export default DeleteUserModal;
