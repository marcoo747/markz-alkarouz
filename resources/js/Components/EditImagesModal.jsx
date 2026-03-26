import React, { useState, useRef } from "react";
import styles from "../../css/EditModal.module.css";
import deleteStyles from "../../css/DeleteModal.module.css";

const EditImagesModal = ({ initialImages, onClose, onSave }) => {
  const [images, setImages] = useState(initialImages || []);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Create object URLs for selected files to show preview
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
    
    // Clear input so same file can be selected again
    e.target.value = null;
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setConfirmDeleteIndex(null);
  };

  const handleSave = () => {
    if (onSave) onSave(images);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.editModal} style={{ maxWidth: '600px' }}>
        <div className={styles.modalHeader}>
          <h3>Manage Carousel Images</h3>
          <button className={styles.closeBtn} onClick={onClose}>
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
            {images.map((img, idx) => (
              <div key={idx} className={styles.imageWrapper}>
                <img 
                  src={img.startsWith('blob:') || img.startsWith('http') || img.startsWith('/') ? img : `/markaz_alkarouz/public/${img}`} 
                  alt={`carousel-img-${idx}`} 
                  className="w-full h-full object-cover" 
                />
                <div 
                  className={styles.imageOverlay}
                  onClick={() => setConfirmDeleteIndex(idx)}
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
              </div>
            ))}
            
            {/* Add New Button Placeholder */}
            <button 
              className="flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-slate-500 hover:text-indigo-500"
              onClick={() => fileInputRef.current.click()}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              <span className="text-sm font-semibold">Add Image</span>
            </button>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-md" onClick={handleSave}>
            Done
          </button>
        </div>
      </div>

      {/* Nested Confirm Delete Modal */}
      {confirmDeleteIndex !== null && (
        <div className={deleteStyles.modalOverlay} style={{ zIndex: 10000 }}>
          <div className={deleteStyles.redModal} style={{ maxWidth: '400px' }}>
            <div className={deleteStyles.modalHeader}>
              <h3>Delete Image</h3>
              <button className={deleteStyles.closeBtn} onClick={() => setConfirmDeleteIndex(null)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className={deleteStyles.modalBody}>
              <p className="text-lg font-medium text-slate-700">Are you sure you want to delete this image?</p>
              <p className="text-sm text-slate-500 mt-2">This image will be removed from the carousel preview.</p>
            </div>
            <div className={deleteStyles.modalFooter}>
              <button 
                className="px-5 py-2.5 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors shadow-sm"
                onClick={() => setConfirmDeleteIndex(null)}
              >
                Cancel
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md shadow-red-600/20"
                onClick={() => handleRemoveImage(confirmDeleteIndex)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditImagesModal;
