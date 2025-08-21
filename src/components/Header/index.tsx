import { useEffect, useState } from "react";
import {
  NavLink,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCategories, fetchCities } from "../../api/index";
import type { Category, City, CurrentUser } from "../../types/index";
import AuthService from "../../services/auth.service";

const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);
const months = [
  { value: 1, name: "Januar" },
  { value: 2, name: "Februar" },
  { value: 3, name: "März" },
  { value: 4, name: "April" },
  { value: 5, name: "Mai" },
  { value: 6, name: "Juni" },
  { value: 7, name: "Juli" },
  { value: 8, name: "August" },
  { value: 9, name: "September" },
  { value: 10, name: "Oktober" },
  { value: 11, name: "November" },
  { value: 12, name: "Dezember" },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(
    undefined
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("keyword") || ""
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (
      !["/", "/city", "/category"].some((p) => location.pathname.startsWith(p))
    ) {
      return;
    }
    const handler = setTimeout(() => {
      const newSearchParams = new URLSearchParams(searchParams);
      if (searchQuery) {
        newSearchParams.set("keyword", searchQuery);
      } else {
        newSearchParams.delete("keyword");
      }
      setSearchParams(newSearchParams);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, location.pathname, setSearchParams]);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAdmin(user.roles.includes("ROLE_ADMIN"));
    } else {
      setCurrentUser(undefined);
      setIsAdmin(false);
    }
  }, [location]);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    setIsAdmin(false);
    navigate("/");
  };

  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
  const showFilters = !isAdminPage && !isAuthPage;

  useEffect(() => {
    if (showFilters) {
      fetchCategories()
        .then((data) => {
          data.sort((a, b) => a.name.localeCompare(b.name));
          setCategories(data);
        })
        .catch((err) => console.error("Failed to load categories", err));
      fetchCities()
        .then((data) => {
          data.sort((a, b) => a.name.localeCompare(b.name));
          setCities(data);
        })
        .catch((err) => console.error("Failed to load cities", err));
    }
  }, [showFilters]);

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

  const renderUserSection = () => (
    <div className="flex items-center justify-end gap-4">
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        className="bg-gray-700 text-white p-2 rounded-md text-sm"
      >
        <option value="de">DE</option>
        <option value="en">EN</option>
        <option value="ru">RU</option>
      </select>
      {!isAuthPage &&
        (!currentUser ? (
          <>
            <NavLink
              to="/login"
              className="text-sm font-medium hover:text-cyan-400"
            >
              {t("loginButton")}
            </NavLink>
            <NavLink
              to="/register"
              className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded-md text-sm"
            >
              {t("signup")}
            </NavLink>
          </>
        ) : (
          <>
            {!isAdminPage && (
              <NavLink
                to="/submit-event"
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm hidden sm:block"
              >
                {t("submit_event_button")}
              </NavLink>
            )}
            <NavLink
              to="/profile"
              className="text-sm font-medium hover:text-cyan-400"
            >
              {isAdmin ? `⭐ ${t("admin")}` : `⭐ ${t("favorites_button")}`}
            </NavLink>
            <span className="text-sm font-medium text-gray-400 hidden sm:block">
              {currentUser.username}
            </span>
            <button
              onClick={logOut}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
            >
              {t("logout")}
            </button>
          </>
        ))}
    </div>
  );

  const renderFilters = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
      <input
        type="search"
        placeholder={t("search_placeholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-gray-700 text-white p-2 rounded-md w-full sm:col-span-2 md:col-span-1"
      />
      <select
        onChange={(e) => handleFilterChange("city", e.target.value)}
        value={searchParams.get("city") || "all"}
        className="bg-gray-700 text-white p-2 rounded-md"
      >
        <option value="all">{t("selectCity_placeholder")}</option>
        {cities.map((city) => (
          <option key={city.id} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => handleFilterChange("category", e.target.value)}
        value={searchParams.get("category") || "all"}
        className="bg-gray-700 text-white p-2 rounded-md"
      >
        <option value="all">{t("selectCategory_placeholder")}</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id.toString()}>
            {cat.name}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => handleFilterChange("year", e.target.value)}
        value={searchParams.get("year") || "all"}
        className="bg-gray-700 text-white p-2 rounded-md"
      >
        <option value="all">{t("selectYear_placeholder")}</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => handleFilterChange("month", e.target.value)}
        value={searchParams.get("month") || "all"}
        className="bg-gray-700 text-white p-2 rounded-md"
      >
        <option value="all">{t("selectMonth_placeholder")}</option>
        {months.map((month) => (
          <option key={month.value} value={month.value.toString()}>
            {month.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="lg:w-1/3">
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          <div className="lg:w-1/3 flex justify-center">
            <NavLink
              to="/"
              className="flex items-center gap-3 text-2xl font-bold transition-opacity hover:opacity-80"
            >
              <img src="/logo.png" alt={t("appName")} className="h-12 w-auto" />
              <span className="hidden sm:block">{t("appName")}</span>
            </NavLink>
          </div>

          <div className="w-1/3 hidden lg:flex justify-end">
            {renderUserSection()}
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden mt-4 space-y-4">
            {renderUserSection()}
            {showFilters && renderFilters()}
          </div>
        )}

        {showFilters && (
          <div className="hidden lg:grid mt-4">{renderFilters()}</div>
        )}
      </div>
    </header>
  );
}
