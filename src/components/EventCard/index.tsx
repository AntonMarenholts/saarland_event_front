// src/components/EventCard/index.tsx

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Event } from "../../types";
import { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import { addFavorite, removeFavorite, fetchFavorites } from "../../api";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const currentUser = AuthService.getCurrentUser();

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Проверяем, является ли событие избранным при загрузке
    if (currentUser) {
      fetchFavorites(currentUser.id).then(favorites => {
        if (favorites.some(fav => fav.id === event.id)) {
          setIsFavorite(true);
        }
      });
    }
  }, [currentUser, event.id]);


  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Предотвращаем переход по ссылке
    e.stopPropagation(); // Останавливаем всплытие события

    if (!currentUser) {
      alert("Please log in to save favorites.");
      return;
    }

    if (isFavorite) {
      removeFavorite(currentUser.id, event.id).then(() => setIsFavorite(false));
    } else {
      addFavorite(currentUser.id, event.id).then(() => setIsFavorite(true));
    }
  };

  const translation =
    event.translations.find((t) => t.locale === currentLang) ||
    event.translations.find((t) => t.locale === "de");

  return (
    <Link
      to={`/events/${event.id}`}
      className="relative block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-transform duration-300"
    >
      {/* КНОПКА "ИЗБРАННОЕ" */}
      {currentUser && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${isFavorite ? "text-red-500" : "text-white"}`}
            fill={isFavorite ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 016.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
            />
          </svg>
        </button>
      )}

      <img
        className="w-full h-48 object-cover"
        src={event.imageUrl || "https://via.placeholder.com/400x200"}
        alt={translation?.name || "Event Image"}
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2">
          {translation?.name || "Название не указано"}
        </h3>
        <p className="text-gray-400 mb-2">{event.city.name}</p>
        <p className="text-gray-300 text-sm">
          {new Date(event.eventDate).toLocaleDateString(currentLang, {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </Link>
  );
}