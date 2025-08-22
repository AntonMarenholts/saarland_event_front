import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCityEventCounts } from "../../api"; 
import type { CityEventCount } from "../../types"; 

export default function AdminEventsByCityPage() {
  const { t } = useTranslation();
  const [cityCounts, setCityCounts] = useState<CityEventCount[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCounts = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCityEventCounts(); 
        setCityCounts(data);
      } catch (error) {
        console.error("Failed to load city event counts", error);
      } finally {
        setIsLoading(false);
      }
    };
    getCounts();
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
          
          {cityCounts.map((item) => (
            <li key={item.cityName}>
              <Link
                to={`/admin/events-by-city/${encodeURIComponent(
                  item.cityName
                )}`}
                className="flex justify-between items-center bg-gray-700 p-3 rounded hover:bg-gray-600 transition-colors"
              >
                <p className="font-bold">{item.cityName}</p>
                <span className="text-sm bg-cyan-800 px-2 py-1 rounded-full">
                  {item.eventCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}