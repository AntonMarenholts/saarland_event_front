import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchAdminEventsByCityName, deleteEvent } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";

export default function AdminCityEventsPage() {
  const { t } = useTranslation();
  const { cityName } = useParams<{ cityName: string }>();
  const location = useLocation();

  const [events, setEvents] = useState<Event[]>(
    (location.state as { events: Event[] })?.events || []
  );
  const [isLoading, setIsLoading] = useState(!location.state);

  const loadEvents = (city: string) => {
    setIsLoading(true);
    fetchAdminEventsByCityName(city)
      .then((data) => {
        data.sort((a, b) =>
          a.translations
            .find((t) => t.locale === "de")!
            .name.localeCompare(
              b.translations.find((t) => t.locale === "de")!.name
            )
        );
        setEvents(data);
      })
      .catch((err) => console.error("Failed to load city events", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!location.state && cityName) {
      loadEvents(cityName);
    }
  }, [cityName, location.state]);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete")) && cityName) {
      try {
        await deleteEvent(id);
        loadEvents(cityName);
      } catch (err) {
        alert(t("errorDelete"));
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return <div className="text-white text-center">{t("loading")}...</div>;
  }

  return (
    <div className="w-full text-white">
      <Link
        to="/admin/events-by-city"
        className="text-cyan-400 hover:underline mb-6 block"
      >
        &larr; {t("back_to_cities")}
      </Link>
      <h1 className="text-3xl font-bold mb-6">
        {t("events_in_city", { city: cityName })}
      </h1>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAdminCard={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">{t("noEventsFound")}</p>
      )}
    </div>
  );
}
