"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Check } from "lucide-react";
import { orbitron, roboto } from "@/fonts/fonts";
import Image from "next/image";
const ExploreSignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "Robert Fox",
      email: "robert.fox@gmail.com",
      password: "",
    },
  });

  const password = watch("password");

  // Simple password strength checker
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength < 3) return { strength, label: "Weak", color: "bg-red-500" };
    if (strength < 4)
      return { strength, label: "Medium", color: "bg-yellow-500" };
    return { strength, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: any) => {
    try {
      console.log("Form submitted:", data);
      console.log("Remember me:", rememberMe);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Handle successful submission
      alert("Registration successful!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Registration failed. Please try again.");
    }
  };

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
              REGISTER
            </h1>
            <p className={` ${roboto.className} text-gray-200 text-md`}>
              This is the start of something good.
            </p>
          </div>

          {/* Toggle Buttons */}
          <div
            style={{ padding: "2px" }}
            className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
          >
            <div className="flex bg-[#591741] rounded-full p-1">
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                  !isLogin
                    ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500  text-white shadow-sm"
                    : "text-white hover:text-gray-100 cursor-pointer"
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                  isLogin
                    ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-sm"
                    : "text-white hover:text-gray-100 cursor-pointer"
                }`}
              >
                Login
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="off"
          >
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-100 mb-2">
                Username
              </label>
              <input
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Username can only contain letters, numbers, and underscores",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none  ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your username"
                autoComplete="off"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

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
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Your email address"
                autoComplete="off"
              />
              {errors.email && (
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
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    validate: {
                      hasUpperCase: (value) =>
                        /[A-Z]/.test(value) ||
                        "Password must contain at least one uppercase letter",
                      hasLowerCase: (value) =>
                        /[a-z]/.test(value) ||
                        "Password must contain at least one lowercase letter",
                      hasNumber: (value) =>
                        /\d/.test(value) ||
                        "Password must contain at least one number",
                      hasSpecialChar: (value) =>
                        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                        "Password must contain at least one special character",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-24 border rounded-lg focus:outline-none  ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Your password"
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-100 hover:text-gray-200"
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
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.strength / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center space-x-2"
              >
                <div
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    rememberMe
                      ? "bg-purple-600 border-purple-600"
                      : "border-gray-100"
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-gray-100">Remember me</span>
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 cursor-pointer transition-all bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-medium rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200 focus:outline-none ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating Account..." : "Get Started"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExploreSignupForm;
