import React, { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";

const EditImagesModal = ({ initialImages, onClose, onSave }) => {
  const [images, setImages] = useState([]);
  const [imageData, setImageData] = useState([]); // Store full image data including IDs
  const [files, setFiles] = useState([]); // Keep track of actual File objects
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(route('carousel.photos.index'));
        if (response.ok) {
          const data = await response.json();
          setImageData(data);
          setImages(data.map(img => img.url));
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    // Create object URLs for selected files to show preview
    const newImages = selectedFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
    setFiles((prev) => [...prev, ...selectedFiles]);
    // Add placeholder data for new files (they don't have IDs yet)
    const newImageData = selectedFiles.map((file) => ({ url: URL.createObjectURL(file), id: null }));
    setImageData((prev) => [...prev, ...newImageData]);
    
    // Clear input so same file can be selected again
    e.target.value = null;
  };

  const handleRemoveImage = async (indexToRemove) => {
    const imageToRemove = images[indexToRemove];
    
    // Handle newly selected files (blob URLs)
    if (imageToRemove.startsWith('blob:')) {
      setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
      setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
      setImageData((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    } else {
      // Handle existing database images
      const imageInfo = imageData[indexToRemove];
      if (imageInfo && imageInfo.id) {
        try {
          const response = await fetch(route('carousel.photos.destroy', { id: imageInfo.id }), {
            method: 'DELETE',
            headers: {
              'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            },
          });

          if (response.ok) {
            // Remove from local state - use a function to ensure we get the latest state
            setImages((prevImages) => prevImages.filter((_, idx) => idx !== indexToRemove));
            setImageData((prevImageData) => prevImageData.filter((_, idx) => idx !== indexToRemove));
          } else {
            alert('Failed to delete image. Please try again.');
          }
        } catch (error) {
          console.error('Delete error:', error);
          alert('An error occurred while deleting the image.');
        }
      }
    }
    
    setConfirmDeleteIndex(null);
  };

  const handleSave = async () => {
    // If there are new files to upload, upload them first
    if (files.length > 0) {
      setUploading(true);

      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('photo[]', file);
        });

        const response = await fetch(route('carousel.photos.upload'), {
          method: 'POST',
          body: formData,
          headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          },
        });

        if (response.ok) {
          // Success - refresh images and close modal
          const refreshResponse = await fetch(route('carousel.photos.index'));
          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            setImageData(data);
            setImages(data.map(img => img.url));
            setFiles([]);
          }
        } else {
          // Handle error
          console.error('Upload failed');
          alert('Failed to upload images. Please try again.');
          return; // Don't close modal on error
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('An error occurred while uploading images.');
        return; // Don't close modal on error
      } finally {
        setUploading(false);
      }
    }

    // Always notify parent of current images (after uploads and/or deletions)
    if (onSave) onSave(images);
    onClose();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-5 box-border">
      <div className="w-full max-w-[600px] bg-white rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-black/5 animate-in zoom-in-95 duration-200">
        <div className="bg-white px-7 pt-6 pb-4 flex justify-between items-center shrink-0 border-b border-black/5">
          <h3 className="m-0 text-[1.35rem] font-bold text-blue-600 tracking-[-0.02em]">Manage Carousel Images</h3>
          <button className="bg-transparent border-none text-slate-400 text-[28px] leading-none cursor-pointer transition-all duration-200 p-1 flex items-center justify-center rounded-full hover:text-slate-900 hover:bg-black/5" onClick={onClose}>
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        <div className="px-7 pt-4 pb-6 overflow-y-auto max-h-[65vh] flex-1 text-slate-600 text-[0.95rem]">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-2">Loading images...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
              {images.map((img, idx) => (
                <div key={imageData[idx]?.id || `new-${idx}`} className="relative rounded-xl overflow-hidden shadow-sm border border-slate-200 aspect-square group">
                  <img 
                    src={img} 
                    alt={`carousel-img-${idx}`} 
                    className="w-full h-full object-cover" 
                  />
                  <div 
                    className={`absolute inset-0 bg-red-500/85 flex items-center justify-center cursor-pointer opacity-0 transition-opacity duration-200 ease-in-out ${uploading ? 'cursor-not-allowed' : 'group-hover:opacity-100'}`}
                    onClick={() => !uploading && setConfirmDeleteIndex(idx)}
                  >
                    <svg className="w-12 h-12 text-white drop-shadow-md scale-75 transition-transform duration-200 group-hover:scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
              ))}
              
              <button 
                className={`flex flex-col items-center justify-center gap-2 aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-slate-500 hover:text-indigo-500 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !uploading && fileInputRef.current.click()}
                disabled={uploading}
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
                disabled={uploading}
              />
            </div>
          )}
        </div>

        <div className="px-7 py-5 flex justify-end gap-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2.5 rounded-xl font-bold transition-colors shadow-md" 
            onClick={handleSave}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Done'}
          </button>
        </div>
      </div>

      {confirmDeleteIndex !== null && (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-[10000] p-5 box-border">
          <div className="w-full max-w-[400px] bg-white rounded-[20px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden border border-black/5 animate-in zoom-in-95 duration-200">
            <div className="bg-white px-7 pt-6 pb-4 flex justify-between items-center shrink-0 border-b border-black/5">
              <h3 className="m-0 text-[1.35rem] font-bold text-red-600 tracking-[-0.02em]">Delete Image</h3>
              <button className="bg-transparent border-none text-slate-400 text-[28px] leading-none cursor-pointer transition-all duration-200 p-1 flex items-center justify-center rounded-full hover:text-slate-900 hover:bg-black/5" onClick={() => setConfirmDeleteIndex(null)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-7 pt-4 pb-6 overflow-y-auto max-h-[65vh] flex-1 text-slate-600 text-[0.95rem]">
              <p className="text-lg font-medium text-slate-700">Are you sure you want to delete this image?</p>
              <p className="text-sm text-slate-500 mt-2">This will permanently remove the image from the carousel.</p>
            </div>
            <div className="px-7 py-5 flex justify-end gap-3 bg-slate-50 border-t border-slate-200 shrink-0">
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
