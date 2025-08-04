// Описывает один перевод
export interface Translation {
  locale: string;
  name: string;
  description: string;
}

// Описывает категорию
export interface Category {
  id: number;
  name: string;
  description: string;
}

// Описывает полное событие, как оно приходит от бэкенда
export interface Event {
  id: number;
  eventDate: string; // Даты приходят от Java как строки
  location: string;
  imageUrl: string;
  category: Category;
  translations: Translation[];
}