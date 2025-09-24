import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/auth.service";
import type { RegisterData } from "../../types";
import { EyeIcon, EyeSlashIcon } from "../../components/Icons";
import { useState, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setError, 
    formState: { errors },
  } = useForm<RegisterData>();
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState(""); 
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleRegister = useCallback(
    async (data: RegisterData) => {
      if (!executeRecaptcha) {
        setGeneralError("Recaptcha service is not available.");
        return;
      }

      setGeneralError("");
      setLoading(true);

      try {
        const token = await executeRecaptcha("register");
        const dataWithToken = { ...data, recaptchaToken: token };

        await AuthService.register(dataWithToken);
        
        navigate("/login?registered=true");

      } catch (error) {
        if (isAxiosError(error) && error.response) {
          const errorData = error.response.data;
          
          if (errorData.message) {
            setGeneralError(errorData.message);
          } 
          
          else if (typeof errorData === 'object') {
             Object.keys(errorData).forEach((field) => {
                setError(field as keyof RegisterData, {
                    type: 'server',
                    message: errorData[field]
                });
            });
          }
        } else {
          setGeneralError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [executeRecaptcha, navigate, setError]
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
            {...register("username", { 
                required: "Username is required.",
                minLength: { value: 3, message: "Username must be at least 3 characters." },
                maxLength: { value: 20, message: "Username must be at most 20 characters." }
            })}
            className={`shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.username && (
            <p className="text-red-500 text-xs italic mt-1">{errors.username.message}</p>
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
            {...register("email", { 
                required: "Email is required.", 
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address."}
            })}
            className={`shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : 'border-gray-600'}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>
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
              {...register("password", { 
                  required: "Password is required.", 
                  minLength: { value: 6, message: "Password must be at least 6 characters."}
                })}
              className={`shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline pr-10 ${errors.password ? 'border-red-500' : 'border-gray-600'}`}
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
            <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>
          )}
        </div>
        
        {generalError && (
          <div className="p-4 mb-4 text-sm text-red-200 bg-red-900 border border-red-500 rounded-lg" role="alert">
              {generalError}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-500"
          >
            {loading ? t("loading") : t("signup")}
          </button>
          <Link
            to="/login"
            className="inline-block align-baseline font-bold text-sm text-cyan-500 hover:text-cyan-400"
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}