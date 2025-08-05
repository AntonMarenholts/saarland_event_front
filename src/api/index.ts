import axios from "axios";
import type { Event } from "../types";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

// --- Функции для публичной части ---

export const fetchEvents = async (
  params: URLSearchParams
): Promise<Event[]> => {
  const response = await apiClient.get("/events", { params });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};

export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};

// --- НОВЫЙ КОД: Функции для админ-панели ---

// Тип для данных, отправляемых на бэкенд для создания события
export interface CreateEventData {
  eventDate: string;
  location: string;
  imageUrl: string;
  categoryId: number;
  translations: {
    locale: string;
    name: string;
    description: string;
  }[];
}

export const createEvent = async (
  eventData: CreateEventData
): Promise<Event> => {
  // Отправляем POST-запрос на админский эндпоинт
  const response = await apiClient.post("/admin/events", eventData);
  return response.data;
};

export const deleteEvent = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/events/${id}`);
};

export const updateEvent = async (
  id: number,
  eventData: CreateEventData
): Promise<Event> => {
  const response = await apiClient.put(`/admin/events/${id}`, eventData);
  return response.data;
};

export interface CategoryData {
  name: string;
  description?: string;
}

export const createCategory = async (categoryData: CategoryData) => {
  const response = await apiClient.post("/admin/categories", categoryData);
  return response.data;
};

export const deleteCategory = async (id: number) => {
  await apiClient.delete(`/admin/categories/${id}`);
};

export const translateText = async (
  text: string,
  targetLang: "en" | "ru"
): Promise<string> => {
  // targetLang может быть 'en-US' для DeepL, но для простоты используем 'en'
  const deepLTargetLang = targetLang === "en" ? "en-US" : "ru";

  const response = await apiClient.post("/translate", {
    text: text,
    targetLang: deepLTargetLang,
  });

  return response.data.translatedText;
};

// Функцию update мы пока не будем использовать, но добавим на будущее
// export const updateCategory = async (id: number, categoryData: CategoryData) => {
//   const response = await apiClient.put(`/admin/categories/${id}`, categoryData);
//   return response.data;
// };
