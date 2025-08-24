import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { submitEvent } from "../../api";
import type { CreateEventData } from "../../types";
import EventForm from "../../components/EventForm";
import { isAxiosError } from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function SubmitEventPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmitEvent = useCallback(async (eventData: CreateEventData) => {
    if (!executeRecaptcha) {
        console.error("Recaptcha not available");
        return;
    }

    setIsSubmitting(true);
    try {
      const token = await executeRecaptcha("submit_event");
      await submitEvent({ ...eventData, recaptchaToken: token });
      alert(t("submit_success_alert"));
      setFormKey((prevKey) => prevKey + 1);
      navigate("/");
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert(t("errorCreate"));
      }
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [executeRecaptcha, navigate, t]);

  return (
    <div className="w-full text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
      >
        &larr; {t("backToList")}
      </button>

      <h1 className="text-3xl font-bold mb-4">{t("submit_page_title")}</h1>
      <p className="text-gray-400 mb-8">{t("submit_page_subtitle")}</p>
      <EventForm
        key={formKey}
        onSubmit={handleSubmitEvent}
        isLoading={isSubmitting}
      />
    </div>
  );
}