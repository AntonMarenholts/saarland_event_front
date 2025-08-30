import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, updateMyEvent } from "../../api";
import type { CreateEventData, Event } from "../../types";
import EventForm from "../../components/EventForm";
import { useTranslation } from "react-i18next";

export default function UserEditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventById(id)
        .then(setEvent)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleUpdateEvent = async (eventData: CreateEventData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await updateMyEvent(Number(id), eventData);
      navigate("/profile");
    } catch (err) {
      alert("Failed to update event.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="text-white">Loading event data...</div>;
  if (!event) return <div className="text-red-500">Event not found.</div>;

  return (
    <div className="text-white">
      <button
        onClick={() => navigate("/profile")}
        className="text-cyan-400 hover:underline mb-6 block"
      >
        &larr; {t("back_to_profile")}
      </button>
      <EventForm
        onSubmit={handleUpdateEvent}
        isLoading={isSubmitting}
        initialData={event}
      />
    </div>
  );
}
