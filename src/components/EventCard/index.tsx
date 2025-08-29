import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Event } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { addFavorite, removeFavorite } from "../../api";

interface Props {
  event: Event;
  isAdminCard?: boolean;
  onDelete?: (id: number) => void;
}

export default function EventCard({
  event,
  isAdminCard = false,
  onDelete,
}: Props) {
  const { i18n, t } = useTranslation();
  const { user, favoriteEventIds, addFavorite: addFavoriteToContext, removeFavorite: removeFavoriteFromContext } = useAuth();

  const isFavorite = favoriteEventIds.has(event.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    try {
      if (isFavorite) {
        await removeFavorite(user.id, event.id);
        removeFavoriteFromContext(event.id);
      } else {
        await addFavorite(user.id, event.id);
        addFavoriteToContext(event.id);
      }
    } catch (error) {
      console.error("Failed to update favorite status", error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(event.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const timeIsSpecified =
      date.getUTCHours() !== 0 || date.getUTCMinutes() !== 0;

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (timeIsSpecified) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }

    return date.toLocaleDateString(i18n.language, options);
  };

  const translation =
    event.translations.find((t) => t.locale === i18n.language) ||
    event.translations.find((t) => t.locale === "de");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 bg-yellow-500 text-black rounded-full z-10">
            {t("status_pending")}
          </span>
        );
      case "APPROVED":
        return (
          <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 bg-green-500 text-white rounded-full z-10">
            {t("status_approved")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 bg-red-500 text-white rounded-full z-10">
            {t("status_rejected")}
          </span>
        );
      default:
        return null;
    }
  };

  const cardContent = (
    <>
      {isAdminCard && getStatusBadge(event.status)}
      
      {event.isPremium && !isAdminCard && (
        <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-400 text-black">
              ⭐ {t('premium_badge')}
            </span>
        </div>
      )}

      {user && !isAdminCard && (
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
        className="w-full h-48 object-cover bg-gray-700"
        src={event.imageUrl || "https://via.placeholder.com/400x200"}
        alt={translation?.name || "Event Image"}
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-2 truncate">
          {translation?.name || "Name not specified"}
        </h3>
        <p className="text-gray-400 mb-2">{event.city.name}</p>
        <p className="text-gray-300 text-sm">{formatDate(event.eventDate)}</p>
      </div>
      {isAdminCard && (
        <div className="border-t border-gray-700 p-2 flex justify-end gap-2">
          <Link
            to={`/admin/edit/${event.id}`}
            className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold px-3 py-1 rounded hover:bg-gray-700"
          >
            {t("edit")}
          </Link>
          <button
            onClick={handleDeleteClick}
            className="text-red-500 hover:text-red-400 text-sm font-semibold px-3 py-1 rounded hover:bg-gray-700"
          >
            {t("delete")}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="relative block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
      {isAdminCard ? (
        cardContent
      ) : (
        <Link to={`/events/${event.id}`} className="block">
          {cardContent}
        </Link>
      )}
    </div>
  );
}
