import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold hover:text-cyan-400">
          Афиша Саарланда
        </NavLink>
        <div className="flex gap-4">
          <NavLink to="/" className="hover:text-cyan-400">
            Главная
          </NavLink>
          <NavLink to="/admin" className="hover:text-cyan-400">
            Админ-панель
          </NavLink>
        </div>
      </nav>
    </header>
  );
}