import { useEffect, useState } from "react";
import type { Category, Event } from "../../types";
import { fetchCategories, type CreateEventData } from "../../api";

interface Props {
  onSubmit: (eventData: CreateEventData) => void;
  isLoading: boolean;
  initialData?: Event;
}

const saarlandCities = [
  "Saarbrücken", "Neunkirchen", "Homburg", "Völklingen", "St. Ingbert",
  "Saarlouis", "Merzig", "St. Wendel", "Püttlingen",
];

export default function EventForm({ onSubmit, isLoading, initialData }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [location, setLocation] = useState(initialData?.location || "Saarbrücken");
  const [eventDate, setEventDate] = useState(initialData ? new Date(initialData.eventDate).toISOString().slice(0, 16) : "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [categoryId, setCategoryId] = useState<number | undefined>(initialData?.category.id);
  const [nameDe, setNameDe] = useState(initialData?.translations.find(t => t.locale === 'de')?.name || "");
  const [descriptionDe, setDescDe] = useState(initialData?.translations.find(t => t.locale === 'de')?.description || "");

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      alert("Пожалуйста, выберите категорию.");
      return;
    }

    const eventData: CreateEventData = {
      eventDate: new Date(eventDate).toISOString(),
      location,
      imageUrl,
      categoryId,
      translations: [
        {
          locale: "de",
          name: nameDe,
          description: descriptionDe,
        },
      ],
    };
    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold text-white">
        {initialData ? 'Редактировать событие' : 'Добавить новое событие'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* --- ИСПРАВЛЕНИЯ НИЖЕ --- */}
        <input 
          type="text" 
          placeholder="Название (DE)"
          value={nameDe}
          onChange={(e) => setNameDe(e.target.value)} // <-- ДОБАВЛЕНО
          required 
          className="p-2 rounded bg-gray-700 text-white" 
        />
        <input 
          type="datetime-local" 
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)} // <-- ДОБАВЛЕНО
          required 
          className="p-2 rounded bg-gray-700 text-white" 
        />
        <select 
          value={location}
          onChange={(e) => setLocation(e.target.value)} // <-- ДОБАВЛЕНО
          className="p-2 rounded bg-gray-700 text-white"
        >
          {saarlandCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        <select 
          value={categoryId || ""}
          onChange={(e) => setCategoryId(Number(e.target.value))} // <-- ДОБАВЛЕНО
          required 
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="" disabled>Выберите категорию</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>
      <textarea 
        placeholder="Описание (DE)" 
        value={descriptionDe}
        onChange={(e) => setDescDe(e.target.value)} // <-- ДОБАВЛЕНО
        required 
        className="w-full p-2 rounded bg-gray-700 text-white"
      />
      <input 
        type="text" 
        placeholder="URL изображения" 
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)} // <-- ДОБАВЛЕНО
        className="w-full p-2 rounded bg-gray-700 text-white" 
      />
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-500"
      >
        {isLoading ? 'Сохранение...' : (initialData ? 'Сохранить изменения' : 'Добавить событие')}
      </button>
    </form>
  );
}