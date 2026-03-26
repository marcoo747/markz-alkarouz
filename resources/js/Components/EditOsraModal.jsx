import React from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";

const EditOsraModal = ({ osra, onClose }) => {
  const { data, setData, put, errors } = useForm({
    osra_name: osra.osra_name,
    osra_code: osra.osra_code,
    osra_place: osra.osra_place,
    osra_time: osra.osra_time,
  });

  const handleConfirm = () => {
    put(route("osra.update", osra.osra_id), {
      onSuccess: () => { onClose(); window.location.reload(); }
    });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-5 box-border">
      <div className="w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-black/5 animate-in zoom-in-95 duration-200">
        <div className="bg-white px-7 pt-6 pb-4 flex justify-between items-center shrink-0 border-b border-black/5">
          <h3 className="m-0 text-[1.35rem] font-bold text-blue-600 tracking-[-0.02em]">Edit Family</h3>
          <button className="bg-transparent border-none text-slate-400 text-[28px] leading-none cursor-pointer transition-all duration-200 p-1 flex items-center justify-center rounded-full hover:text-slate-900 hover:bg-black/5 w-8 h-8" onClick={onClose}>×</button>
        </div>

        <div className="px-7 pt-4 pb-6 overflow-y-auto max-h-[65vh] flex-1 text-slate-600 text-[0.95rem]">
          <label className="font-semibold text-[0.9rem] text-slate-700 block mt-0">Name</label>
          <input className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15" value={data.osra_name} onChange={(e) => setData("osra_name", e.target.value)} />
          {errors.osra_name && <p className="text-red-500 text-sm mt-1">{errors.osra_name}</p>}

          <label className="font-semibold mt-[18px] text-[0.9rem] text-slate-700 block">Code</label>
          <input className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15" value={data.osra_code} onChange={(e) => setData("osra_code", e.target.value)} />
          {errors.osra_code && <p className="text-red-500 text-sm mt-1">{errors.osra_code}</p>}

          <label className="font-semibold mt-[18px] text-[0.9rem] text-slate-700 block">Place</label>
          <input className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15" value={data.osra_place} onChange={(e) => setData("osra_place", e.target.value)} />
          {errors.osra_place && <p className="text-red-500 text-sm mt-1">{errors.osra_place}</p>}

          <label className="font-semibold mt-[18px] text-[0.9rem] text-slate-700 block">Time</label>
          <input className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15" value={data.osra_time} onChange={(e) => setData("osra_time", e.target.value)} />
          {errors.osra_time && <p className="text-red-500 text-sm mt-1">{errors.osra_time}</p>}
        </div>

        <div className="px-7 py-5 flex justify-end gap-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <button className="px-5 py-2.5 rounded-xl font-bold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700" onClick={handleConfirm}>Save Changes</button>
          <button className="px-5 py-2.5 rounded-xl font-bold transition-all duration-200 bg-slate-100 text-slate-600 hover:bg-slate-200" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditOsraModal;
