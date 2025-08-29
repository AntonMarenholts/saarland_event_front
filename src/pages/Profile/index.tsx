import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchFavorites, fetchMyEvents } from "../../api";
import type { Event } from "../../types";
import EventCard from "../../components/EventCard";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import Pagination from "../../components/Pagination";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("favorites");

  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);

  const [myEventsCurrentPage, setMyEventsCurrentPage] = useState(0);
  const [myEventsTotalPages, setMyEventsTotalPages] = useState(0);
  const myEventsPageSize = 8;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);

      const loadFavorites = fetchFavorites(user.id).then(setFavoriteEvents);
      const loadMyEvents = fetchMyEvents(
        myEventsCurrentPage,
        myEventsPageSize
      ).then((data) => {
        setMyEvents(data.content);
        setMyEventsTotalPages(data.totalPages);
      });

      Promise.all([loadFavorites, loadMyEvents])
        .catch((err) => {
          console.error(err);
          setError(t("errorLoadEvents"));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user, t, myEventsCurrentPage, myEventsPageSize]);

  if (isLoading) {
    return <div className="text-white">{t("loading")}</div>;
  }

  if (!user) {
    return <div className="text-white text-center">{t("auth_required")}</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="text-xs font-semibold px-2 py-1 bg-yellow-500 text-black rounded-full">
            {t("status_pending")}
          </span>
        );
      case "APPROVED":
        return (
          <span className="text-xs font-semibold px-2 py-1 bg-green-500 text-white rounded-full">
            {t("status_approved")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="text-xs font-semibold px-2 py-1 bg-red-500 text-white rounded-full">
            {t("status_rejected")}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-white">
      <Link to="/" className="text-cyan-400 hover:underline mb-6 block">
        &larr; {t("backToList")}
      </Link>

      <h1 className="text-3xl font-bold mb-4">
        {t("profile_title", { name: user.username })}
      </h1>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`${
              activeTab === "favorites"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t("favorites_button")}
          </button>
          <button
            onClick={() => setActiveTab("myEvents")}
            className={`${
              activeTab === "myEvents"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            {t("my_events_button")}
          </button>
        </nav>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      {/* Tab Content */}
      <div>
        {activeTab === "favorites" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("profile_subtitle")}</h2>
            {favoriteEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">
                {t("profile_no_favorites")}
              </p>
            )}
          </div>
        )}

        {activeTab === "myEvents" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("my_events_title")}</h2>
            {myEvents.length > 0 ? (
              <>
                <div className="space-y-4">
                  {myEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4"
                    >
                      <img
                        src={
                          event.imageUrl || "https://via.placeholder.com/150"
                        }
                        alt={event.translations[0].name}
                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-grow text-center sm:text-left">
                        <p className="font-bold">
                          {
                            event.translations.find((t) => t.locale === "de")
                              ?.name
                          }
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(event.eventDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {getStatusBadge(event.status)}
                      </div>
                      <div className="flex-shrink-0">
                        {event.status === "APPROVED" && !event.isPremium && (
                          <Link
                            to={`/promote/${event.id}`}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded text-sm"
                          >
                            {t("promote_event_button")}
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={myEventsCurrentPage}
                  totalPages={myEventsTotalPages}
                  onPageChange={setMyEventsCurrentPage}
                />
              </>
            ) : (
              <p className="text-gray-400 text-center">
                {t("my_events_no_events")}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
