import React from "react";

const EditUserModal = ({ editData, editErrors, onChange, onSubmit, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-5 box-border">
      <div className="w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-black/5 animate-in zoom-in-95 duration-200">
        <div className="bg-white px-7 pt-6 pb-4 flex justify-between items-center shrink-0 border-b border-black/5">
          <h3 className="m-0 text-[1.35rem] font-bold text-blue-600 tracking-[-0.02em]">Edit User</h3>
          <button className="bg-transparent border-none text-slate-400 text-[28px] leading-none cursor-pointer transition-all duration-200 p-1 flex items-center justify-center rounded-full hover:text-slate-900 hover:bg-black/5 w-8 h-8" onClick={onClose}>×</button>
        </div>

        <div className="px-7 pt-4 pb-6 overflow-y-auto max-h-[65vh] flex-1 text-slate-600 text-[0.95rem]">
          {/* Name */}
          <label className="font-semibold text-[0.9rem] text-slate-700 block mt-0">Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={`w-full mt-2 px-4 py-3 rounded-xl border bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:bg-white focus:ring-4 ${editErrors.full_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'}`}
          />
          {editErrors.full_name && <div className="text-red-500 text-sm mt-1">{editErrors.full_name}</div>}

          {/* Email */}
          <label className="font-semibold mt-[18px] text-[0.9rem] text-slate-700 block">Email</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => onChange("email", e.target.value)}
            className={`w-full mt-2 px-4 py-3 rounded-xl border bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:bg-white focus:ring-4 ${editErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'}`}
          />
          {editErrors.email && <div className="text-red-500 text-sm mt-1">{editErrors.email}</div>}

          {/* Phone */}
          <label className="font-semibold mt-[18px] text-[0.9rem] text-slate-700 block">Phone</label>
          <input
            type="tel"
            value={editData.phone}
            maxLength={11}
            onChange={(e) => onChange("phone", e.target.value)}
            className={`w-full mt-2 px-4 py-3 rounded-xl border bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:bg-white focus:ring-4 ${editErrors.mobile ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'}`}
          />
          {editErrors.mobile && <div className="text-red-500 text-sm mt-1">{editErrors.mobile}</div>}

          {/* Role */}
          <label className="font-semibold mt-[18px] text-[0.9rem] text-slate-700 block">Role</label>
          <select
            value={editData.user_type}
            onChange={(e) => onChange("user_type", e.target.value)}
            className={`w-full mt-2 px-4 py-3 rounded-xl border bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:bg-white focus:ring-4 ${editErrors.user_type ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'}`}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
          {editErrors.user_type && <div className="text-red-500 text-sm mt-1">{editErrors.user_type}</div>}

          {/* Family Code */}
          <label className="font-semibold mt-[18px] text-[0.9rem] text-slate-700 block">Family Code</label>
          <input
            type="text"
            value={editData.osra_code || ""}
            onChange={(e) => onChange("osra_code", e.target.value)}
            className={`w-full mt-2 px-4 py-3 rounded-xl border bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:bg-white focus:ring-4 ${editErrors.osra_code ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-blue-600 focus:ring-blue-600/15'}`}
          />
          {editErrors.osra_code && <div className="text-red-500 text-sm mt-1">{editErrors.osra_code}</div>}

          {/* Profile Photo */}
          <div className="mt-[18px] flex items-center gap-3">
            <label className="bg-blue-600/10 text-blue-600 px-[18px] py-2.5 rounded-xl cursor-pointer font-semibold border border-blue-600/20 transition-all duration-200 inline-flex items-center justify-center hover:bg-blue-600 hover:text-white">
              Upload Photo
              <input
                type="file"
                hidden
                onChange={(e) => onChange("profilePhoto", e.target.files[0])}
              />
            </label>
            {editData.profilePhoto && <span className="text-[0.9rem] text-slate-500 font-medium">{editData.profilePhoto.name}</span>}
          </div>
          {editData.profilePhoto && (
            <img
              src={URL.createObjectURL(editData.profilePhoto)}
              className="rounded-xl mt-3 object-cover shadow-sm border border-slate-200"
              width="80"
              height="80"
              style={{ aspectRatio: '1/1' }}
              alt="Profile preview"
            />
          )}
        </div>

        <div className="px-7 py-5 flex justify-end gap-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <button className="px-5 py-2.5 rounded-xl font-bold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700" onClick={onSubmit}>Save Changes</button>
          <button className="px-5 py-2.5 rounded-xl font-bold transition-all duration-200 bg-slate-100 text-slate-600 hover:bg-slate-200" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;