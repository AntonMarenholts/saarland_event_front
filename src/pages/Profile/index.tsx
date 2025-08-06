// src/pages/Profile/index.tsx

import { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import { fetchFavorites } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation();
  const currentUser = AuthService.getCurrentUser();
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchFavorites(currentUser.id)
        .then((data) => {
          setFavoriteEvents(data);
          setIsLoading(false);
        })
        .catch(console.error);
    }
  }, [currentUser]);

  if (isLoading) {
    return <div className="text-white">{t("loading")}</div>;
  }

  if (!currentUser) {
    return <div className="text-white">{t("auth_required")}</div>;
  }

  return (
    <div className="text-white">
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
