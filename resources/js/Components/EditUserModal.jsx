import React from "react";
import styles from "../../css/EditModal.module.css";

const EditUserModal = ({ editData, editErrors, onChange, onSubmit, onClose }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal}>
        <div className={styles.modalHeader}>
          <h3>Edit User</h3>
          <button className={`${styles.closeBtn} fs-2`} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
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
          <div className={styles.fileUpload}>
            <label className={styles.uploadBtn}>
              Upload Photo
              <input
                type="file"
                hidden
                onChange={(e) => onChange("profilePhoto", e.target.files[0])}
              />
            </label>
            {editData.profilePhoto && <span className={styles.fileName}>{editData.profilePhoto.name}</span>}
          </div>
          {editData.profilePhoto && (
            <img
              src={URL.createObjectURL(editData.profilePhoto)}
              className="rounded mt-2"
              width="80"
            />
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-primary" onClick={onSubmit}>Save Changes</button>
          <button className="btn btn-outline-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;