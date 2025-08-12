import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById, updateEvent } from "../../api";
import type { CreateEventData, Event } from "../../types";
import EventForm from "../../components/EventForm";

export default function AdminEditEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventById(id)
        .then(setEvent)
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleUpdateEvent = async (eventData: CreateEventData) => {
    if (!id) return;
    setIsLoading(true);
    try {
      await updateEvent(Number(id), eventData);
      navigate("/admin");
    } catch (err) {
      alert("Failed to update event.");
      console.error(err);
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-white">Loading event data...</div>;
  if (!event) return <div className="text-red-500">Event not found.</div>;

  return (
    <div className="text-white">
      <EventForm
        onSubmit={handleUpdateEvent}
        isLoading={isLoading}
        initialData={event}
      />
    </div>
  );
}
