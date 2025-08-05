import { Link } from "react-router-dom"; // <-- Импортируем Link

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center">
        <p>© 2025 Афиша Саарланда. Все права защищены.</p>
        {/* --- НОВЫЙ КОД: Ссылка для входа администратора --- */}
        <Link to="/login" className="text-xs text-gray-600 hover:text-gray-400">
          Admin Login
        </Link>
        {/* ----------------------------------------------- */}
      </div>
    </footer>
  );
}