import React from "react";
import "../../css/checkoutModal.css";

const EditUserModal = ({ editData, editErrors, onChange, onSubmit, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content edit-modal">
        <div className="modal-header">
          <h3>Edit User</h3>
          <button className="close-btn fs-2" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Name */}
          <label>Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={editErrors.full_name ? "is-invalid" : ""}
          />
          {editErrors.full_name && <div className="invalid-feedback">{editErrors.full_name}</div>}

          {/* Email */}
          <label>Email</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={editErrors.email ? "is-invalid" : ""}
          />
          {editErrors.email && <div className="invalid-feedback">{editErrors.email}</div>}

          {/* Phone */}
          <label>Phone</label>
          <input
            type="tel"
            value={editData.phone}
            maxLength={11}
            onChange={(e) => onChange("phone", e.target.value)}
            className={editErrors.mobile ? "is-invalid" : ""}
          />
          {editErrors.mobile && <div className="invalid-feedback">{editErrors.mobile}</div>}

          {/* Role */}
          <label>Role</label>
          <select
            value={editData.user_type}
            onChange={(e) => onChange("user_type", e.target.value)}
            className={editErrors.user_type ? "is-invalid" : ""}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
          {editErrors.user_type && <div className="invalid-feedback">{editErrors.user_type}</div>}

{/* Family Code */}
<label>Family Code</label>
<input
  type="text"
  value={editData.osra_code || ""}
  onChange={(e) => onChange("osra_code", e.target.value)}
  className={editErrors.osra_code ? "is-invalid" : ""}
/>
{editErrors.osra_code && <div className="invalid-feedback">{editErrors.osra_code}</div>}

          {/* Profile Photo */}
          <div className="file-upload">
            <label className="upload-btn">
              Upload Photo
              <input
                type="file"
                hidden
                onChange={(e) => onChange("profilePhoto", e.target.files[0])}
              />
            </label>
            {editData.profilePhoto && <span className="file-name">{editData.profilePhoto.name}</span>}
          </div>
          {editData.profilePhoto && (
            <img
              src={URL.createObjectURL(editData.profilePhoto)}
              className="rounded mt-2"
              width="80"
            />
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onSubmit}>Save Changes</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>

        <style>{`
          .edit-modal { 
            width: 450px; 
            max-height: 80vh; 
            background: #f0f5ff; 
            border-radius: 14px; 
            box-shadow: 0 20px 40px rgba(13,110,253,0.2); 
            animation: scaleIn 0.2s ease; 
            display: flex; 
            flex-direction: column;
          }
          .edit-modal .modal-header { 
            background: linear-gradient(135deg,#0d6efd,#0b5ed7); 
            color:white; 
            padding:16px 20px; 
            border-radius:14px 14px 0 0; 
            display:flex; 
            justify-content:space-between; 
            align-items:center; 
            flex-shrink: 0;
          }
          .close-btn { background:transparent; border:none; color:white; font-size:22px; cursor:pointer; }
          .modal-body { padding:20px; display:flex; flex-direction:column; gap:12px; overflow-y:auto; }
          .modal-body label { font-weight:600; }
          .modal-body input, .modal-body select { width:100%; padding:10px 12px; border-radius:8px; border:1px solid #ced4da; }
          .modal-body input:focus, .modal-body select:focus { outline:none; border-color:#0d6efd; }
          .file-upload { margin-top:8px; display:flex; align-items:center; gap:10px; }
          .upload-btn { background-color:#0d6efd; color:white; padding:8px 14px; border-radius:8px; cursor:pointer; font-weight:500; }
          .file-name { font-size:0.9rem; color:#495057; }
          .modal-footer { padding:16px 20px; display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #dee2e6; flex-shrink: 0; }
          @keyframes scaleIn { from { transform:scale(0.9); opacity:0; } to { transform:scale(1); opacity:1; } }
        `}</style>
      </div>
    </div>
  );
};

export default EditUserModal;