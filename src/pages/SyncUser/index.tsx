import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../../api";

import { AuthContext } from "../../context/AuthContext";

export default function SyncUserPage() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const syncUser = async () => {
      try {
        const fullUserData = await fetchUserProfile();
        
        authContext?.login(fullUserData);
        
        navigate("/");
      } catch (error) {
        console.error("Failed to sync user data, logging out.", error);
        
        authContext?.logout();
        navigate("/login");
      }
    };

    syncUser();
  }, [navigate, authContext]);

  return <div className="text-white text-center">Synchronizing user...</div>;
}