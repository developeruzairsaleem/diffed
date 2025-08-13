"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Check } from "lucide-react";
import { orbitron, roboto } from "@/fonts/fonts";
import Image from "next/image";
import { login } from "@/actions/auth";
import { useRouter } from "next/navigation";
type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const password = watch("password");

  const onSubmit = handleSubmit(async (data: FormValues) => {
    try {
      setSubmitting(true);
      setServerError("");
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const response = await login("state", formData); // ✅ This will update `state`
      if (response?.errors?.message) {
        return setServerError(response?.errors?.message);
      }
      if (response?.user) {
        return response?.user?.role === "customer"
          ? router.push("/dashboard/customer")
          : router.push("/dashboard/provider");
      }
    } catch (error) {
      console.error("something went wront", error);
      setServerError("Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        style={{ padding: "2px" }}
        className="w-full bg-gradient-to-r rounded-2xl from-pink-500 via-purple-500 to-cyan-500 max-w-md"
      >
        <div className="bg-[#591741] rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex my-5 justify-center mx-auto">
              <Image
                src="/logo/logo.png"
                alt="Logo"
                width={100}
                height={100}
                objectFit="cover"
              />
            </div>
            <h1
              className={`text-2xl font-bold text-white ${orbitron.className}`}
            >
              Login
            </h1>
            <p className={` ${roboto.className} text-gray-200 text-md`}>
              Welcome back
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">
                Email
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                })}
                type="email"
                className={`w-full px-4 py-3 text-black border rounded-lg focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your email address"
                autoComplete="off"
              />
              {errors?.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-24 border text-black rounded-lg focus:outline-none  ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your password"
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-black"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <p className="text-red-500 text-sm mt-2 mb-2">{serverError}</p>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-4 cursor-pointer transition-all bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 focus:outline-none ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Signing in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
