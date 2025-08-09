import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { fetchCities, createCity, deleteCity } from "../../api";
import type { City, CityData } from "../../types";

export default function AdminCitiesPage() {
  const { t } = useTranslation();
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newName, setNewName] = useState("");
  const [newLatitude, setNewLatitude] = useState("");
  const [newLongitude, setNewLongitude] = useState("");

  const loadCities = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCities();
      setCities(data);
    } catch (error) {
      console.error("Не удалось загрузить города", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCityData: CityData = { 
        name: newName,
        latitude: newLatitude ? parseFloat(newLatitude) : null,
        longitude: newLongitude ? parseFloat(newLongitude) : null
      };
      await createCity(newCityData);
      setNewName("");
      setNewLatitude("");
      setNewLongitude("");
      await loadCities();
    } catch {
      alert(t('errorCreate'));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteCity(id);
        await loadCities();
      } catch {
        alert(t('errorDelete'));
      }
    }
  };
  
  if (isLoading) return <div className="text-white">{t('loading')}</div>;

  return (
    <div className="w-full text-white">
      <Link to="/admin" className="text-cyan-400 hover:underline mb-6 block">← {t('backToAdmin')}</Link>
      <h1 className="text-3xl font-bold mb-6">{t('manageCities')}</h1>

      <form onSubmit={handleCreate} className="mb-8 p-6 bg-gray-800 rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">{t('addNewCity')}</h2>
        <div>
          <label className="block text-sm font-medium mb-1">{t('cityName_placeholder')}</label>
          <input 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            // ▼▼▼ ИСПРАВЛЕНИЕ ЗДЕСЬ ▼▼▼
            placeholder={t('city_name_placeholder')} 
            required 
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <label className="block text-sm font-medium mb-1">{t('latitude_label')}</label>
                <input 
                    type="number"
                    step="any" 
                    value={newLatitude}
                    onChange={(e) => setNewLatitude(e.target.value)}
                    // ▼▼▼ ИСПРАВЛЕНИЕ ЗДЕСЬ ▼▼▼
                    placeholder={t('latitude_placeholder')} 
                    className="w-full p-2 rounded bg-gray-700 text-white"
                />
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium mb-1">{t('longitude_label')}</label>
                <input 
                    type="number" 
                    step="any"
                    value={newLongitude}
                    onChange={(e) => setNewLongitude(e.target.value)}
                    // ▼▼▼ ИСПРАВЛЕНИЕ ЗДЕСЬ ▼▼▼
                    placeholder={t('longitude_placeholder')}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                />
            </div>
        </div>

        <p className="text-xs text-gray-400">
            <Trans i18nKey="get_coordinates_hint">
                Чтобы получить координаты, найдите город на 
                <a 
                    href="https://www.google.com/maps" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                >
                    Google Maps
                </a>
                , нажмите на него правой кнопкой мыши, и координаты будут вверху выпадающего меню.
            </Trans>
        </p>

        <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
          {t('add')}
        </button>
      </form>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t('allCities')}</h2>
        <ul className="space-y-3">
          {cities.map(city => (
            <li key={city.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
              <div>
                <p className="font-bold">{city.name}</p>
                {city.latitude && city.longitude && (
                    <p className="text-xs text-gray-400">{`Lat: ${city.latitude}, Lon: ${city.longitude}`}</p>
                )}
              </div>
              <button onClick={() => handleDelete(city.id)} className="text-red-500 hover:text-red-400 text-sm">{t('delete')}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}