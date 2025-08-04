import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/Home";
import AdminDashboardPage from "../pages/AdminDashboard";
import EventDetailPage from "../pages/EventDetail";
import NotFoundPage from "../pages/NotFound";
import MainLayout from "../layout"; // <-- Импортируем наш Layout

const router = createBrowserRouter([
  {
    // Теперь MainLayout - это корневой элемент
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    // А все страницы становятся его дочерними элементами
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/events/:id",
        element: <EventDetailPage />,
      },
      {
        path: "/admin",
        element: <AdminDashboardPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}