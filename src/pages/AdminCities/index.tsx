import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCities, createCity, deleteCity } from "../../api";
import type { City } from "../../types";

export default function AdminCitiesPage() {
  const { t } = useTranslation();
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newName, setNewName] = useState("");

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
      await createCity({ name: newName });
      setNewName("");
      await loadCities();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert(t('errorCreate'));
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await deleteCity(id);
        await loadCities();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        alert(t('errorDelete'));
      }
    }
  };
  
  if (isLoading) return <div className="text-white">{t('loading')}</div>;

  return (
    <div className="w-full text-white">
      <Link to="/admin" className="text-cyan-400 hover:underline mb-6 block">&larr; {t('backToAdmin')}</Link>
      <h1 className="text-3xl font-bold mb-6">{t('manageCities')}</h1>

      <form onSubmit={handleCreate} className="mb-8 p-6 bg-gray-800 rounded-lg flex gap-4 items-end">
        <div>
          {/* ▼▼▼ ИСПРАВЛЕНИЯ ЗДЕСЬ ▼▼▼ */}
          <label className="block text-sm font-medium mb-1">{t('addNewCity')}</label>
          <input 
            type="text" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('cityName_placeholder')} 
            required 
            className="p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded">
          {t('add')}
        </button>
      </form>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t('allCities')}</h2>
        {/* ▲▲▲ ИСПРАВЛЕНИЯ ЗДЕСЬ ▲▲▲ */}
        <ul className="space-y-3">
          {cities.map(city => (
            <li key={city.id} className="flex justify-between items-center bg-gray-700 p-3 rounded">
              <p className="font-bold">{city.name}</p>
              <button onClick={() => handleDelete(city.id)} className="text-red-500 hover:text-red-400 text-sm">{t('delete')}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}