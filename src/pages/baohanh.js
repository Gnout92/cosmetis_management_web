// src/pages/warehouse.js
import MainLayout from "../layouts/MainLayout";
import { useState } from "react";

const initialProducts = [
  { id: 1, name: "Sữa Rửa Mặt CeraVe", stock: 50 },
  { id: 2, name: "Kem Chống Nắng La Roche-Posay", stock: 30 },
  { id: 3, name: "Serum Vitamin C The Ordinary", stock: 20 },
  { id: 4, name: "Mặt Nạ Innisfree Green Tea", stock: 60 },
];

export default function Warehouse() {
  const [products, setProducts] = useState(initialProducts);

  const increaseStock = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: p.stock + 1 } : p))
    );
  };

  const decreaseStock = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id && p.stock > 0 ? { ...p, stock: p.stock - 1 } : p))
    );
  };

  return (
    <MainLayout>
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          🏬 Quản Lý Kho
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6 flex flex-col items-center"
            >
              <h2 className="text-lg font-semibold mb-4">{product.name}</h2>
              <p className="text-gray-700 mb-4">Số lượng: {product.stock}</p>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => decreaseStock(product.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  disabled={product.stock === 0}
                >
                  -
                </button>
                <button
                  onClick={() => increaseStock(product.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
