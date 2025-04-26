import { useState } from "react";
import { Eye, EyeOff, Mail, LockKeyhole } from "lucide-react";

export default function LoginForm({ onSubmit, onSwitch }) {
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
      await onSubmit({...loginData, accountType});
    } catch (err) {
      setLoginError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-2">Login As</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAccountType("user")}
            className={`flex-1 py-2 px-4 border rounded-md transition-colors duration-150 ${
              accountType === "user"
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setAccountType("organization")}
            className={`flex-1 py-2 px-4 border rounded-md transition-colors duration-150 ${
              accountType === "organization"
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Organization
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
          Email address
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
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">
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
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600"
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
        <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-800">
          Forgot your password?
        </button>
      </div>

      {loginError && (
        <div className="text-red-600 text-sm text-center p-2 bg-red-100 rounded-md">
          {loginError}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Login
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
} 