// src/api/index.ts

import axios from "axios";
import type {
  Event,
  Category,
  City,
  CreateEventData,
  CategoryData,
  CityData,
} from "../types";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

// ▼▼▼ НОВЫЙ КОД ▼▼▼
// Interceptor для добавления JWT токена в заголовки
apiClient.interceptors.request.use(
  (config) => {
    // Пытаемся получить данные пользователя из localStorage
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        // Если токен есть, добавляем его в заголовок Authorization
        config.headers["Authorization"] = "Bearer " + user.token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ▲▲▲ НОВЫЙ КОД ▲▲▲

// --- ПУБЛИЧНЫЕ ЗАПРОСЫ (остаются без изменений) ---
export const fetchEvents = async (
  params: URLSearchParams
): Promise<Event[]> => {
  const response = await apiClient.get("/events", { params });
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get("/categories");
  return response.data;
};

export const fetchCities = async (): Promise<City[]> => {
  const response = await apiClient.get("/cities");
  return response.data;
};

export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};

export const translateText = async (
  text: string,
  targetLang: "en" | "ru"
): Promise<string> => {
  const deepLTargetLang = targetLang === "en" ? "en-US" : "ru";
  const response = await apiClient.post("/translate", {
    text,
    targetLang: deepLTargetLang,
  });
  return response.data.translatedText;
};

// --- АДМИНСКИЕ ЗАПРОСЫ (теперь защищены токеном) ---
export const createEvent = async (
  eventData: CreateEventData
): Promise<Event> => {
  const response = await apiClient.post("/admin/events", eventData);
  return response.data;
};

export const updateEvent = async (
  id: number,
  eventData: CreateEventData
): Promise<Event> => {
  const response = await apiClient.put(`/admin/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/events/${id}`);
};

export const createCategory = async (categoryData: CategoryData) => {
  const response = await apiClient.post("/admin/categories", categoryData);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  await apiClient.delete(`/admin/categories/${id}`);
};

export const createCity = async (cityData: CityData) => {
  const response = await apiClient.post("/admin/cities", cityData);
  return response.data;
};

export const deleteCity = async (id: number) => {
  await apiClient.delete(`/admin/cities/${id}`);
};

export const fetchFavorites = async (userId: number): Promise<Event[]> => {
  const response = await apiClient.get(`/favorites/${userId}`);
  return response.data;
};

export const addFavorite = async (
  userId: number,
  eventId: number
): Promise<void> => {
  await apiClient.post(`/favorites/${userId}/${eventId}`);
};

export const removeFavorite = async (
  userId: number,
  eventId: number
): Promise<void> => {
  await apiClient.delete(`/favorites/${userId}/${eventId}`);
};

export const submitEvent = async (
  eventData: CreateEventData
): Promise<Event> => {
  // Используем новый эндпоинт, доступный для обычных пользователей
  const response = await apiClient.post("/user/events", eventData);
  return response.data;
};

// --- ADMIN MODERATION API ---

// Получает ВСЕ события, включая те, что на модерации
export const fetchAllEventsForAdmin = async (): Promise<Event[]> => {
  const response = await apiClient.get("/admin/events");
  return response.data;
};

// Обновляет статус события (Одобрить/Отклонить)
export const updateEventStatus = async (id: number, status: 'APPROVED' | 'REJECTED'): Promise<Event> => {
  // ▼▼▼ ИЗМЕНЕНИЕ ЗДЕСЬ: Отправляем объект вместо текста и убираем заголовки ▼▼▼
  const response = await apiClient.patch(`/admin/events/${id}/status`, { status });
  return response.data;
};
