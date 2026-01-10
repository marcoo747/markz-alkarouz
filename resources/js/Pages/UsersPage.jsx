import React, { useState } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import DeleteUserModal from "@/Components/DeleteUserModal";
import EditUserModal from "@/Components/EditUserModal";

const UsersPage = () => {
  const { users, osras } = usePage().props;

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    user_type: "user",
    osra_id: "",
    profilePhoto: null,
  });

  const [editErrors, setEditErrors] = useState({});

  // DELETE USER
  const deleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    router.delete(route("users.destroy", userToDelete.user_id), {
      onSuccess: () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
      },
      onError: (errors) => {
        console.error(errors);
        setShowDeleteModal(false);
        setUserToDelete(null);
      },
      preserveScroll: true,
    });
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({
      name: user.full_name,
      email: user.email,
      phone: user.mobile,
      user_type: user.user_type || "user",
      osra_id: user.osra?.osra_id || "",
      profilePhoto: null,
    });
    setEditErrors({});
    setShowEditModal(true);
  };

    const handleEditSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PUT"); // important for PUT
    formData.append("full_name", editData.name || "");
    formData.append("email", editData.email || "");
    formData.append("mobile", editData.phone || "");
    formData.append("user_type", editData.user_type || "");
    formData.append("osra_code", editData.osra_code || "");
    if (editData.profilePhoto) {
        formData.append("profilePhoto", editData.profilePhoto);
    }

    router.post(route("users.update", selectedUser.user_id), formData, {
        forceFormData: true,
        onError: (errors) => setEditErrors(errors),
        onSuccess: () => setShowEditModal(false),
    });
    };

  return (
    <div className="bg-light min-vh-100">
      <Head title="مركز وسائل الإيضاح" />
      <NavBar page_name="users" />

      <div className="container py-5">
        {/* ================= HEADER ================= */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div className="flex-grow-1">
            <h2 className="fw-bold mb-1">Users Management</h2>
            <small className="text-muted">
              Manage all registered users
            </small>
          </div>

          <button
            className="btn btn-success px-4"
            onClick={() => router.visit(route("register"))}
          >
            Add User
          </button>
        </div>

        {/* ================= TABLE ================= */}
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            {!users.length ? (
              <div className="text-center py-5">
                <i className="bi bi-people display-4 text-muted"></i>
                <p className="mt-3 text-muted fw-semibold">
                  No users found
                </p>
              </div>
            ) : (
              <div className="users-table-container">
                <table className="table table-hover align-middle mb-0 users-table">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>User</th>
                      <th>Role</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.user_id}>
                        <td className="fw-semibold">
                          {index + 1}
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-3">
                            {user.user_photo ? (
                              <img
                                src={user.user_photo}
                                alt={user.full_name}
                                className="user-avatar rounded-circle border"
                              />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                className="user-avatar-icon bi bi-person-circle"
                                viewBox="0 0 16 16"
                              >
                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                <path
                                  fillRule="evenodd"
                                  d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                                />
                              </svg>
                            )}

                            <span className="fw-semibold">
                              {user.full_name}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span className="badge bg-secondary">
                            {user.user_type}
                          </span>
                        </td>

                        <td>{user.mobile}</td>
                        <td>{user.email}</td>

                          <td className="text-center user-actions">
                            <div className="d-flex justify-content-center gap-2 action-buttons flex-wrap">
                              <button
                                className="btn btn-sm btn-primary px-2"
                                onClick={() => openEditModal(user)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-danger px-2"
                                onClick={() => deleteUser(user)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {showEditModal && (
        <EditUserModal
          editData={{ ...editData, osras }}
          editErrors={editErrors}
          onChange={(field, value) => setEditData({ ...editData, [field]: value })}
          onSubmit={handleEditSubmit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && userToDelete && (
        <DeleteUserModal
          userNmae={userToDelete.full_name}
          onConfirm={handleConfirmDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default UsersPage;