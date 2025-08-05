import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventById } from "../../api";
import type { Event } from "../../types";

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const getEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err) {
        setError("Не удалось загрузить событие.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getEvent();
  }, [id]);

  if (isLoading) {
    return <div className="text-white text-2xl text-center">Загрузка события...</div>;
  }

  if (error || !event) {
    return <div className="text-red-500 text-2xl text-center">{error || 'Событие не найдено.'}</div>;
  }
  
  const translation = event.translations.find(t => t.locale === 'de');

  return (
    <div className="text-white w-full max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
      >
        &larr; Zurück zur Übersicht (Назад к списку)
      </button>

      <article className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <img 
          src={event.imageUrl || 'https://via.placeholder.com/800x400'} 
          alt={translation?.name} 
          className="w-full h-96 object-cover"
        />
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-4">{translation?.name}</h1>
          
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-gray-400 mb-6 border-b border-gray-700 pb-4">
            <p><strong>Stadt (Город):</strong> {event.city.name}</p>
            <p><strong>Kategorie (Категория):</strong> {event.category.name}</p>
            <p><strong>Datum (Дата):</strong> {new Date(event.eventDate).toLocaleString('de-DE')}</p>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold">Beschreibung (Описание)</h2>
            <p>{translation?.description}</p>
          </div>
        </div>
      </article>
    </div>
  );
}