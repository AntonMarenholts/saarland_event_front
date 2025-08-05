import { useEffect, useState } from "react";
// Добавляем useLocation, чтобы знать текущий URL
import { NavLink, useSearchParams, useNavigate, useLocation } from "react-router-dom";
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
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAdmin, logout } = useAuth();
  const location = useLocation(); // <-- Получаем информацию о текущем маршруте

  // Проверяем, находимся ли мы на странице администратора
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Загружаем категории только если мы не в админ-панели
    if (!isAdminPage) {
        fetchCategories().then(setCategories).catch(err => console.error("Failed to load categories", err));
    }
  }, [isAdminPage]);

  // Функция для обновления URL с новыми параметрами фильтрации
  const handleFilterChange = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value === "all") {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, value);
    }
    // Переходим на главную страницу с новыми параметрами
    navigate(`/?${newSearchParams.toString()}`);
  };

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center gap-4 flex-wrap">
        <NavLink to="/" className="text-xl font-bold hover:text-cyan-400">
          Афиша Саарланда
        </NavLink>
        
        {/* --- ИСПРАВЛЕНИЕ: Показываем фильтры только НЕ на админских страницах --- */}
        {!isAdminPage ? (
          <div className="flex gap-2 flex-wrap">
            {/* Все наши селекты-фильтры */}
            <select 
              onChange={(e) => handleFilterChange('city', e.target.value)} 
              value={searchParams.get('city') || 'all'}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">Выберите город</option>
              {saarlandCities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>

            <select 
              onChange={(e) => handleFilterChange('category', e.target.value)}
              value={searchParams.get('category') || 'all'}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">Выберите категорию</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>)}
            </select>

            <select 
              onChange={(e) => handleFilterChange('year', e.target.value)}
              value={searchParams.get('year') || 'all'}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">Выберите год</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>

            <select 
              onChange={(e) => handleFilterChange('month', e.target.value)}
              value={searchParams.get('month') || 'all'}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">Выберите месяц</option>
              {months.map((month) => <option key={month.value} value={month.value.toString()}>{month.name}</option>)}
            </select>
          </div>
        ) : (
          // Пустой элемент, чтобы правая часть хедера оставалась на месте
          <div className="flex-grow"></div> 
        )}

        <div className="flex items-center gap-4">
          {/* Кнопка "Главная" нужна всегда */}
          <NavLink to="/" className="hover:text-cyan-400">
            Главная
          </NavLink>
          
          {isAdmin && (
            // Кнопка "Выйти" видна только вошедшему админу
            <button 
              onClick={logout} 
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
            >
              Выйти
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}