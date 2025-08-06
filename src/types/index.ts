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

export interface LoginData {
  username?: string;
  password?: string;
}

export interface RegisterData extends LoginData {
  email?: string;
}

// --- Типы для аутентификации ---

export interface LoginData {
  username?: string;
  password?: string;
}

export interface RegisterData extends LoginData {
  email?: string;
}

// ▼▼▼ ДОБАВЬТЕ ЭТОТ ИНТЕРФЕЙС ▼▼▼
export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
  token: string;
}
export interface ProfileData {
  user: CurrentUser;
  favoriteEvents: Event[];
}
