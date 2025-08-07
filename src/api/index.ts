// src/api/index.ts

import axios from "axios";
import type {
  Event,
  Category,
  City,
  CreateEventData,
  CategoryData,
  CityData,
  AdminStats, // Убедимся, что все типы импортированы
} from "../types";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

apiClient.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user && user.token) {
        config.headers["Authorization"] = "Bearer " + user.token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- ПУБЛИЧНЫЕ ЗАПРОСЫ ---

// ▼▼▼ ИЗМЕНЯЕМ ЭТУ ФУНКЦИЮ ▼▼▼
export const fetchEvents = async (
  params: URLSearchParams
): Promise<Event[]> => {
  // Мы больше не передаем весь объект params, а только его строковое представление
  const response = await apiClient.get(`/events?${params.toString()}`);
  return response.data;
};
// ▲▲▲ КОНЕЦ ИЗМЕНЕНИЙ ▲▲▲

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

// --- ЗАПРОСЫ ПОЛЬЗОВАТЕЛЯ ---

export const fetchFavorites = async (userId: number): Promise<Event[]> => {
    const response = await apiClient.get(`/favorites/${userId}`);
    return response.data;
};

export const addFavorite = async (userId: number, eventId: number): Promise<void> => {
    await apiClient.post(`/favorites/${userId}/${eventId}`);
};

export const removeFavorite = async (userId: number, eventId: number): Promise<void> => {
    await apiClient.delete(`/favorites/${userId}/${eventId}`);
};

export const submitEvent = async (eventData: CreateEventData): Promise<Event> => {
    const response = await apiClient.post("/user/events", eventData);
    return response.data;
};

export const uploadImage = async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

interface ReminderResponse {
    message: string;
}

export const setReminder = async (userId: number, eventId: number, remindAt: string): Promise<ReminderResponse> => {
    const response = await apiClient.post('/reminders', { userId, eventId, remindAt });
    return response.data;
};


// --- АДМИНСКИЕ ЗАПРОСЫ ---

export const fetchAllEventsForAdmin = async (): Promise<Event[]> => {
  const response = await apiClient.get("/admin/events");
  return response.data;
};

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await apiClient.get("/admin/events/stats");
  return response.data;
};

export const createEvent = async (eventData: CreateEventData): Promise<Event> => {
  const response = await apiClient.post("/admin/events", eventData);
  return response.data;
};

export const updateEvent = async (id: number, eventData: CreateEventData): Promise<Event> => {
  const response = await apiClient.put(`/admin/events/${id}`, eventData);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/events/${id}`);
};

export const updateEventStatus = async (id: number, status: 'APPROVED' | 'REJECTED'): Promise<Event> => {
  const response = await apiClient.patch(`/admin/events/${id}/status`, { status });
  return response.data;
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