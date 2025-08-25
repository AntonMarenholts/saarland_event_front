import { useRegisterSW } from "virtual:pwa-register/react";

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("Service Worker registered:", r);
    },
    onRegisterError(error) {
      console.log("Service Worker registration error:", error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 p-4 rounded-lg shadow-lg bg-gray-800 text-white border border-gray-600">
      <div className="mb-2">
        {offlineReady ? (
          <span>Приложение готово к работе оффлайн</span>
        ) : (
          <span>Доступна новая версия, обновить?</span>
        )}
      </div>
      {needRefresh && (
        <button
          className="py-1 px-3 mr-2 bg-green-600 hover:bg-green-700 rounded-md text-sm"
          onClick={() => updateServiceWorker(true)}
        >
          Обновить
        </button>
      )}
      <button
        className="py-1 px-3 bg-gray-600 hover:bg-gray-500 rounded-md text-sm"
        onClick={() => close()}
      >
        Закрыть
      </button>
    </div>
  );
}

export default ReloadPrompt;
