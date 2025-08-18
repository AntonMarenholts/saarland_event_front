import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchGroupedEventsForAdmin } from "../../api";
import type { Event } from "../../types";

type GroupedEvents = Record<string, Event[]>;

export default function AdminEventsByCityPage() {
  const { t } = useTranslation();
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getGroupedEvents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchGroupedEventsForAdmin();
        const sortedCities = Object.keys(data).sort((a, b) =>
          a.localeCompare(b)
        );
        const sortedGroupedEvents: GroupedEvents = {};
        for (const city of sortedCities) {
          sortedGroupedEvents[city] = data[city];
        }
        setGroupedEvents(sortedGroupedEvents);
      } catch (error) {
        console.error("Failed to load grouped events", error);
      } finally {
        setIsLoading(false);
      }
    };
    getGroupedEvents();
  }, []);

  if (isLoading) return <div className="text-white">{t("loading")}</div>;

  return (
    <div className="w-full text-white">
      <Link to="/admin" className="text-cyan-400 hover:underline mb-6 block">
        &larr; {t("backToAdmin")}
      </Link>
      <h1 className="text-3xl font-bold mb-6">{t("approved_events")}</h1>
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t("allCities")}</h2>
        <ul className="space-y-3">
          {Object.entries(groupedEvents).map(([city, events]) => (
            <li key={city}>
              <Link
                to={`/admin/events-by-city/${encodeURIComponent(city)}`}
                state={{ events }}
                className="flex justify-between items-center bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors"
              >
                <p className="font-bold">{city}</p>
                <span className="text-sm bg-cyan-800 px-2 py-1 rounded-full">
                  {events.length}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}