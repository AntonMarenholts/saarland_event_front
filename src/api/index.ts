import axios from "axios";

// Создаем экземпляр axios с базовым URL нашего бэкенда
const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Функция для получения всех событий
export const fetchEvents = async () => {
  // Отправляем GET-запрос на /events (полный путь будет http://localhost:8080/api/events)
  const response = await apiClient.get("/events");
  return response.data;
};

// В будущем мы добавим сюда и другие функции: fetchEventById, createEvent и т.д.