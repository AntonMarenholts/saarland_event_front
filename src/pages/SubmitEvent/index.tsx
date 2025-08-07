// src/pages/SubmitEvent/index.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { submitEvent } from "../../api";
import type { CreateEventData } from "../../types";
import EventForm from "../../components/EventForm"; // Мы переиспользуем нашу готовую форму!

export default function SubmitEventPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0); // Для сброса формы после отправки

  const handleSubmitEvent = async (eventData: CreateEventData) => {
    setIsSubmitting(true);
    try {
      await submitEvent(eventData);
      alert(t('submit_success_alert')); // Сообщаем об успехе
      setFormKey(prevKey => prevKey + 1); // Сбрасываем форму
      navigate("/"); // Возвращаем на главную
    } catch (err) {
      alert(t('errorCreate'));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full text-white">
        <h1 className="text-3xl font-bold mb-4">{t('submit_page_title')}</h1>
        <p className="text-gray-400 mb-8">{t('submit_page_subtitle')}</p>
        <EventForm key={formKey} onSubmit={handleSubmitEvent} isLoading={isSubmitting} />
    </div>
  );
}