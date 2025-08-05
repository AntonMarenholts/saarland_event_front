// src/router/index.tsx

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/Home";
import AdminDashboardPage from "../pages/AdminDashboard";
import EventDetailPage from "../pages/EventDetail";
import NotFoundPage from "../pages/NotFound";
import MainLayout from "../layout";
import AdminEditEventPage from "../pages/AdminEditEvent";
import LoginPage from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import AdminCategoriesPage from "../pages/AdminCategories";
import AdminCitiesPage from "../pages/AdminCities"; // <-- Импорт

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/events/:id", element: <EventDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/edit/:id", element: <AdminEditEventPage /> },
          { path: "/admin/categories", element: <AdminCategoriesPage /> },
          { path: "/admin/cities", element: <AdminCitiesPage /> }, // <-- НОВЫЙ МАРШРУТ
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}