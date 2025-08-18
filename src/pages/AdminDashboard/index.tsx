import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isAxiosError } from "axios";
import {
  fetchAllEventsForAdmin,
  deleteEvent,
  createEvent,
  updateEventStatus,
  fetchAdminStats,
} from "../../api";
import type { CreateEventData, Event, AdminStats } from "../../types";
import EventForm from "../../components/EventForm";

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const loadAllData = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const [eventsData, statsData] = await Promise.all([
        fetchAllEventsForAdmin(),
        fetchAdminStats(),
      ]);

      setEvents(eventsData);
      setStats(statsData);
    } catch (err) {
      setError("Failed to load data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm(t("confirmDelete"))) {
      try {
        await deleteEvent(id);
        await loadAllData();
      } catch (err) {
        alert(t("errorDelete"));
        console.error(err);
      }
    }
  };

  const handleCreateEvent = async (eventData: CreateEventData) => {
    setIsSubmitting(true);
    try {
      await createEvent(eventData);
      await loadAllData();
      setFormKey((prevKey) => prevKey + 1);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert(t("errorCreate"));
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (
    id: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      await updateEventStatus(id, status);
      await loadAllData();
    } catch (err) {
      alert("Failed to update status.");
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-2 py-1 text-xs font-semibold leading-5 text-yellow-800 bg-yellow-100 rounded-full">
            {t("status_pending")}
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-2 py-1 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
            {t("status_approved")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2 py-1 text-xs font-semibold leading-5 text-red-800 bg-red-100 rounded-full">
            {t("status_rejected")}
          </span>
        );
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="text-white text-2xl text-center">{t("loading")}</div>
    );
  }

  return (
    <div className="w-full text-white">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">{t("adminPanelTitle")}</h1>
        <div className="flex gap-2 flex-wrap">
          <Link
            to="/admin/events-by-city"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
          >
            {t("archive_by_city")}
          </Link>
          <Link
            to="/admin/categories"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
          >
            {t("manageCategories")}
          </Link>
          <Link
            to="/admin/cities"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
          >
            {t("manageCities")}
          </Link>
          <Link
            to="/admin/users"
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
          >
            {t("manage_users")}
          </Link>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            title={t("stats_total_events")}
            value={stats.totalEvents}
            icon="📅"
          />
          <StatCard
            title={t("stats_pending")}
            value={stats.pendingEvents}
            icon="⏳"
          />
          <StatCard
            title={t("stats_approved")}
            value={stats.approvedEvents}
            icon="✅"
          />
          <StatCard
            title={t("stats_users")}
            value={stats.totalUsers}
            icon="👥"
          />
          <StatCard
            title={t("stats_categories")}
            value={stats.totalCategories}
            icon="🏷️"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-900 border border-red-500 text-red-200 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      <EventForm
        key={formKey}
        onSubmit={handleCreateEvent}
        isLoading={isSubmitting}
      />

      <div className="bg-gray-800 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-4">{t("status_pending")}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t("formTitleDE")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t("formCity")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t("status_label")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  {t("actions_column")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {event.translations.find((tr) => tr.locale === "de")?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {event.city.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(event.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {event.status === "PENDING" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusUpdate(event.id, "APPROVED")
                          }
                          className="text-green-400 hover:text-green-300 mr-4"
                        >
                          {t("action_approve")}
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(event.id, "REJECTED")
                          }
                          className="text-yellow-400 hover:text-yellow-300 mr-4"
                        >
                          {t("action_reject")}
                        </button>
                      </>
                    )}
                    <Link
                      to={`/admin/edit/${event.id}`}
                      className="text-indigo-400 hover:text-indigo-300 mr-4"
                    >
                      {t("edit")}
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
