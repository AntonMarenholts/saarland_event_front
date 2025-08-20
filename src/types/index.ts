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
  latitude?: number | null;
  longitude?: number | null;
}

export interface Event {
  id: number;
  eventDate: string;
  imageUrl: string;
  category: Category;
  city: City;
  translations: Translation[];
  status: string;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
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

export interface CityData {
  name: string;
  latitude?: number | null;
  longitude?: number | null;
}

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

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  username: string;
  userId: number;
}

export interface ReviewData {
  rating: number;
  comment: string;
}
