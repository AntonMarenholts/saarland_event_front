// src/components/EventForm/index.tsx

import { useEffect, useState } from "react";
import type { Category } from "../../types";
import { fetchCategories, type CreateEventData } from "../../api";

interface Props {
  onSubmit: (eventData: CreateEventData) => void;
  isLoading: boolean;
}

const saarlandCities = [
  "Saarbrücken", "Neunkirchen", "Homburg", "Völklingen", "St. Ingbert", 
  "Saarlouis", "Merzig", "St. Wendel", "Püttlingen",
];

export default function EventForm({ onSubmit, isLoading }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  // State для каждого поля формы
  const [location, setLocation] = useState("Saarbrücken");
  const [eventDate, setEventDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [nameDe, setNameDe] = useState("");
  const [descriptionDe, setDescDe] = useState("");

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
      eventDate: eventDate, // Формат должен быть YYYY-MM-DDTHH:mm
      location,
      imageUrl,
      categoryId,
      translations: [
        {
          locale: "de",
          name: nameDe,
          description: descriptionDe,
        },
        // TODO: Добавить поля для других языков
      ],
    };
    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-xl font-semibold text-white">Добавить новое событие</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Поле Название (DE) */}
        <input 
          type="text" 
          placeholder="Название (DE)"
          value={nameDe}
          onChange={(e) => setNameDe(e.target.value)}
          required 
          className="p-2 rounded bg-gray-700 text-white" 
        />
        {/* Поле Дата и время */}
        <input 
          type="datetime-local" 
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required 
          className="p-2 rounded bg-gray-700 text-white" 
        />
        {/* Поле Город */}
        <select 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white"
        >
          {saarlandCities.map(city => <option key={city} value={city}>{city}</option>)}
        </select>
        {/* Поле Категория */}
        <select 
          value={categoryId || ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          required 
          className="p-2 rounded bg-gray-700 text-white"
        >
          <option value="" disabled>Выберите категорию</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>
      {/* Поле Описание (DE) */}
      <textarea 
        placeholder="Описание (DE)" 
        value={descriptionDe}
        onChange={(e) => setDescDe(e.target.value)}
        required 
        className="w-full p-2 rounded bg-gray-700 text-white"
      />
      {/* Поле URL изображения */}
      <input 
        type="text" 
        placeholder="URL изображения" 
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full p-2 rounded bg-gray-700 text-white" 
      />

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-500"
      >
        {isLoading ? 'Сохранение...' : 'Добавить событие'}
      </button>
    </form>
  );
}