import { useEffect, useState } from "react";
import { fetchEvents } from "../../api";
// Этот путь теперь будет работать правильно
import type { Event } from "../../types";

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEvents();
        setEvents(data);
      } catch (err) {
        setError(
          "Не удалось загрузить события. Убедитесь, что бэкенд-сервер запущен."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="text-white text-2xl text-center">Загрузка событий...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-2xl text-center">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        Ближайшие события
      </h1>
      <pre className="text-white bg-gray-700 p-4 rounded-lg">
        {JSON.stringify(events, null, 2)}
      </pre>
    </div>
  );
}
