import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Пытаемся получить токен из URL
    const token = searchParams.get('token');

    if (token) {
      // 2. Если токен есть, "логиним" пользователя, сохраняя токен
      AuthService.loginWithToken(token);
      
      // 3. Перенаправляем пользователя на его страницу профиля
      navigate('/sync-user');
      window.location.reload(); // Перезагружаем страницу, чтобы шапка обновилась
    } else {
      // Если токена нет, что-то пошло не так, возвращаем на главную
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="text-white text-center">
      Обработка входа...
    </div>
  );
}