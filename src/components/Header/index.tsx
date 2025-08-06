import { useEffect, useState } from "react";
import { NavLink, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCategories } from "../../api";
import type { Category } from "../../types";
import { useAuth } from "../../hooks/useAuth";

const saarlandCities = [
  "Saarbrücken", "Neunkirchen", "Homburg", "Völklingen", "St. Ingbert",
  "Saarlouis", "Merzig", "St. Wendel", "Püttlingen",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
const months = [
    { value: 1, name: 'Januar' }, { value: 2, name: 'Februar' }, { value: 3, name: 'März' },
    { value: 4, name: 'April' }, { value: 5, name: 'Mai' }, { value: 6, name: 'Juni' },
    { value: 7, name: 'Juli' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
    { value: 10, name: 'Oktober' }, { value: 11, name: 'November' }, { value: 12, name: 'Dezember' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin, logout } = useAuth();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isAdminPage) {
        fetchCategories().then(setCategories).catch(err => console.error("Failed to load categories", err));
    }
  }, [isAdminPage]);

  const handleFilterChange = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    navigate(`/?${newSearchParams.toString()}`);
  };
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center gap-4 flex-wrap">
        <NavLink to="/" className="text-xl font-bold hover:text-cyan-400">
          {t('appName')}
        </NavLink>
        
        {!isAdminPage ? (
          <div className="flex gap-2 flex-wrap">
            <select 
              onChange={(e) => handleFilterChange('city', e.target.value)} 
              value={searchParams.get('city') || 'all'}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">{t('selectCity_placeholder')}</option>
              {saarlandCities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>

            <select 
              onChange={(e) => handleFilterChange('category', e.target.value)}
              value={searchParams.get('category') || 'all'}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">{t('selectCategory_placeholder')}</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>)}
            </select>

            <select 
              onChange={(e) => handleFilterChange('year', e.target.value)}
              value={searchParams.get('year') || 'all'}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">{t('selectYear_placeholder')}</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>

            <select 
              onChange={(e) => handleFilterChange('month', e.target.value)}
              value={searchParams.get('month') || 'all'}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">{t('selectMonth_placeholder')}</option>
              {months.map((month) => <option key={month.value} value={month.value.toString()}>{month.name}</option>)}
            </select>
          </div>
        ) : (
          <div className="flex-grow"></div> 
        )}

        <div className="flex items-center gap-4">
          <select 
            onChange={(e) => changeLanguage(e.target.value)} 
            value={i18n.language}
            className="bg-gray-700 text-white p-2 rounded-md appearance-none text-sm"
          >
            <option value="de">DE</option>
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>

          <NavLink to="/" className="hover:text-cyan-400">
            {t('home')}
          </NavLink>
          
          {isAdmin && (
            <button 
              onClick={logout} 
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
            >
              {t('logout')}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}