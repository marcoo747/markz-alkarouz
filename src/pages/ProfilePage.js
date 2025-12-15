import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import Container from "../Components/Container";
import PasswordChecklist from "../Components/PasswordChecklist";
import ItemPack from "../Components/item-pack";

const ProfilePage = () => {
  // Mock user data - in a real app, this would come from API or context
  const [user, setUser] = useState({
    name: "John Doe",
    phone: "01123456789",
    profilePhoto: "/imgs/icon.png", // Using existing icon as placeholder
    families: [
      { name: "Jane Doe", relation: "Wife" },
      { name: "Alex Doe", relation: "Son" },
      { name: "Emma Doe", relation: "Daughter" },
    ],
    latestOrders: [
      {
        id: 1,
        date: "2023-10-01",
        total: "$50.00",
        status: "Delivered",
        items: [
          { name: "Apple", quantity: 5, pack: "Pack A" },
          { name: "Banana", quantity: 3, pack: "Pack B" },
        ],
      },
      {
        id: 2,
        date: "2023-09-25",
        total: "$30.00",
        status: "Shipped",
        items: [
          { name: "Orange", quantity: 2, pack: "Pack C" },
        ],
      },
      {
        id: 3,
        date: "2023-09-20",
        total: "$75.00",
        status: "Processing",
        items: [
          { name: "Grape", quantity: 10, pack: "Pack D" },
          { name: "Mango", quantity: 4, pack: "Pack E" },
        ],
      },
    ],
  });

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState(user.phone);
  const [phoneError, setPhoneError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePhoneSubmit = () => {
    const phoneRegex = /^01\d{9}$/;
    if (!phoneRegex.test(newPhone)) {
      setPhoneError("Phone number must be 11 digits starting with 01");
      return;
    }
    setUser({ ...user, phone: newPhone });
    setShowPhoneModal(false);
    setPhoneError("");
  };

  const handleDeleteOrder = (orderId) => {
    setUser({
      ...user,
      latestOrders: user.latestOrders.filter((order) => order.id !== orderId),
    });
  };

  const validatePasswordField = (field, value) => {
    switch (field) {
      case "currentPassword":
        if (!value) return "Please enter your current password.";
        return;
      case "newPassword":
        if (!value || value.length < 8)
          return "Password must be at least 8 characters.";
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value))
          return "Password must include uppercase, lowercase letters and a number.";
        return;
      case "confirmPassword":
        if (value !== passwordData.newPassword) return "Passwords do not match.";
        return;
      default:
        return;
    }
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData({ ...passwordData, [id]: value });
    setPasswordErrors((prev) => ({ ...prev, [id]: undefined }));
  };

  const handlePasswordSubmit = () => {
    const newErrors = {};
    ["currentPassword", "newPassword", "confirmPassword"].forEach((f) => {
      const msg = validatePasswordField(f, passwordData[f]);
      if (msg) newErrors[f] = msg;
    });

    if (Object.keys(newErrors).length) {
      setPasswordErrors(newErrors);
      return;
    }

    // In a real app, send to API to change password
    alert("Password changed successfully!");
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
  };

  return (
    <div>
      <NavBar />
      <Container>
        <div className="row mt-5">
          <div className="col-12 col-md-4 text-center mb-4 mb-md-0">
            <img
              src={user.profilePhoto}
              alt="Profile"
              className="img-fluid rounded-circle mb-3"
              style={{ width: "120px", height: "120px", maxWidth: "100%" }}
            />
            <h2 className="h4 h-md-2">{user.name}</h2>
            <div className="mb-3 d-flex align-items-center justify-content-center flex-wrap">
              <span className="me-2">{user.phone}</span>
              <button
                className="btn btn-link p-0"
                onClick={() => setShowPhoneModal(true)}
                aria-label="Edit phone number"
              >
                ✏️
              </button>
            </div>
            <div className="mb-3">
              <button
                className="btn btn-primary w-100 w-md-auto"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </div>
          <div className="col-12 col-md-8">
            <h3 className="h5 h-md-3">Families Taking Part</h3>
            <ul className="list-group mb-4">
              {user.families.map((family, index) => (
                <li key={index} className="list-group-item">
                  {family.name} - {family.relation}
                </li>
              ))}
            </ul>
            <h3 className="h5 h-md-3">Latest Orders</h3>
            <ul className="list-group">
              {user.latestOrders.map((order) => (
                <li key={order.id} className="list-group-item">
                  <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center">
                    <div className="mb-2 mb-sm-0">
                      Order #{order.id} - {order.date}
                      <span className="badge bg-primary rounded-pill ms-2">
                        {order.total}
                      </span>
                      <span
                        className={`badge ms-2 ${
                          order.status === "Delivered"
                            ? "bg-success"
                            : order.status === "Shipped"
                            ? "bg-warning"
                            : "bg-info"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <button
                      className="btn btn-outline-danger btn-sm p-1 align-self-end align-self-sm-center"
                      onClick={() => handleDeleteOrder(order.id)}
                      aria-label="Delete order"
                      style={{ fontSize: "0.8rem" }}
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="mt-2">
                    <strong>Items:</strong>
                    <ul className="list-unstyled ms-3">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} (Qty: {item.quantity}) - Pack: {item.pack}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Phone Edit Modal */}
      {showPhoneModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Phone Number</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowPhoneModal(false);
                    setNewPhone(user.phone);
                    setPhoneError("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="newPhone" className="form-label">
                    New Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="newPhone"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="01123456789"
                  />
                  {phoneError && (
                    <div className="text-danger mt-1">{phoneError}</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPhoneModal(false);
                    setNewPhone(user.phone);
                    setPhoneError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePhoneSubmit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPhoneModal && <div className="modal-backdrop show"></div>}

      {/* Password Edit Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setPasswordErrors({});
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 password-wrapper">
                  <label htmlFor="currentPassword" className="form-label">
                    Current Password
                  </label>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className="form-control"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    aria-invalid={passwordErrors.currentPassword ? "true" : "false"}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <img
                      src={showCurrentPassword ? "/imgs/eye-fill.svg" : "/imgs/eye-slash-fill.svg"}
                      alt={showCurrentPassword ? "Hide password" : "Show password"}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </span>
                  {passwordErrors.currentPassword && (
                    <div className="text-danger mt-1">
                      {passwordErrors.currentPassword}
                    </div>
                  )}
                </div>

                <div className="mb-3 password-wrapper">
                  <label htmlFor="newPassword" className="form-label">
                    New Password
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="form-control"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    aria-invalid={passwordErrors.newPassword ? "true" : "false"}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <img
                      src={showNewPassword ? "/imgs/eye-fill.svg" : "/imgs/eye-slash-fill.svg"}
                      alt={showNewPassword ? "Hide password" : "Show password"}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </span>
                  {passwordErrors.newPassword && (
                    <div className="text-danger mt-1">
                      {passwordErrors.newPassword}
                    </div>
                  )}
                </div>

                <PasswordChecklist
                  password={passwordData.newPassword}
                  confirmPassword={passwordData.confirmPassword}
                />

                <div className="mb-3 password-wrapper">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    aria-invalid={passwordErrors.confirmPassword ? "true" : "false"}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <img
                      src={showConfirmPassword ? "/imgs/eye-slash-fill.svg" : "/imgs/eye-fill.svg"}
                      alt={showConfirmPassword ? "Hide password" : "Show password"}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </span>
                  {passwordErrors.confirmPassword && (
                    <div className="text-danger mt-1">
                      {passwordErrors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                    setPasswordErrors({});
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePasswordSubmit}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPasswordModal && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default ProfilePage;
