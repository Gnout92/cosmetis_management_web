// src/components/LoginForm.js
import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng nhập với:", { email, password });
    // TODO: gọi API đăng nhập ở đây
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">🛍️</span>
          <h1 className="text-2xl font-bold text-pink-600">Beauty Shop</h1>
          <p className="text-gray-500 mt-2">Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-pink-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors"
          >
            Đăng nhập
          </button>
        </form>

        {/* Extra links */}
        <div className="mt-6 flex justify-between text-sm text-gray-600">
          <a href="/forgot-password" className="hover:text-pink-500">Quên mật khẩu?</a>
          <a href="/register" className="hover:text-pink-500">Đăng ký</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
