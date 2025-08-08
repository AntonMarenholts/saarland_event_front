import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- 1. Импортируем useNavigate
import { useTranslation } from "react-i18next";
import { submitEvent } from "../../api";
import type { CreateEventData } from "../../types";
import EventForm from "../../components/EventForm";

export default function SubmitEventPage() {
  const { t } = useTranslation();
  const navigate = useNavigate(); // <-- 2. Инициализируем хук
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleSubmitEvent = async (eventData: CreateEventData) => {
    setIsSubmitting(true);
    try {
      await submitEvent(eventData);
      alert(t('submit_success_alert'));
      setFormKey(prevKey => prevKey + 1);
      navigate("/"); // Возвращаем на главную после успеха
    } catch (err) {
      alert(t('errorCreate'));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full text-white">
      {/* ▼▼▼ 3. ДОБАВЛЯЕМ КНОПКУ "НАЗАД" ▼▼▼ */}
      <button onClick={() => navigate(-1)} className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">
        &larr; {t('backToList')}
      </button>

      <h1 className="text-3xl font-bold mb-4">{t('submit_page_title')}</h1>
      <p className="text-gray-400 mb-8">{t('submit_page_subtitle')}</p>
      <EventForm key={formKey} onSubmit={handleSubmitEvent} isLoading={isSubmitting} />
    </div>
  );
}