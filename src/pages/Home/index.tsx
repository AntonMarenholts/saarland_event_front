import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchEvents } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";
import Pagination from "../../components/Pagination";

export default function HomePage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [totalPages, setTotalPages] = useState(0);
  const currentPage = Number(searchParams.get("page")) || 0;
  const pageSize = 32;

  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams(searchParams);
        params.set("page", currentPage.toString());
        params.set("size", pageSize.toString());

        const data = await fetchEvents(params);
        setEvents(data.content);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(t("errorLoadEvents"));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, [searchParams, t, currentPage]);

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

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
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        {t("upcomingEvents")}
      </h1>
      {events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-gray-400 text-center text-xl mt-10">
          {t("noEventsFound")}
        </p>
      )}
    </div>
  );
}
