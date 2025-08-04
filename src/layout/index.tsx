import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-8">
        {/* Сюда react-router-dom будет подставлять нужную страницу */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}