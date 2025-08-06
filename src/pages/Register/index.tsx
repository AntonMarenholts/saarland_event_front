import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import type { RegisterData } from "../../types"; // <-- Импортируем тип

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>(); // <-- Указываем тип
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Указываем тип для 'data'
  const handleRegister = (data: RegisterData) => {
    setMessage("");
    setLoading(true);

    AuthService.register(data).then(
      (response) => {
        setMessage(response.data.message);
        setLoading(false);
        navigate("/login");
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-right mb-2">
        <Link to="/" className="text-gray-400 hover:text-white text-sm">
          &times; close
        </Link>
      </div>
      <form
        onSubmit={handleSubmit(handleRegister)}
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
            <p className="text-red-500 text-xs italic">Username is required.</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">
              A valid email is required.
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
            {...register("password", { required: true, minLength: 6 })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">
              Password must be at least 6 characters.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <Link
            to="/login"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Already have an account?
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
