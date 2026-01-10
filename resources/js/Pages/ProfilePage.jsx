import React, { useState } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import Container from "@/Components/Container";

const ProfilePage = () => {
  const { user, requests = [] } = usePage().props; // requests from backend

  // --- Edit Profile ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    name: user.name,
    phone: user.phone,
    email: user.email,
    profilePhoto: null,
    osra_code: "",
  });
  const [fileName, setFileName] = useState("");

  const [editErrors, setEditErrors] = useState({});

  // --- Password Modal ---
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // --- Handle profile change ---
  const handleEditChange = (e) => {
    if (e.target.name === "profilePhoto") {
      setEditData({ ...editData, profilePhoto: e.target.files[0] });
    } else {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", editData.name);
    formData.append("email", editData.email);
    formData.append("mobile", editData.phone);
    if (editData.profilePhoto) formData.append("user_photo", editData.profilePhoto);
    if (editData.osra_code) formData.append("osra_code", editData.osra_code);

    router.post(route("profile.update"), formData, {
      forceFormData: true,
      onSuccess: () => {
        setEditErrors({});
        setShowEditModal(false);
      },
      onError: (errors) => {
        setEditErrors(errors);
      },
    });
  };

  // --- Handle password change ---
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("current_password", passwordData.currentPassword);
    formData.append("new_password", passwordData.newPassword);
    formData.append("new_password_confirmation", passwordData.confirmPassword);

    router.post(route("password.change"), formData, {
      forceFormData: true,
      onSuccess: () => {
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setPasswordErrors({});
        setShowPasswordModal(false);
      },
      onError: (errors) => {
        setPasswordErrors(errors);
      },
    });
  };

  return (
    <>
      <Head title="مركز وسائل الإيضاح" />
      <NavBar page_name="profile" />

      <Container>
        <div className="row mt-4 g-4">
          {/* Profile */}
          <div className="col-12 col-md-4">
            <div className="card shadow-sm text-center p-4">
              <img
                src={user.profilePhoto}
                className="rounded-circle mx-auto"
                style={{ width: 120, height: 120, objectFit: "cover" }}
                alt="Profile"
              />
              <h5 className="mb-1">{user.name}</h5>
              <p className="text-muted mb-0">{user.email}</p>
              <p className="text-muted mt-0">{user.phone}</p>

              <div className="profile-osra mt-3 p-3 border rounded bg-light text-start mb-4">
                {user.osra ? (
                  <>
                    <h6 className="mb-2">🧑‍👩‍👧 Family Details</h6>
                    <div className="d-flex flex-column gap-1">
                      <span>
                        <strong>Name:</strong> {user.osra.osra_name}
                      </span>
                      <span>
                        <strong>Place:</strong> {user.osra.osra_place}
                      </span>
                      <span>
                        <strong>Time:</strong> {user.osra.osra_time}
                      </span>
                      <span>
                        <strong>Code:</strong> <span className="badge bg-primary">{user.osra.osra_code}</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted mb-0">No Family assigned</p>
                )}
              </div>

              <button
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => setShowEditModal(true)}
              >
                Edit Profile
              </button>

              <button
                className="btn btn-primary w-100"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Requests */}
          <div className="col-12 col-md-8">
            <h5 className="mb-3">Latest Requests</h5>

            {requests.length === 0 && (
              <div className="alert alert-info">No requests yet.</div>
            )}

            {requests.map((request, index) => (
              <div key={request.request_id} className="card shadow-sm mb-3">
                <div className="card-body">
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong>Request #{++index}</strong>
                    <span
                      className={`badge ${
                        request.request_status === "accepted"
                          ? "bg-success"
                          : request.request_status === "pending"
                          ? "bg-warning text-dark"
                          : request.request_status === "done"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {request.request_status}
                    </span>
                  </div>

                  {/* Osra Name */}
                  <div className="mb-2">
                    <span className="badge bg-primary">{request.osra_name ?? request.osra_code}</span>
                  </div>

                  {/* Date & Time Range */}
                  <div className="mb-2 text-muted small">
                    {request.start_date && request.start_time ? (
                      <>
                        <strong>Start:</strong>{" "}
                        {new Date(request.start_date + "T" + request.start_time).toLocaleString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    ) : (
                      request.osra_time && <><strong>Time:</strong> {request.osra_time}</>
                    )}
                    <br />
                    {request.end_date && request.end_time && (
                      <>
                        <strong>End:</strong>{" "}
                        {new Date(request.end_date + "T" + request.end_time).toLocaleString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="text-muted small">
                    <strong>Ordered at:</strong>{" "}
                    {new Date(request.created_at).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {/* --- Edit Profile Modal --- */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-dialog-centered">
            <div className="modal-content edit-modal">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h3 className="modal-title">Edit Profile</h3>
                  <button
                    type="button"
                    className="close-btn fs-2"
                    onClick={() => setShowEditModal(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className={`form-control ${editErrors.name ? "is-invalid" : ""}`}
                    />
                    {editErrors.name && <div className="invalid-feedback">{editErrors.name}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      className={`form-control ${editErrors.email ? "is-invalid" : ""}`}
                    />
                    {editErrors.email && (
                      <div className="invalid-feedback">{editErrors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={(e) => {
                        // allow only numbers
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        setEditData({ ...editData, phone: value });
                      }}
                      className={`form-control ${editErrors.phone ? "is-invalid" : ""}`}
                      placeholder="01XXXXXXXXX"
                      inputMode="numeric"
                      maxLength={11}
                    />
                    {editErrors.phone && <div className="invalid-feedback">{editErrors.phone}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Family Code</label>
                    <input
                      type="text"
                      name="osra_code"
                      value={editData.osra_code}
                      onChange={handleEditChange}
                      className={`form-control ${editErrors.osra_code ? "is-invalid" : ""}`}
                      placeholder="Enter family code"
                    />
                    {editErrors.osra_code && (
                      <div className="invalid-feedback">{editErrors.osra_code}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Profile Photo</label>

                    <div className="file-upload">
                      <label className="upload-btn mt-0">
                        Upload Photo
                        <input
                          type="file"
                          name="profilePhoto"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;

                            setEditData((prev) => ({
                              ...prev,
                              profilePhoto: file,
                            }));
                            setFileName(file.name);
                          }}
                        />
                      </label>

                      {fileName && <span className="file-name">{fileName}</span>}
                    </div>

                    {editErrors.profilePhoto && (
                      <div className="invalid-feedback d-block">
                        {editErrors.profilePhoto}
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- Password Modal --- */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-dialog-centered">
            <div className="modal-content edit-modal">
              <form onSubmit={handlePasswordSubmit}>
                <div className="modal-header">
                  <h3 className="modal-title">Change Password</h3>
                  <button
                    type="button"
                    className="close-btn fs-2"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    ×
                  </button>
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`form-control ${passwordErrors.current_password ? "is-invalid" : ""}`}
                    />
                    {passwordErrors.current_password && (
                      <div className="invalid-feedback">{passwordErrors.current_password}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`form-control ${passwordErrors.new_password ? "is-invalid" : ""}`}
                    />
                    {passwordErrors.new_password && (
                      <div className="invalid-feedback">{passwordErrors.new_password}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`form-control ${passwordErrors.new_password_confirmation ? "is-invalid" : ""}`}
                    />
                    {passwordErrors.new_password_confirmation && (
                      <div className="invalid-feedback">{passwordErrors.new_password_confirmation}</div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ===== Modal Overlay (page background) ===== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6); /* page background when modal is open */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }

        /* ===== Centering Wrapper ===== */
        .modal-dialog-centered {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        /* ===== Modal Box ===== */
        .edit-modal {
          padding: 20px;
          width: 420px;
          background: #f0f5ff;
          border-radius: 14px;
          box-shadow: 0 20px 40px rgba(13, 110, 253, 0.2);
          animation: scaleIn 0.2s ease;
        }

        /* ===== Header ===== */
        .edit-modal .modal-header {
          background: linear-gradient(135deg, #0d6efd, #0b5ed7);
          color: white;
          padding: 16px 20px;
          border-radius: 14px 14px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* ===== Close Button ===== */
        .close-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 22px;
          cursor: pointer;
        }

        /* ===== Body ===== */
        .modal-body {
          padding: 20px;
        }

        .modal-body label {
          font-weight: 600;
          margin-top: 12px;
          display: block;
        }

        .modal-body input,
        .modal-body textarea {
          width: 100%;
          margin-top: 6px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ced4da;
        }

        .modal-body input:focus,
        .modal-body textarea:focus {
          outline: none;
          border-color: #0d6efd;
        }

        /* ===== File Upload ===== */
        .file-upload {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .upload-btn {
          background-color: #0d6efd;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .file-name {
          font-size: 0.9rem;
          color: #495057;
        }

        /* ===== Footer ===== */
        .modal-footer {
          padding: 16px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid #dee2e6;
        }

        /* ===== Animation ===== */
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default ProfilePage;