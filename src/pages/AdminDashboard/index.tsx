import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents, deleteEvent } from "../../api"; // <-- Импортируем API
import type { Event } from "../../types"; // <-- Импортируем тип

export default function AdminDashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Функция для загрузки всех событий (включая прошедшие, для админа это важно)
  const loadEvents = async () => {
    try {
      // Примечание: fetchEvents пока не умеет загружать ВСЕ события,
      // но мы это исправим на бэкенде позже. Пока что он загрузит будущие.
      const data = await fetchEvents(new URLSearchParams());
      setEvents(data);
    } catch (err) {
      setError("Не удалось загрузить события.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Загружаем события при первом рендере страницы
  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить это событие?")) {
      try {
        await deleteEvent(id);
        // После успешного удаления перезагружаем список событий
        loadEvents();
      } catch (err) {
        alert("Не удалось удалить событие.");
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return <div className="text-white text-2xl text-center">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-2xl text-center">{error}</div>;
  }

  return (
    <div className="w-full text-white">
      <h1 className="text-3xl font-bold mb-6">Панель Администратора</h1>
      
      {/* TODO: Здесь будет форма для добавления нового события */}
      <div className="mb-8 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold">Добавить новое событие (скоро)</h2>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Все события</h2>
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Название (DE)</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Город</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Дата</th>
              <th className="relative px-6 py-3"><span className="sr-only">Действия</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">{event.translations.find(t => t.locale === 'de')?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{event.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(event.eventDate).toLocaleDateString('de-DE')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/admin/edit/${event.id}`} className="text-indigo-400 hover:text-indigo-300 mr-4">
                    Редактировать
                  </Link>
                  <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-400">
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}