import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
        <p>
          © 2025 {t("appName")}. {t("footerRights")}
        </p>

        <div className="flex gap-4 items-center">
          <Link to="/rules" className="text-xs text-gray-400 hover:text-white">
            {t("rules_page.title")}
          </Link>
          <div className="text-xs text-gray-400">
            <span>{t("contactLabel")}</span>
            <span className="ml-1">u0542178019@gmail.com</span>
          </div>
          <Link to="/login" className="text-xs text-gray-400 hover:text-white">
            {t("adminLogin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
