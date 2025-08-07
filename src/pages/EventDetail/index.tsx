import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, setReminder } from "../../api"; // Импортируем setReminder
import type { Event } from "../../types";
import AuthService from "../../services/auth.service"; // Импортируем AuthService

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser(); // Получаем текущего пользователя

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояния для модального окна напоминаний
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTime, setReminderTime] = useState(1); // Время в часах до события

  useEffect(() => {
    if (!id) return;
    fetchEventById(id)
      .then(setEvent)
      .catch(() => setError("Не удалось загрузить событие."))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSetReminder = async () => {
    if (!currentUser || !event) return;

    const eventDate = new Date(event.eventDate);
    // Вычитаем выбранное количество часов из даты события
    const remindAtDate = new Date(eventDate.getTime() - reminderTime * 60 * 60 * 1000);

    try {
      await setReminder(currentUser.id, event.id, remindAtDate.toISOString());
      alert(`Напоминание установлено на ${remindAtDate.toLocaleString('ru-RU')}`);
      setShowReminderModal(false);
    } catch (err) {
      alert("Не удалось установить напоминание.");
      console.error(err);
    }
  };

  if (isLoading) return <div className="text-white text-center">Загрузка...</div>;
  if (error || !event) return <div className="text-red-500 text-center">{error || 'Событие не найдено.'}</div>;
  
  const translation = event.translations.find(t => t.locale === 'de');

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">
        &larr; Назад к списку
      </button>

      <article className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <img src={event.imageUrl || 'https://via.placeholder.com/800x400'} alt={translation?.name} className="w-full h-96 object-cover"/>
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{translation?.name}</h1>
          
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-400 mb-6 border-b border-gray-700 pb-4">
            <p><strong>Город:</strong> {event.city.name}</p>
            <p><strong>Категория:</strong> {event.category.name}</p>
            <p><strong>Дата:</strong> {new Date(event.eventDate).toLocaleString('de-DE')}</p>
          </div>

          {/* Кнопка "Напомнить", которая появляется только для авторизованных пользователей */}
          {currentUser && (
            <button 
              onClick={() => setShowReminderModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg mb-6"
            >
              ⏰ Напомнить о событии
            </button>
          )}

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold">Описание</h2>
            <p>{translation?.description}</p>
          </div>
        </div>
      </article>

      {/* Модальное окно для установки напоминания */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white">
            <h2 className="text-2xl mb-4">Установить напоминание</h2>
            <p className="mb-4">За сколько времени до начала события вам напомнить?</p>
            <select 
              value={reminderTime}
              onChange={(e) => setReminderTime(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 text-white mb-6"
            >
              <option value={1}>За 1 час</option>
              <option value={3}>За 3 часа</option>
              <option value={24}>За 1 день (24 часа)</option>
              <option value={72}>За 3 дня (72 часа)</option>
            </select>
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowReminderModal(false)} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Отмена</button>
              <button onClick={handleSetReminder} className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700">Установить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}