// src/pages/login_gmail.js - Redundant file, use /login instead
import { useRouter } from "next/router"; 
import Link from "next/link";

export default function LoginGmail() {
  const router = useRouter();

  // Redirect to main login page
  React.useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🔄</div>
        <p className="text-gray-600">Đang chuyển hướng...</p>
        <Link href="/login" className="text-pink-600 hover:text-pink-700 font-medium">
          Click vào đây nếu không được chuyển hướng
        </Link>
      </div>
    </div>
  );
}