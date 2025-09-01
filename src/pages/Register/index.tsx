import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import type { RegisterData } from "../../types";
import { EyeIcon, EyeSlashIcon } from "../../components/Icons";
import { useState, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleRegister = useCallback(
    async (data: RegisterData) => {
      if (!executeRecaptcha) {
        console.error("Recaptcha not available");
        return;
      }

      setMessage("");
      setLoading(true);

      const token = await executeRecaptcha("register");

      const dataWithToken = { ...data, recaptchaToken: token };

      AuthService.register(dataWithToken).then(
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
    },
    [executeRecaptcha, navigate]
  );

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
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            {...register("username", { required: true })}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
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
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline"
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

          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              {...register("password", { required: true, minLength: 6 })}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline pr-10" // Добавляем отступ справа
            />

            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white"
            >
              {passwordVisible ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
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
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <Link
            to="/login"
            className="inline-block align-baseline font-bold text-sm text-cyan-500 hover:text-cyan-400"
          >
            Already have an account?
          </Link>
        </div>
        {message && (
          <div className="mt-4">
            <div
              className={`p-4 mb-4 text-sm rounded-lg ${
                message.includes("successfully")
                  ? "text-green-200 bg-green-900 border border-green-500"
                  : "text-red-200 bg-red-900 border border-red-500"
              }`}
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
