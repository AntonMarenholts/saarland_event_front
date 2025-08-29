import { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import { AuthContext } from "../../context/AuthContext";
import { fetchUserProfile } from "../../api";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token");

      if (token && authContext) {
        
        AuthService.loginWithToken(token);
        
        try {
          
          const fullUserData = await fetchUserProfile();
          
          authContext.login(fullUserData);
          
          navigate("/");
        } catch (error) {
          console.error("Failed to sync user data, logging out.", error);
          authContext.logout();
          navigate("/login");
        }
      } else {
        
        navigate("/");
      }
    };

    handleAuth();
  }, [searchParams, navigate, authContext]);

  return <div className="text-white text-center">Processing login...</div>;
}