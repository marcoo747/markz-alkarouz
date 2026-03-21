import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import PropTypes from "prop-types";
import ImageUploadModal from "./ImageUploadModal";
import AddOptionModal from "./AddOptionModal";
import TopAlert from "./TopAlert";
import ShareModal from "./shareModal";
import { useTranslation } from "react-i18next";

export default function ProductDetail({ product }) {
  const { t } = useTranslation();
  const { auth, flash, cartItems = [] } = usePage().props || {};
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.length === 1 ? product.sizes[0].size : "");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.length === 1 ? product.colors[0].color : "");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOptionModal, setShowOptionModal] = useState({ show: false, type: "" });
  const user = auth.user;

  const manager = user?.user_type === "manager";

  const [alertMessage, setAlertMessage] = useState("");
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
      if (cartItems?.includes(product.product_id)) {
          setInCart(true);
      }
  }, [cartItems, product.product_id]);

  useEffect(() => {
    if (flash?.success) {
      setAlertMessage(flash.success);
    }
  }, [flash]);

  const images =
    product?.images?.length > 0
      ? product.images
          .sort((a, b) => a.photo_id - b.photo_id)
          .map((p) => `/markaz_alkarouz/public/storage/${p.photo}`)
      : ["/markaz_alkarouz/public/imgs/shopping.webp"];

const handleAddToCart = () => {
  if (inCart) return;

  const colorObj = product.colors?.find(c => c.color === selectedColor);
  const sizeObj = product.sizes?.find(s => s.size === selectedSize);

  const hasColors = product.colors?.length > 0;
  const hasSizes = product.sizes?.length > 0;

  if ((hasColors && !selectedColor) || (hasSizes && !selectedSize)) {
    const missing = [];
    if (hasColors && !selectedColor) missing.push("color");
    if (hasSizes && !selectedSize) missing.push("size");
    setAlertMessage(`Please select ${missing.join(" and ")} before adding to cart.`);
    return;
  }

  router.post(
    route("cart.add"),
    {
      product_id: product.product_id,
      quantity,
      color_id: colorObj?.color_id || null,
      size_id: sizeObj?.size_id || null,
    },
    {
      preserveScroll: true,
      onSuccess: () => {
        setAlertMessage(`"${product.pr_name}" has been added to your cart!`);
        setInCart(true);
        setTimeout(() => setAlertMessage(""), 3000);
      },
    }
  );
};

  // Determine stock limit or default to 5 if undefined. If 0, out of stock.
  const stockLimit = product.quantity !== undefined ? product.quantity : 5;
  const isOutOfStock = stockLimit === 0;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-4 lg:p-8">
        {/* LEFT: Gallery */}
        <div className="flex flex-col gap-6">
          {manager && (
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-success btn-sm active:scale-95 transition-transform" onClick={() => setShowUploadModal(true)}>Add Photo</button>
              <button className="btn btn-success btn-sm active:scale-95 transition-transform" onClick={() => setShowOptionModal({ show: true, type: "material" })}>Add Material</button>
              <button className="btn btn-success btn-sm active:scale-95 transition-transform" onClick={() => setShowOptionModal({ show: true, type: "color" })}>Add Color</button>
              <button className="btn btn-success btn-sm active:scale-95 transition-transform" onClick={() => setShowOptionModal({ show: true, type: "size" })}>Add Size</button>
            </div>
          )}

          {showOptionModal.show && (
            <AddOptionModal
              type={showOptionModal.type}
              productId={product.product_id}
              onClose={() => setShowOptionModal({ show: false, type: "" })}
              onAdded={() => window.location.reload()}
            />
          )}

          {showUploadModal && (
            <ImageUploadModal
              product={product}
              onClose={() => setShowUploadModal(false)}
              onUploaded={() => window.location.reload()}
            />
          )}

          <div className="w-full aspect-square lg:h-[400px] xl:h-[500px] max-w-lg mx-auto rounded-2xl shadow-md overflow-hidden bg-white border border-gray-100 relative group">
            <img 
              src={images[selectedImage]} 
              alt={product?.title || product?.pr_name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                  selectedImage === idx ? "border-blue-600 shadow-md transform scale-105" : "border-gray-200 hover:border-blue-400 opacity-70 hover:opacity-100"
                }`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="flex flex-col gap-6 lg:py-4">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product?.pr_name}</h1>
            <div className="mt-1">
              <ShareModal />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex gap-1 items-baseline text-green-600">
              <span className="font-bold text-xl">EGP</span>
              <span className="text-4xl font-extrabold tracking-tight">{Math.floor(Number(product?.pr_price || 0))}</span>
              <span className="text-lg font-semibold">.{String(product?.pr_price || "0.00").split(".")[1] || "00"}</span>
            </div>
            {product?.brand && <div className="text-gray-500 uppercase tracking-widest text-xs font-bold mt-1">{product.brand}</div>}
          </div>

          <hr className="border-gray-200" />

          {product?.pr_description && (
            <div className="text-gray-600 text-base leading-relaxed">
              <p>{product.pr_description}</p>
            </div>
          )}

          {/* Variants Section */}
          <div className="flex flex-col gap-6">
            {product?.materials?.length > 0 && (
              <div className="flex flex-col gap-3">
                <strong className="text-sm font-bold text-gray-900 uppercase tracking-wide">Materials</strong>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((mat) => (
                    <button
                      key={mat.material_id}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 active:scale-95 ${
                        selectedMaterial === mat.material_name 
                          ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                      }`}
                      onClick={() => setSelectedMaterial(mat.material_name)}
                    >
                      {mat.material_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product?.colors?.length > 0 && (
              <div className="flex flex-col gap-3">
                <strong className="text-sm font-bold text-gray-900 uppercase tracking-wide">Color</strong>
                <div className="flex flex-wrap gap-3 items-center">
                  {product.colors.map((color) => (
                    <button
                      key={color.color_id}
                      className={`w-10 h-10 rounded-full transition-all duration-200 active:scale-95 focus:outline-none ${
                        selectedColor === color.color 
                          ? "ring-2 ring-offset-2 ring-gray-900 scale-110 shadow-sm" 
                          : "border border-gray-300 hover:scale-105"
                      }`}
                      onClick={() => setSelectedColor(color.color)}
                      style={{ backgroundColor: color.color }}
                      title={color.color}
                    />
                  ))}
                </div>
              </div>
            )}

            {product?.sizes?.length > 0 && (
              <div className="flex flex-col gap-3">
                <strong className="text-sm font-bold text-gray-900 uppercase tracking-wide">Size</strong>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.size_id}
                      className={`min-w-[3rem] px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 border-2 ${
                        selectedSize === size.size 
                          ? "bg-blue-600 text-white border-blue-600 shadow-md" 
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:text-gray-900"
                      }`}
                      onClick={() => setSelectedSize(size.size)}
                    >
                      {size.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr className="border-gray-200 border-dashed my-2" />

          {/* Actions Section */}
          <div className="flex flex-col gap-5">
            {user ? (
              inCart ? (
                <div className="alert alert-info text-center py-4 bg-blue-50 text-blue-800 border-blue-200 rounded-xl font-medium shadow-sm flex items-center justify-center gap-2 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Already in cart
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    {/* Stock badge */}
                    {isOutOfStock ? (
                      <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full border border-red-200">
                        Out of stock
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full border border-orange-200 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        {t('product.only_5_left', { count: stockLimit })}
                      </span>
                    )}

                    {/* Quantity Selector */}
                    {!isOutOfStock && (
                      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button 
                          className="w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 transition-colors active:scale-95 disabled:opacity-50"
                          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                          disabled={quantity <= 1}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                        </button>
                        <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                        <button 
                          className="w-10 h-10 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-200 transition-colors active:scale-95 disabled:opacity-50"
                          onClick={() => setQuantity(prev => Math.min(stockLimit, prev + 1))}
                          disabled={quantity >= stockLimit}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className={`flex items-center justify-center gap-3 text-lg font-bold py-4 rounded-xl transition-all duration-300 active:scale-95 w-full overflow-hidden relative group
                      ${isOutOfStock ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-[0_10px_25px_rgba(59,130,246,0.6)] hover:-translate-y-1"}`}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    {!isOutOfStock && <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 relative z-10 ${!isOutOfStock && "group-hover:rotate-12 transition-transform duration-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="relative z-10 uppercase tracking-widest text-sm sm:text-base">Add to Cart</span>
                  </button>
                </>
              )
            ) : null}
          </div>
        </div>
      </div>

      <TopAlert message={alertMessage} onClose={() => setAlertMessage("")} />
    </>
  );
}

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
};
