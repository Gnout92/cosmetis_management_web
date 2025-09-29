// src/components/Sidebar.js
import React from "react";

const Sidebar = ({ categories, onSelectCategory }) => {
  return (
    <aside className="w-64 bg-white shadow-md rounded-xl p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Danh Mục</h2>
      <ul className="space-y-2">
        {categories.map((category, index) => (
          <li
            key={index}
            onClick={() => onSelectCategory(category.name)}
            className="flex items-center p-2 rounded-lg hover:bg-pink-50 cursor-pointer transition-colors"
          >
            <div className="text-lg mr-3">{category.icon}</div>
            <span className="text-gray-700 font-medium">{category.name}</span>
            <span className="ml-auto text-gray-400 text-sm">{category.count}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
