import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // Вызываем нашу "имитацию" входа
    login();
    // После входа перенаправляем в админ-панель
    navigate("/admin");
  };

  return (
    <div className="text-white text-center">
      <h1 className="text-3xl font-bold mb-4">Вход для администратора</h1>
      <p className="mb-6">Эта страница предназначена только для администраторов.</p>
      <button 
        onClick={handleLogin}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded"
      >
        Войти (имитация)
      </button>
    </div>
  );
}