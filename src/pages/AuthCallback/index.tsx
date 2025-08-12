import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      AuthService.loginWithToken(token);

      navigate("/sync-user");
    } else {
      navigate("/");
    }
  }, [searchParams, navigate]);

  return <div className="text-white text-center">Processing login...</div>;
}
