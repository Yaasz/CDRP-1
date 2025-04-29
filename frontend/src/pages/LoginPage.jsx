import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSubmit = async (loginData) => {
    console.log("Attempting login with:", loginData);

    try {
      // Determine which API endpoint to use based on account type
      const apiUrl =
        loginData.accountType === "user" ? `user/login` : `org/login`;

      console.log(`Sending login request to: ${apiUrl}`);
      console.log("login data", loginData);
      const response = await api.post(apiUrl, {
        identifier: loginData.email,
        password: loginData.password,
      });
      console.log("response", response);

      const data = response.data;

      if (data.token) {
        // Use the auth context to login
        login({
          token: data.token,
          accountType: loginData.accountType,
          user: loginData.accountType === "user" ? data.user : data.data, // org controller returns data object
        });

        console.log("Login successful, redirecting to dashboard.");
        navigate("/dashboard");
      } else {
        throw new Error("Login successful, but no token received.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  };

  const handleSignupSubmit = async (signupData) => {
    if (signupData.password !== signupData.confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    try {
      let apiUrl;
      let payload;

      if (signupData.accountType === "user") {
        apiUrl = `user`;
        payload = {
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          phone: signupData.phone,
          password: signupData.password,
        };
      } else {
        // Handle organization signup
        apiUrl = `org`;
        payload = {
          name: signupData.name,
          email: signupData.email,
          phone: signupData.phone,
          password: signupData.password,
          mission: signupData.mission,
          type: signupData.type, // charity or government
        };
      }

      console.log(`Attempting ${signupData.accountType} signup with:`, payload);
      console.log(`Sending signup request to: ${apiUrl}`);

      const response = await api.post(apiUrl, payload);
      const data = response.data;

      console.log("Signup successful:", data);
      return data;
    } catch (err) {
      console.error("Signup failed:", err);
      throw err;
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E\")",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {isLoginView ? "Welcome Back!" : "Join CDRP"}
          </h2>
          <p className="text-xl mb-8">
            {isLoginView
              ? "Sign in to continue your work with disaster response coordination."
              : "Create an account to start contributing to disaster response efforts."}
          </p>
          <div className="w-16 h-1 bg-white rounded-full opacity-50"></div>
        </div>
        <div className="absolute top-6 left-6">
          <Link
            to="/"
            className="p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors inline-flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="md:hidden mb-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span>Back to Homepage</span>
            </Link>
          </div>

          <div className="flex justify-center mb-6">
            <div className="text-blue-600 font-bold text-2xl">
              <span className="bg-blue-600 text-white p-1 rounded">CDRP</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">
              {isLoginView ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-gray-500">
              {isLoginView
                ? "Please sign in to your account"
                : "Join us today!"}
            </p>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={() => setIsLoginView(true)}
              className={`flex-1 py-2 px-4 font-medium rounded-md transition-colors duration-150 ${
                isLoginView
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLoginView(false)}
              className={`flex-1 py-2 px-4 font-medium rounded-md transition-colors duration-150 ${
                !isLoginView
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Sign Up
            </button>
          </div>

          {isLoginView ? (
            <LoginForm onSubmit={handleLoginSubmit} onSwitch={toggleView} />
          ) : (
            <SignupForm onSubmit={handleSignupSubmit} onSwitch={toggleView} />
          )}
        </div>
      </div>
    </div>
  );
}
