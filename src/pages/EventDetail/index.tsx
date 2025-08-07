import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // <-- 1. ИМПОРТИРУЕМ ХУК
import { fetchEventById, setReminder } from "../../api";
import type { Event } from "../../types";
import AuthService from "../../services/auth.service";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // <-- 2. ПОДКЛЮЧАЕМСЯ К СИСТЕМЕ ПЕРЕВОДОВ
  const currentUser = AuthService.getCurrentUser();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTime, setReminderTime] = useState(1);

  useEffect(() => {
    if (!id) return;
    fetchEventById(id)
      .then(setEvent)
      .catch(() => setError(t("errorLoadEvents"))) // Используем t() для перевода ошибки
      .finally(() => setIsLoading(false));
  }, [id, t]); // Добавляем t в зависимости useEffect

  const handleSetReminder = async () => {
    if (!currentUser || !event) return;
    const eventDate = new Date(event.eventDate);
    const remindAtDate = new Date(
      eventDate.getTime() - reminderTime * 60 * 60 * 1000
    );
    try {
      await setReminder(currentUser.id, event.id, remindAtDate.toISOString());
      alert(
        `${t("reminder_set_alert")} ${remindAtDate.toLocaleString(
          i18n.language
        )}`
      );
      setShowReminderModal(false);
    } catch (err) {
      alert(t("reminder_error_alert"));
      console.error(err);
    }
  };

  if (isLoading)
    return <div className="text-white text-center">{t("loading")}</div>;
  if (error || !event)
    return (
      <div className="text-red-500 text-center">
        {error || t("event_not_found")}
      </div>
    );

  // <-- 3. ДИНАМИЧЕСКИ ВЫБИРАЕМ ПЕРЕВОД СОБЫТИЯ -->
  // Ищем перевод для текущего языка, если его нет — показываем немецкий (основной)
  const translation =
    event.translations.find((tr) => tr.locale === i18n.language) ||
    event.translations.find((tr) => tr.locale === "de");

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
      >
        &larr; {t("backToList")}
      </button>

      <article className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <img
          src={event.imageUrl || "https://via.placeholder.com/800x400"}
          alt={translation?.name}
          className="w-full h-96 object-cover"
        />
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{translation?.name}</h1>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-400 mb-6 border-b border-gray-700 pb-4">
            <p>
              <strong>{t("city_label")}:</strong> {event.city.name}
            </p>
            <p>
              <strong>{t("category_label")}:</strong>
              {/* ▼▼▼ ДЕЛАЕМ КАТЕГОРИЮ ССЫЛКОЙ ▼▼▼ */}
              <Link
                to={`/category/${event.category.name}`}
                className="text-cyan-400 hover:underline ml-1"
              >
                {event.category.name}
              </Link>
            </p>
            <p>
              <strong>{t("date_label")}:</strong>{" "}
              {new Date(event.eventDate).toLocaleString(i18n.language)}
            </p>
          </div>

          {currentUser && (
            <button
              onClick={() => setShowReminderModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg mb-6"
            >
              ⏰ {t("remind_button")}
            </button>
          )}

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold">{t("description_label")}</h2>
            <p>{translation?.description}</p>
          </div>
        </div>
      </article>

      {showReminderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white">
            <h2 className="text-2xl mb-4">{t("reminder_modal_title")}</h2>
            <p className="mb-4">{t("reminder_modal_question")}</p>
            <select
              value={reminderTime}
              onChange={(e) => setReminderTime(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-700 text-white mb-6"
            >
              <option value={1}>{t("reminder_option_1h")}</option>
              <option value={3}>{t("reminder_option_3h")}</option>
              <option value={24}>{t("reminder_option_1d")}</option>
              <option value={72}>{t("reminder_option_3d")}</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
              >
                {t("cancel_button")}
              </button>
              <button
                onClick={handleSetReminder}
                className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700"
              >
                {t("set_button")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
