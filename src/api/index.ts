import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Функция для получения всех событий
export const fetchEvents = async (params: URLSearchParams) => {
  // Отправляем GET-запрос на /events с параметрами
  const response = await apiClient.get("/events", { params });
  return response.data;
};

// --- НОВЫЙ КОД ---
// Функция для получения всех категорий
export const fetchCategories = async () => {
  const response = await apiClient.get("/categories");
  return response.data;
};
// -----------------
