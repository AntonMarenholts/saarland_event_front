// src/types/index.ts

export interface Translation {
  locale: string;
  name: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface City {
  id: number;
  name: string;
}

export interface Event {
  id: number;
  eventDate: string;
  imageUrl: string;
  category: Category;
  city: City; // <-- Правильная структура
  translations: Translation[];
}

// Тип для формы создания/обновления
export interface CreateEventData {
  eventDate: string;
  imageUrl: string;
  categoryId: number;
  cityId: number; // <-- Правильная структура
  translations: Translation[];
}

// Тип для формы создания категории
export interface CategoryData {
  name: string;
  description?: string;
}

// Тип для формы создания города
export interface CityData {
  name: string;
}