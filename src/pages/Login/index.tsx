import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import type { LoginData } from "../../types"; // <-- Импортируем тип

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>(); // <-- Указываем тип
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Указываем тип для 'data'
  const handleLogin = (data: LoginData) => {
    setMessage("");
    setLoading(true);

    AuthService.login(data).then(
      () => {
        navigate("/admin");
        window.location.reload();
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

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="text-right mb-2">
        <Link to="/" className="text-gray-400 hover:text-white text-sm">
          &times; close
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Остальная часть формы без изменений */}
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            {...register("username", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic">
              Please enter your username.
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              Please enter your password.
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <Link
            to="/register"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Create an Account
          </Link>
        </div>

        {message && (
          <div className="mt-4">
            <div
              className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {message}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
