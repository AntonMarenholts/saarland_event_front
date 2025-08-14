import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/Home";
import AdminDashboardPage from "../pages/AdminDashboard";
import EventDetailPage from "../pages/EventDetail";
import NotFoundPage from "../pages/NotFound";
import MainLayout from "../layout";
import AdminEditEventPage from "../pages/AdminEditEvent";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register"; 
import ProtectedRoute from "./ProtectedRoute";
import AdminCategoriesPage from "../pages/AdminCategories";
import AdminCitiesPage from "../pages/AdminCities";
import ProfilePage from "../pages/Profile";
import SubmitEventPage from "../pages/SubmitEvent";
import CategoryPage from "../pages/CategoryPage";
import CityPage from "../pages/CityPage";
import AdminUsersPage from "../pages/AdminUsers";
import AuthCallbackPage from "../pages/AuthCallback";
import SyncUserPage from "../pages/SyncUser";

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
      { path: "/category/:categoryName", element: <CategoryPage /> },
      { path: "/city/:cityName", element: <CityPage /> },
      { path: "/auth/callback", element: <AuthCallbackPage /> },
      { path: "/sync-user", element: <SyncUserPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/edit/:id", element: <AdminEditEventPage /> },
          { path: "/admin/categories", element: <AdminCategoriesPage /> },
          { path: "/admin/cities", element: <AdminCitiesPage /> },
          { path: "/admin/users", element: <AdminUsersPage /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
