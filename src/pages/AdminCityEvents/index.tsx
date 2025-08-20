import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchAdminEventsByCityName, deleteEvent } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";
import Pagination from "../../components/Pagination";

export default function AdminCityEventsPage() {
  const { t } = useTranslation();
  const { cityName } = useParams<{ cityName: string }>();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 32;

  const loadEvents = (city: string, page: number) => {
    setIsLoading(true);
    fetchAdminEventsByCityName(city, page, pageSize)
      .then((data) => {
        setEvents(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(data.number);
      })
      .catch((err) => console.error("Failed to load city events", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (cityName) {
      loadEvents(cityName, currentPage);
    }
  }, [cityName, currentPage]);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete")) && cityName) {
      try {
        await deleteEvent(id);

        if (events.length === 1 && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        } else {
          loadEvents(cityName, currentPage);
        }
      } catch (err) {
        alert(t("errorDelete"));
        console.error(err);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Прокрутка вверх
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isAdminCard={true}
                onDelete={handleDelete}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p className="text-gray-400">{t("noEventsFound")}</p>
      )}
    </div>
  );
}
