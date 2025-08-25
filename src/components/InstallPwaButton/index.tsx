import { usePwaInstall } from "../../hooks/usePwaInstall";
import { useTranslation } from "react-i18next";

export default function InstallPwaButton() {
  const { isInstallable, isInstalled, handleInstall } = usePwaInstall();
  const { t } = useTranslation();

  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="flex items-center gap-2 bg-teal-700 hover:bg-teal-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-transform hover:scale-105"
      title={t("install_app_tooltip")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
      <span>{t("install_app_button")}</span>
    </button>
  );
}
