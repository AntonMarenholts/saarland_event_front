import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../api";
import { EyeIcon, EyeSlashIcon } from "../../components/Icons";
import { isAxiosError } from "axios";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or missing reset token.");
    }
  }, [searchParams]);

  const resetPassword = async (
    token: string,
    password: string
  ): Promise<void> => {
    await apiClient.post(`/auth/reset-password?token=${token}`, { password });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await resetPassword(token, password);
      setMessage(t("password_reset_success"));
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Password reset failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto text-white">
      <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-6">{t("reset_password_title")}</h1>

        {error && <p className="mb-4 text-red-400">{error}</p>}
        {message && <p className="mb-4 text-green-400">{message}</p>}

        {!message && (
          <form onSubmit={handleSubmit}>
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              {t("new_password")}
            </label>
            <div className="relative">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline pr-10"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
              >
                {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500"
            >
              {loading ? t("loading") : t("save")}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
