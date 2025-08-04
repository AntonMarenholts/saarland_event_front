import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "../pages/Home";
import AdminDashboardPage from "../pages/AdminDashboard";
import EventDetailPage from "../pages/EventDetail";
import NotFoundPage from "../pages/NotFound";
import MainLayout from "../layout"; // <-- Импортируем наш Layout
import AdminEditEventPage from "../pages/AdminEditEvent";

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
       {
        path: "/admin/edit/:id",
        element: <AdminEditEventPage />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}