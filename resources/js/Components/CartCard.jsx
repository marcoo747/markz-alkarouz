import React from "react";
import { router } from "@inertiajs/react";
import namer from "color-namer";
import { useTranslation } from "react-i18next";

const ProductCard = ({
  id,
  title,
  brand,
  description,
  image,
  onRemove,
  color,
  size,
  quantity
}) => {
  const { t } = useTranslation();

  const handleOpen = () => {
    router.get(route("items.show", id));
  };

  return (
    <article
      className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-100 flex flex-col overflow-hidden"
    >
      {image && !image.includes('shopping.webp') ? (
        <img
          src={image.startsWith('http') || image.startsWith('/') ? image : `/${image}`}
          alt={title}
          loading="lazy"
          onClick={handleOpen}
          className="rounded w-full h-48 object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div 
          className="w-full h-[220px] bg-slate-50 flex flex-col items-center justify-center text-slate-300 border-b border-slate-100 cursor-pointer overflow-hidden group-hover:bg-slate-100 transition-colors"
          onClick={handleOpen}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">No Image</span>
        </div>
      )}

      <div className="p-5 flex flex-col flex-1">
        <div onClick={handleOpen} className="cursor-pointer mb-4">
          <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{title}</h3>
          <h6 className="text-sm font-semibold text-indigo-500 uppercase tracking-wide mb-3">{brand}</h6>
          <p className="text-2xl font-extrabold text-slate-900">{description}</p>
        </div>
        
        <div className="mt-auto space-y-2 mb-4">

          {/* Show Color */}
          {color && (
            <p className="d-flex align-items-center mb-1">
              <span
                style={{
                  display: "inline-block",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: color.color,
                  marginRight: 8,
                  border: "1px solid #ccc",
                }}
              ></span>
              <span>{namer(color).basic[0].name}</span>
            </p>
          )}

          {/* Show Size */}
          {size && <p className="text-sm text-slate-500 flex items-center justify-between">{t("cart.size")} <strong className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">{size.size}</strong></p>}

          {/* Show Quantity */}
          {quantity !== undefined && (
            <p className="text-sm text-slate-500 flex items-center justify-between">
              {t("cart.quantity")} <span className="bg-[#10b981]/10 text-[#10b981] font-bold px-2 py-0.5 rounded-md">{quantity}</span>
            </p>
          )}
        </div>

        <button
          className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          {t('cart.remove')}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
