import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();

  // Стили для полноэкранного режима
  const pageStyle: React.CSSProperties = {
    position: 'fixed', // Фиксируем относительно окна браузера
    top: 0,
    left: 0,
    width: '100vw', // 100% ширины окна
    height: '100vh', // 100% высоты окна
    zIndex: 100, // Убедимся, что страница поверх всего остального
    backgroundImage: `url(/images/NotFoundPage.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)'
  };

  return (
    <div style={pageStyle}>
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8">
        {t('not_found_message')}
      </p>
      <Link 
        to="/" 
        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105"
      >
        {t('not_found_button')}
      </Link>
    </div>
  );
}