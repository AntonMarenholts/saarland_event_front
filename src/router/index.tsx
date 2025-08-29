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
import AdminUsersPage from "../pages/AdminUsers";
import AuthCallbackPage from "../pages/AuthCallback";
import ForgotPasswordPage from "../pages/ForgotPassword";
import ResetPasswordPage from "../pages/ResetPassword";
import AdminEventsByCityPage from "../pages/AdminEventsByCity";
import AdminCityEventsPage from "../pages/AdminCityEvents";
import PromotePage from "../pages/PromotePage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentCancelPage from "../pages/PaymentCancelPage";
import RulesPage from "../pages/RulesPage";

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
      { path: "/login", element: <LoginPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/auth/callback", element: <AuthCallbackPage /> },
      { path: "/promote/:id", element: <PromotePage /> },
      { path: "/payment-success", element: <PaymentSuccessPage /> },
      { path: "/payment-cancel", element: <PaymentCancelPage /> },
      { path: "/rules", element: <RulesPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/admin", element: <AdminDashboardPage /> },
          { path: "/admin/edit/:id", element: <AdminEditEventPage /> },
          { path: "/admin/categories", element: <AdminCategoriesPage /> },
          { path: "/admin/cities", element: <AdminCitiesPage /> },
          { path: "/admin/users", element: <AdminUsersPage /> },
          { path: "/admin/events-by-city", element: <AdminEventsByCityPage /> },
          {
            path: "/admin/events-by-city/:cityName",
            element: <AdminCityEventsPage />,
          },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
