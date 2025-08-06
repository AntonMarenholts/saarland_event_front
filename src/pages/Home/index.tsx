import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- 1. Импортируем хук
import { fetchEvents } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";

export default function HomePage() {
  const { t } = useTranslation(); // <-- 2. Получаем функцию для перевода
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEvents(searchParams); 
        setEvents(data);
      } catch (err) {
        // 3. Переводим сообщение об ошибке
        setError(t('errorLoadEvents'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, [searchParams, t]); // <-- Добавляем t в зависимости

  if (isLoading) {
    // 4. Переводим сообщение о загрузке
    return <div className="text-white text-2xl text-center">{t('loadingEvents')}</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-2xl text-center">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        {/* 5. Переводим заголовок */}
        {t('upcomingEvents')}
      </h1>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        // 6. Переводим сообщение об отсутствии событий
        <p className="text-gray-400 text-center text-xl mt-10">{t('noEventsFound')}</p>
      )}
    </div>
  );
}