// src/pages/CategoryPage/index.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchEvents } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";
import Pagination from "../../components/Pagination";

export default function CategoryPage() {
  const { t } = useTranslation();
  const { categoryName } = useParams<{ categoryName: string }>();

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);
  const currentPage = Number(searchParams.get("page")) || 0;
  const pageSize = 32;

  useEffect(() => {
    if (!categoryName) return;

    const getEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams(searchParams);
        params.append("categoryName", categoryName);
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
  }, [categoryName, t, searchParams, currentPage]);

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
      <Link to="/" className="text-cyan-400 hover:underline mb-6 block">
        &larr; {t("backToList")}
      </Link>
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        {t("upcomingEvents")} в категории: {categoryName}
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
