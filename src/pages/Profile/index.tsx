import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchFavorites } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      fetchFavorites(user.id)
        .then((data) => {
          setFavoriteEvents(data);
        })
        .catch((err) => {
          console.error(err);
          setError(t("errorLoadEvents"));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user, t]);

  if (isLoading) {
    return <div className="text-white">{t("loading")}</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!user) {
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
        {t("profile_title", { name: user.username })}
      </h1>
      <p className="text-gray-400 mb-8">{t("profile_subtitle")}</p>

      {favoriteEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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