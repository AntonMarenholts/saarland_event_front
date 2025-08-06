import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/admin");
  };

  return (
    <div className="text-white text-center">
      <h1 className="text-3xl font-bold mb-4">{t('loginTitle')}</h1>
      <p className="mb-6">{t('loginSubtitle')}</p>
      <button 
        onClick={handleLogin}
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded"
      >
        {t('loginButton')}
      </button>
    </div>
  );
}