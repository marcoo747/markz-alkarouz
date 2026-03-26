import React, { useState } from "react";
import { router } from "@inertiajs/react";

const EditCategoryModal = ({ category, onClose }) => {
    const [name, setName] = useState(category.category_name || "");
    const [description, setDescription] = useState(
        category.category_description || ""
    );
    const [photo, setPhoto] = useState(null);
    const [fileName, setFileName] = useState("");
    const [processing, setProcessing] = useState(false);

    const handleConfirm = () => {
        const formData = new FormData();
        formData.append("category_name", name);
        formData.append("category_description", description);
        if (photo) formData.append("category_photo", photo);

        // Spoof PUT over POST (important for FormData)
        formData.append("_method", "put");

        setProcessing(true);
        router.post(route("categories.update", category.category_id), formData, {
            forceFormData: true,
            onSuccess: () => {
                setProcessing(false);
                onClose();
            },
            onError: () => setProcessing(false),
        });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-5 box-border">
            <div className="w-full max-w-[480px] bg-white rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-black/5 animate-in zoom-in-95 duration-200">
                <div className="bg-white px-7 pt-6 pb-4 flex justify-between items-center shrink-0 border-b border-black/5">
                    <h3 className="m-0 text-[1.35rem] font-bold text-blue-600 tracking-[-0.02em]">Edit Category</h3>
                    <button className="bg-transparent border-none text-slate-400 text-[28px] leading-none cursor-pointer transition-all duration-200 p-1 flex items-center justify-center rounded-full hover:text-slate-900 hover:bg-black/5 w-8 h-8" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="px-7 pt-4 pb-6 overflow-y-auto max-h-[65vh] flex-1 text-slate-600 text-[0.95rem]">
                    <label className="font-semibold text-[0.9rem] text-slate-700 block mt-0">Category Name</label>
                    <input
                        className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label className="font-semibold mt-[18px] text-[0.9rem] text-slate-700 block">Category Description</label>
                    <textarea
                        className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 text-[0.95rem] text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/15"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="mt-[18px] flex items-center gap-3">
                        <label className="bg-blue-600/10 text-blue-600 px-[18px] py-2.5 rounded-xl cursor-pointer font-semibold border border-blue-600/20 transition-all duration-200 inline-flex items-center justify-center hover:bg-blue-600 hover:text-white">
                            Upload Photo
                            <input
                                type="file"
                                hidden
                                onChange={(e) => {
                                    setPhoto(e.target.files[0]);
                                    setFileName(e.target.files[0].name);
                                }}
                            />
                        </label>
                        {fileName && (
                            <span className="text-[0.9rem] text-slate-500 font-medium">{fileName}</span>
                        )}
                    </div>
                </div>

                <div className="px-7 py-5 flex justify-end gap-3 bg-slate-50 border-t border-slate-200 shrink-0">
                    <button
                        className="px-5 py-2.5 rounded-xl font-bold transition-all duration-200 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleConfirm}
                        disabled={processing}
                    >
                        {processing ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                        className="px-5 py-2.5 rounded-xl font-bold transition-all duration-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCategoryModal;
