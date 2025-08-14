import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchEvents } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";

export default function CityPage() {
  const { t } = useTranslation();
  const { cityName } = useParams<{ cityName: string }>();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityName) return;

    const getEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append("city", cityName);

        const data = await fetchEvents(params);
        setEvents(data);
      } catch (err) {
        setError(t("errorLoadEvents"));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, [cityName, t]);

  if (isLoading) {
    return (
      <div className="text-white text-2xl text-center">
        {t("loadingEvents")}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-2xl text-center">{error}</div>;
  }

  return (
    <div>
      <Link to="/" className="text-cyan-400 hover:underline mb-6 block">
        &larr; {t("backToList")}
      </Link>
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        {t("upcomingEvents")} в городе: {cityName}
      </h1>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center text-xl mt-10">
          {t("noEventsFound")}
        </p>
      )}
    </div>
  );
}