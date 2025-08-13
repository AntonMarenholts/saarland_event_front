import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center">
        <p>
          © 2025 {t("appName")}. {t("footerRights")}
        </p>

        <div className="flex gap-4 items-center">
          <a
            href="mailto:u0542178019@gmail.com"
            className="text-xs text-gray-400 hover:text-white"
          >
            {t("contactUs")}
          </a>

          <Link to="/login" className="text-xs text-gray-400 hover:text-white">
            {t("adminLogin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
