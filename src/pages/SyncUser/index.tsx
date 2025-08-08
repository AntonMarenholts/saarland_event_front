import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../api";
import AuthService from "../../services/auth.service";

export default function SyncUserPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = async () => {
      try {
        const fullUserData = await fetchUserProfile();
        localStorage.setItem("user", JSON.stringify(fullUserData));
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.error("Failed to sync user data, logging out.", error);
        AuthService.logout();
        navigate("/login");
      }
    };

    syncUser();
  }, [navigate]);

  return <div className="text-white text-center">Синхронизация пользователя...</div>;
}