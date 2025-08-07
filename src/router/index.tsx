import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/Home";
import AdminDashboardPage from "../pages/AdminDashboard";
import EventDetailPage from "../pages/EventDetail";
import NotFoundPage from "../pages/NotFound";
import MainLayout from "../layout";
import AdminEditEventPage from "../pages/AdminEditEvent";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register"; // <-- Импорт
import ProtectedRoute from "./ProtectedRoute";
import AdminCategoriesPage from "../pages/AdminCategories";
import AdminCitiesPage from "../pages/AdminCities";
import ProfilePage from "../pages/Profile";
import SubmitEventPage from "../pages/SubmitEvent";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/events/:id", element: <EventDetailPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/submit-event", element: <SubmitEventPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/edit/:id", element: <AdminEditEventPage /> },
          { path: "/admin/categories", element: <AdminCategoriesPage /> },
          { path: "/admin/cities", element: <AdminCitiesPage /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
