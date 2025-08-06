import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Event } from "../../types";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const translation = event.translations.find((t) => t.locale === currentLang) || 
                      event.translations.find((t) => t.locale === "de");

  return (
    <Link
      to={`/events/${event.id}`}
      className="block bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-transform duration-300"
    >
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