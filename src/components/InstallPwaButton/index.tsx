
import { usePwaInstall } from '../../hooks/usePwaInstall';

export default function InstallPwaButton() {
  const { isInstallable, isInstalled, handleInstall } = usePwaInstall();

  
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <button
      onClick={handleInstall}
      className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-1 px-3 rounded-md text-sm transition-transform hover:scale-105"
      title="Установить приложение"
    >
      Установить
    </button>
  );
}