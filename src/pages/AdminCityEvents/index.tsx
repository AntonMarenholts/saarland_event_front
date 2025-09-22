
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchAdminEventsByCityNamePast, fetchAdminEventsByCityNameUpcoming, deleteEvent } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";
import Pagination from "../../components/Pagination";

export default function AdminCityEventsPage() {
  const { t } = useTranslation();
  const { cityName } = useParams<{ cityName: string }>();

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(0);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(0);
  const [pastCurrentPage, setPastCurrentPage] = useState(0);
  const [pastTotalPages, setPastTotalPages] = useState(0);
  const pageSize = 32;

  const loadEvents = (city: string, page: number, type: 'upcoming' | 'past') => {
    setIsLoading(true);
    const fetcher = type === 'upcoming' ? fetchAdminEventsByCityNameUpcoming : fetchAdminEventsByCityNamePast;
    fetcher(city, page, pageSize)
      .then((data) => {
        if (type === 'upcoming') {
          setUpcomingEvents(data.content);
          setUpcomingTotalPages(data.totalPages);
          setUpcomingCurrentPage(data.number);
        } else {
          setPastEvents(data.content);
          setPastTotalPages(data.totalPages);
          setPastCurrentPage(data.number);
        }
      })
      .catch((err) => console.error("Failed to load city events", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (cityName) {
      loadEvents(cityName, activeTab === 'upcoming' ? upcomingCurrentPage : pastCurrentPage, activeTab);
    }
  }, [cityName, upcomingCurrentPage, pastCurrentPage, activeTab]);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete")) && cityName) {
      try {
        await deleteEvent(id);
        loadEvents(cityName, activeTab === 'upcoming' ? upcomingCurrentPage : pastCurrentPage, activeTab);
      } catch (err) {
        alert(t("errorDelete"));
        console.error(err);
      }
    }
  };

  const handlePageChange = (page: number) => {
    if (activeTab === 'upcoming') {
      setUpcomingCurrentPage(page);
    } else {
      setPastCurrentPage(page);
    }
    window.scrollTo(0, 0);
  };
  
  const events = activeTab === 'upcoming' ? upcomingEvents : pastEvents;
  const currentPage = activeTab === 'upcoming' ? upcomingCurrentPage : pastCurrentPage;
  const totalPages = activeTab === 'upcoming' ? upcomingTotalPages : pastTotalPages;

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

      <div className="border-b border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`${
              activeTab === "upcoming"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t("upcomingEvents")}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`${
              activeTab === "past"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t("past_events")}
          </button>
        </nav>
      </div>
      
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