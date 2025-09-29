export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-pink-500 text-white p-4">
        <h1 className="text-xl font-bold">Shop Mỹ Phẩm</h1>
      </header>

      <main className="flex-1 container mx-auto p-4">{children}</main>

      <footer className="bg-gray-200 text-center p-4">
        © 2025 MyShop
      </footer>
    </div>
  );
}
