// src/components/ProductCard.js
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Hình ảnh sản phẩm */}
      <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full object-contain"
          />
        ) : (
          <span className="text-6xl">🛍️</span>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-2 mb-4">{product.description}</p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-pink-600">
            {product.price}
          </span>
          <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
