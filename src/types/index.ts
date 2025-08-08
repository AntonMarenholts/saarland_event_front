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

// ▼▼▼ ИЗМЕНЕНИЕ ЗДЕСЬ ▼▼▼
export interface City {
  id: number;
  name: string;
  latitude?: number | null; // Добавляем необязательные поля
  longitude?: number | null;
}
// ▲▲▲ КОНЕЦ ИЗМЕНЕНИЙ ▲▲▲

export interface Event {
  id: number;
  eventDate: string;
  imageUrl: string;
  category: Category;
  city: City; 
  translations: Translation[];
  status: string;
}

export interface CreateEventData {
  eventDate: string;
  imageUrl: string;
  categoryId: number;
  cityId: number;
  translations: Translation[];
}

export interface CategoryData {
  name: string;
  description?: string;
}

// ▼▼▼ ИЗМЕНЕНИЕ ЗДЕСЬ ▼▼▼
export interface CityData {
  name: string;
  latitude?: number | null; // Добавляем необязательные поля
  longitude?: number | null;
}
// ▲▲▲ КОНЕЦ ИЗМЕНЕНИЙ ▲▲▲

export interface LoginData {
  username?: string;
  password?: string;
}

export interface RegisterData extends LoginData {
  email?: string;
}

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

export interface AdminStats {
  totalEvents: number;
  pendingEvents: number;
  approvedEvents: number;
  totalUsers: number;
  totalCategories: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}