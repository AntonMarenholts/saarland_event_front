import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { fetchFavorites } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ▼▼▼ 1. ОБЪЯВЛЯЕМ СОСТОЯНИЕ ДЛЯ ОШИБКИ ▼▼▼
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      fetchFavorites(currentUser.id)
        .then((data) => {
          setFavoriteEvents(data);
        })
        .catch((err) => {
          console.error(err);
          // ▼▼▼ 2. СОХРАНЯЕМ ОШИБКУ В СОСТОЯНИЕ ▼▼▼
          setError(t("errorLoadEvents"));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [currentUser?.id, t]);

  if (isLoading) {
    return <div className="text-white">{t("loading")}</div>;
  }

  // ▼▼▼ 3. ДОБАВЛЯЕМ БЛОК ДЛЯ ОТОБРАЖЕНИЯ ОШИБКИ ▼▼▼
  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!currentUser) {
    return <div className="text-white text-center">{t("auth_required")}</div>;
  }

  return (
    <div className="text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
      >
        &larr; {t("backToList")}
      </button>

      <h1 className="text-3xl font-bold mb-4">
        {t("profile_title", { name: currentUser.username })}
      </h1>
      <p className="text-gray-400 mb-8">{t("profile_subtitle")}</p>

      {favoriteEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">{t("profile_no_favorites")}</p>
      )}
    </div>
  );
}
