import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import PropTypes from "prop-types";
import ImageUploadModal from "./ImageUploadModal";
import AddOptionModal from "./AddOptionModal";
import TopAlert from "./TopAlert";

export default function ProductDetail({ product }) {
  const { auth, flash, cartItems = [] } = usePage().props || {};
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
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

  if (!selectedColor || !selectedSize) {
    setAlertMessage("Please select color and size before adding to cart.");
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
        {/* LEFT: Gallery */}
        <div className="flex flex-col gap-4">
          {manager ? (
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-success btn-sm" onClick={() => setShowUploadModal(true)}>Add Photo</button>
              <button className="btn btn-success btn-sm" onClick={() => setShowOptionModal({ show: true, type: "material" })}>Add Material</button>
              <button className="btn btn-success btn-sm" onClick={() => setShowOptionModal({ show: true, type: "color" })}>Add Color</button>
              <button className="btn btn-success btn-sm" onClick={() => setShowOptionModal({ show: true, type: "size" })}>Add Size</button>
            </div>
          ) : null}

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

          <div className="w-full">
            <img src={images[selectedImage]} alt={product?.title} className="rounded w-full object-cover" />
          </div>

          <div className="flex gap-2 flex-wrap">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`w-12 h-12 rounded border-2 overflow-hidden ${selectedImage === idx ? "border-blue-500" : "border-gray-300"}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-[#12263f]">{product?.pr_name}</h1>
          <hr className="border-gray-300" />
          <div className="flex gap-1 items-baseline">
            <span className="font-bold">EGP</span>
            <span className="text-xl font-bold">{Math.floor(Number(product?.pr_price || 0))}</span>
            <span className="text-sm">.{String(product?.price || "0.00").split(".")[1] || "00"}</span>
          </div>

          {product?.brand && <div className="text-gray-700"><h6 className="font-bold">{product.brand}</h6></div>}
          {product?.pr_description && <div className="text-gray-600"><p>{product.pr_description}</p></div>}

          <div className="flex gap-2 flex-wrap items-start">
            <strong>Materials:</strong>
            <div className="flex flex-wrap gap-2">
              {product.materials?.map((mat, idx) => (
                <span
                  key={mat.material_id}
                  className={`px-2 py-1 rounded cursor-pointer transition ${selectedMaterial === mat.material_name ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                  onClick={() => setSelectedMaterial(mat.material_name)}
                >
                  {mat.material_name}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Conditionally show Add to Cart button or "already in cart" message */}
            {user && (
              !inCart ? (
                <>
                  {/* Quantity selector */}
                  <div className="flex gap-2 items-center">
                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>
                      -
                    </button>
                    <span className="px-4 py-2 border border-gray-300 rounded text-center min-w-12">{quantity}</span>
                    <button className="btn btn-outline-secondary" onClick={() => setQuantity(prev => prev + 1)}>
                      +
                    </button>
                  </div>
                  <button className="btn btn-success w-full" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </>
              ) : (
                <div className="alert alert-info mt-2 text-center cursor-text p-3 bg-blue-100 border border-blue-400 rounded">
                  Already in cart
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT: Colors & Sizes */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="font-bold text-lg block mb-3">Discover the Colors:</span>
            <div className="flex flex-wrap gap-3">
              {product.colors?.map((color) => (
                <button
                  key={color.color_id}
                  className={`w-12 h-12 rounded-full border-4 transition ${
                    selectedColor === color.color ? "border-gray-800" : "border-gray-300"
                  }`}
                  onClick={() => setSelectedColor(color.color)}
                  style={{ backgroundColor: color.color }}
                  title={color.color}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <span className="font-bold text-lg block mb-3">Discover the Sizes:</span>
            <div className="flex flex-wrap gap-2">
              {product.sizes?.map((size) => (
                <button
                  key={size.size_id}
                  className={`px-3 py-2 rounded border-2 transition font-semibold ${
                    selectedSize === size.size ? "bg-blue-500 text-white border-blue-500" : "border-gray-300 text-gray-700"
                  }`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top modal alert */}
      <TopAlert message={alertMessage} onClose={() => setAlertMessage("")} />
    </>
  );
}

ProductDetail.propTypes = {
  product: PropTypes.object.isRequired,
};
