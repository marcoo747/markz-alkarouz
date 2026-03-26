import React, { useState, useEffect } from "react";
import { usePage, router, Head } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import NavBar from "@/Components/NavBar";
import DeleteUserModal from "@/Components/DeleteUserModal";
import EditUserModal from "@/Components/EditUserModal";
import TopAlert from "@/Components/TopAlert";

const UsersPage = () => {
  const { t } = useTranslation();
  const { users, osras, flash } = usePage().props;

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (flash?.success) {
      setAlertMessage(flash.success);
      setTimeout(() => setAlertMessage(""), 3000);
    }
  }, [flash]);

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
        setAlertMessage(t('users.delete_success') || "User deleted successfully");
        setTimeout(() => setAlertMessage(""), 3000);
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
        onSuccess: () => {
          setShowEditModal(false);
          setAlertMessage(t('users.edit_success') || "User updated successfully");
          setTimeout(() => setAlertMessage(""), 3000);
        },
    });
    };

    const getRoleBadgeColor = (role) => {
      switch (role?.toLowerCase()) {
        case 'admin': return 'bg-primary';
        case 'manager': return 'bg-warning text-dark';
        default: return 'bg-secondary';
      }
    };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Head title={t('home.page_title')} />
      <NavBar page_name="users" />
      <TopAlert message={alertMessage} onClose={() => setAlertMessage("")} />

      <div className="container py-5">
        {/* ================= HEADER ================= */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div className="flex-grow-1">
            <h2 className="fw-bold mb-1 text-dark">{t('users.title')}</h2>
            <small className="text-muted">
              {t('users.subtitle')}
            </small>
          </div>

          <div>
            <button
              className="btn btn-success px-4 py-2 rounded-pill shadow-sm hover:shadow transition-all"
              onClick={() => router.visit(route("register"))}
              style={{ width: "auto" }}
            >
              <i className="bi bi-person-plus-fill me-2"></i>
              {t('users.add_user')}
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
          <div className="card-body p-0">
            {!users.length ? (
              <div className="text-center py-5">
                <i className="bi bi-people display-1 text-muted opacity-25"></i>
                <p className="mt-3 text-muted fw-semibold fs-5">
                  {t('users.no_users')}
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0 users-table">
                  <thead className="table-light">
                    <tr>
                      <th className="px-4 py-3 text-secondary">{t('users.hash')}</th>
                      <th className="py-3 text-secondary">{t('users.user_col')}</th>
                      <th className="py-3 text-secondary">{t('users.role')}</th>
                      <th className="py-3 text-secondary">{t('users.mobile')}</th>
                      <th className="py-3 text-secondary">{t('users.email')}</th>
                      <th className="text-center py-3 text-secondary">{t('users.actions')}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.user_id} className="transition-all hover:bg-light">
                        <td className="fw-semibold px-4">
                          {index + 1}
                        </td>

                        <td>
                          <div className="d-flex align-items-center gap-3 py-2">
                            {user.user_photo ? (
                              <img
                                src={user.user_photo}
                                alt={user.full_name}
                                className="user-avatar rounded-circle border shadow-sm"
                                style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-secondary" style={{ width: '45px', height: '45px' }}>
                                <i className="bi bi-person-fill fs-4"></i>
                              </div>
                            )}

                            <div>
                              <span className="fw-bold text-dark d-block">
                                {user.full_name}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className={`badge rounded-pill px-3 py-2 ${getRoleBadgeColor(user.user_type)}`}>
                            {user.user_type}
                          </span>
                        </td>

                        <td className="text-muted">{user.mobile}</td>
                        <td className="text-muted">{user.email}</td>

                        <td className="text-center user-actions">
                          <div className="d-flex justify-content-center gap-2 action-buttons flex-wrap">
                            <button
                              className="btn btn-sm btn-outline-primary px-3 rounded-pill transition-colors"
                              onClick={() => openEditModal(user)}
                            >
                              <i className="bi bi-pencil-fill me-1"></i> {t('users.edit')}
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger px-3 rounded-pill transition-colors"
                              onClick={() => deleteUser(user)}
                            >
                              <i className="bi bi-trash-fill me-1"></i> {t('users.delete')}
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