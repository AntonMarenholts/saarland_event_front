import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import type { LoginData } from "../../types";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeSlashIcon } from "../../components/Icons";

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = (data: LoginData) => {
    setMessage("");
    setLoading(true);

    AuthService.login(data).then(
      () => {
        const user = AuthService.getCurrentUser();
        if (user && user.roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "https://saarland-events-api-ahtoh-102ce42017ef.herokuapp.com/oauth2/authorization/google";
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="text-right mb-2">
        <Link to="/" className="text-gray-400 hover:text-white text-sm">
          &times; close
        </Link>
      </div>

      <div className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 text-white">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full mb-4 bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          {t("login_with_google")}
        </button>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">
            {t("or_separator")}
          </span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="username"
            >
              {t("username_label")}
            </label>
            <input
              {...register("username", { required: true })}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic mt-1">
                {t("error_required_username")}
              </p>
            )}
          </div>
          <div>
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="password"
            >
              {t("password_label")}
            </label>
            {/* 3. Оборачиваем input и button в div */}
            <div className="relative">
              <input
                // 4. Тип инпута теперь динамический
                type={passwordVisible ? "text" : "password"}
                {...register("password", { required: true })}
                className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline pr-10" // Добавляем отступ справа для иконки
              />
              {/* 5. Кнопка для переключения видимости */}
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
              >
                {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs italic mt-1">
                {t("error_required_password")}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500"
            >
              {loading ? t("loading") : t("loginButton")}
            </button>
            <Link
              to="/register"
              className="inline-block align-baseline font-bold text-sm text-cyan-500 hover:text-cyan-400"
            >
              {t("create_account_link")}
            </Link>
          </div>
          {message && (
            <div
              className="mt-4 p-4 text-sm text-red-200 bg-red-900 border border-red-500 rounded-lg"
              role="alert"
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
