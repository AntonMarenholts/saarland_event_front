import { useEffect, useState } from "react";
import {
  NavLink,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { fetchCategories } from "../../api";
import type { Category, CurrentUser } from "../../types";
import AuthService from "../../services/auth.service";

const saarlandCities = [
  "Saarbrücken",
  "Neunkirchen",
  "Homburg",
  "Völklingen",
  "St. Ingbert",
  "Saarlouis",
  "Merzig",
  "St. Wendel",
  "Püttlingen",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear + i);
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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [currentUser, setCurrentUser] = useState<CurrentUser | undefined>(
    undefined
  );
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    if (!isAdminPage && !isAuthPage) {
      fetchCategories()
        .then(setCategories)
        .catch((err) => console.error("Failed to load categories", err));
    }
  }, [isAdminPage, isAuthPage]);

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

  const renderUserSection = () => {
    if (!currentUser) {
      return (
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
            {t("signupButton")}
          </NavLink>
        </>
      );
    }

    return (
      <>
        {/* ▼▼▼ ИЗМЕНЕНИЕ ЗДЕСЬ: Добавляем проверку !isAdminPage ▼▼▼ */}
        {!isAdminPage && (
          <NavLink
            to="/submit-event"
            className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm"
          >
            {t("submit_event_button")}
          </NavLink>
        )}

        <NavLink
          to={isAdmin ? "/admin" : "/profile"}
          className="text-sm font-medium hover:text-cyan-400"
        >
          {currentUser.username}
        </NavLink>

        <button
          onClick={logOut}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm"
        >
          {t("logout")}
        </button>
      </>
    );
  };

  return (
    <header className="bg-gray-800 text-white p-4 sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center gap-4 flex-wrap">
        <NavLink to="/" className="text-xl font-bold hover:text-cyan-400">
          {t("appName")}
        </NavLink>

        {!isAdminPage && !isAuthPage ? (
          <div className="flex gap-2 flex-wrap">
            <select
              onChange={(e) => handleFilterChange("city", e.target.value)}
              value={searchParams.get("city") || "all"}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">{t("selectCity_placeholder")}</option>
              {saarlandCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => handleFilterChange("category", e.target.value)}
              value={searchParams.get("category") || "all"}
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
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
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
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
              className="bg-gray-700 text-white p-2 rounded-md appearance-none"
            >
              <option value="all">{t("selectMonth_placeholder")}</option>
              {months.map((month) => (
                <option key={month.value} value={month.value.toString()}>
                  {month.name}
                </option>
              ))}
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

          {!isAuthPage && renderUserSection()}
        </div>
      </nav>
    </header>
  );
}
