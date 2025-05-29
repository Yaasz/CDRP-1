import { useState } from "react";
import { Eye, EyeOff, Mail, LockKeyhole } from "lucide-react";
import api from "../utils/api";

export default function LoginForm({ onSwitch, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [accountType, setAccountType] = useState("user");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    try {
      // Let the parent component handle login via onSubmit
      await onSubmit({ 
        ...loginData, 
        accountType 
      });
    } catch (err) {
      console.error("Login error:", err);
      // Provide user-friendly error message
      setLoginError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Account type selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Account Type
        </label>
        <div className="flex rounded-lg bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => setAccountType("user")}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              accountType === "user"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setAccountType("organization")}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
              accountType === "organization"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            Organization
          </button>
        </div>
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Mail size={18} className="text-gray-400" />
          </div>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={loginData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <LockKeyhole size={18} className="text-gray-400" />
          </div>
          <input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={loginData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Remember me and forgot password */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="rememberMe"
            type="checkbox"
            checked={loginData.rememberMe}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>
        <button 
          type="button" 
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Forgot password?
        </button>
      </div>

      {/* Error message */}
      {loginError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {loginError}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
      >
        Sign In
      </button>

      {/* Switch to signup */}
      <div className="text-center pt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Create account
          </button>
        </p>
      </div>
    </form>
  );
} 