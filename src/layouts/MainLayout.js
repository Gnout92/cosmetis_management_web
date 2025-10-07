export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col h-screen min-h-screen w-screen">
      <main className="flex-1 w-full h-full p-0 m-0">{children}</main>
      <footer className="bg-gray-200 text-center p-4">
        © {new Date().getFullYear()} MyShop
      </footer>
    </div>
  );
}