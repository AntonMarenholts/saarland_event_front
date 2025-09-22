import axios from "axios";
import type {
  Event,
  Category,
  City,
  CreateEventData,
  CategoryData,
  CityData,
  AdminStats,
  User,
  CurrentUser,
  Review,
  ReviewData,
  Page,
  CityEventCount,
} from "../types";


export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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


export const createPaymentSession = async (
  eventId: number,
  days: number,
  userId: number
): Promise<{ checkoutUrl: string }> => {
  const response = await apiClient.post("/payments/create-checkout-session", {
    eventId,
    days,
    userId,
  });
  return response.data;
};

export const fetchEvents = async (
  params: URLSearchParams
): Promise<Page<Event>> => {
  const response = await apiClient.get(`/events?${params.toString()}`);
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

export const fetchFavorites = async (userId: number): Promise<Event[]> => {
  const response = await apiClient.get(`/favorites/${userId}`);
  return response.data;
};

export const fetchMyEvents = async (
  page: number,
  size: number
): Promise<Page<Event>> => {
  const response = await apiClient.get(
    `/user/my-events?page=${page}&size=${size}`
  );
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
  const response = await apiClient.post("/user/events", eventData);
  return response.data;
};

export const uploadImage = async (
  file: File
): Promise<{ imageUrl: string }> => {
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

export const setReminder = async (
  userId: number,
  eventId: number,
  remindAt: string
): Promise<ReminderResponse> => {
  const response = await apiClient.post("/reminders", {
    userId,
    eventId,
    remindAt,
  });
  return response.data;
};

export const fetchAllEventsForAdmin = async (
  page: number,
  size: number
): Promise<Page<Event>> => {
  const response = await apiClient.get(
    `/admin/events?page=${page}&size=${size}&sort=eventDate,asc`
  );
  return response.data;
};

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await apiClient.get("/admin/events/stats");
  return response.data;
};

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

export const updateEventStatus = async (
  id: number,
  status: "APPROVED" | "REJECTED"
): Promise<Event> => {
  const response = await apiClient.patch(`/admin/events/${id}/status`, {
    status,
  });
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

export const fetchAllUsers = async (
  page: number,
  size: number
): Promise<Page<User>> => {
  const response = await apiClient.get(
    `/admin/users?page=${page}&size=${size}`
  );
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiClient.delete(`/admin/users/${id}`);
};

export const fetchUserProfile = async (): Promise<CurrentUser> => {
  const response = await apiClient.get("/auth/profile");

  const userString = localStorage.getItem("user");
  const token = userString ? JSON.parse(userString).token : null;

  return { ...response.data, token: token };
};

export const fetchReviewsByEventId = async (
  eventId: number
): Promise<Review[]> => {
  const response = await apiClient.get(`/events/${eventId}/reviews`);
  return response.data;
};

export const createReview = async (
  eventId: number,
  reviewData: ReviewData
): Promise<Review> => {
  const response = await apiClient.post(
    `/events/${eventId}/reviews`,
    reviewData
  );
  return response.data;
};
export const requestPasswordReset = async (email: string): Promise<void> => {
  await apiClient.post("/auth/forgot-password", { email });
};
export const fetchCityEventCounts = async (): Promise<CityEventCount[]> => {
  const response = await apiClient.get("/admin/events/by-city-count");
  return response.data;
};

export const fetchAdminEventsByCityName = async (
  cityName: string,
  page: number,
  size: number
): Promise<Page<Event>> => {
  const response = await apiClient.get(
    `/admin/events/by-city/${encodeURIComponent(
      cityName
    )}?page=${page}&size=${size}&sort=eventDate,asc`
  );
  return response.data;
};

export const fetchAdminEventsByCityNamePast = async (
  cityName: string,
  page: number,
  size: number
): Promise<Page<Event>> => {
  const response = await apiClient.get(
    `/admin/events/by-city/${encodeURIComponent(
      cityName
    )}/past?page=${page}&size=${size}&sort=eventDate,desc`
  );
  return response.data;
};

export const fetchAdminEventsByCityNameUpcoming = async (
  cityName: string,
  page: number,
  size: number
): Promise<Page<Event>> => {
  const response = await apiClient.get(
    `/admin/events/by-city/${encodeURIComponent(
      cityName
    )}/upcoming?page=${page}&size=${size}&sort=eventDate,asc`
  );
  return response.data;
};

export const updateMyEvent = async (
  id: number,
  eventData: CreateEventData
): Promise<Event> => {
  const response = await apiClient.put(`/user/events/${id}`, eventData);
  return response.data;
};

export const deleteMyEvent = async (id: number): Promise<void> => {
  await apiClient.delete(`/user/events/${id}`);
};
