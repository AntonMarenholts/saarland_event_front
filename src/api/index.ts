// src/api/index.ts

import axios from "axios";
import type { Event, Category, City, CreateEventData, CategoryData, CityData } from "../types";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

// --- ПУБЛИЧНЫЕ ЗАПРОСЫ ---
export const fetchEvents = async (params: URLSearchParams): Promise<Event[]> => {
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

export const translateText = async (text: string, targetLang: 'en' | 'ru'): Promise<string> => {
  const deepLTargetLang = targetLang === 'en' ? 'en-US' : 'ru';
  const response = await apiClient.post('/translate', { text, targetLang: deepLTargetLang });
  return response.data.translatedText;
};


// --- АДМИНСКИЕ ЗАПРОСЫ ---
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
}

export const deleteCity = async (id: number) => {
    await apiClient.delete(`/admin/cities/${id}`);
}