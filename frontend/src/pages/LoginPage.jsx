"use client";

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
  const { login, isAuthenticated, user } = useAuth();

  console.log(
    "LoginPage render - isAuthenticated:",
    isAuthenticated,
    "user:",
    user
  );

  // Redirect if already authenticated
  useEffect(() => {
    console.log(
      "LoginPage useEffect - isAuthenticated:",
      isAuthenticated,
      "user:",
      user
    );

    if (isAuthenticated) {
      console.log("User is authenticated, redirecting based on role");

      // Get the most up-to-date values from localStorage
      const accountType = localStorage.getItem("accountType");
      const userRole = localStorage.getItem("userRole");

      console.log(
        "Redirection data - accountType:",
        accountType,
        "userRole:",
        userRole,
        "user:",
        user
      );

      try {
        if (accountType === "organization") {
          // For organizations, use user.role directly
          const orgRole = user ? user.role : null;

          console.log("Organization login detected, role:", orgRole);

          if (orgRole === "charity") {
            console.log("Redirecting to charity dashboard");
            navigate("/charity");
          } else if (orgRole === "government") {
            console.log("Redirecting to government dashboard");
            navigate("/government");
          } else {
            console.error("Unknown organization role:", orgRole);
            console.log("Redirecting to default dashboard (fallback)");
            navigate("/dashboard");
          }
        } else {
          // For regular users
          // First check user object, then fallback to localStorage
          const role = user ? user.role : userRole;

          console.log("User login detected, role:", role);

          if (role === "admin") {
            console.log("Redirecting to admin dashboard");
            navigate("/admin");
          } else if (role === "user") {
            console.log("Redirecting to user dashboard");
            navigate("/dashboard");
          } else {
            console.error("Unknown user role:", role);
            console.log("Redirecting to default dashboard (fallback)");
            navigate("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error during redirection:", error);
        // Fallback to dashboard on error
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, navigate, user]);

  // Avoid having LoginForm handle any navigation
  const handleLoginSubmit = async (loginData) => {
    console.log("Attempting login with:", loginData);

    try {
      // Determine which API endpoint to use based on account type
      const apiUrl =
        loginData.accountType === "user" ? `/user/login` : `/org/login`;

      console.log(`Sending login request to: ${apiUrl}`);

      const response = await api.post(apiUrl, {
        identifier: loginData.email,
        password: loginData.password,
      });

      const data = response.data;
      console.log("Login response data:", data);

      if (data.token) {
        console.log("Received token, calling login function from context");

        // Extract user data correctly based on account type
        if (loginData.accountType === "user") {
          // Handle user login response
          if (!data.user?.role) {
            console.error("User role not found in response:", data);
            throw new Error("User role information is missing");
          }

          const userData = {
            ...data.user,
            id: data.user.id,
            role: data.user.role,
          };

          console.log("Extracted user data:", userData);

          // Call the login function from AuthContext
          login({
            token: data.token,
            accountType: loginData.accountType,
            user: userData,
          });
        } else {
          // Handle organization login response
          if (!data.data?.role) {
            console.error("Organization role not found in response:", data);
            throw new Error("Organization role information is missing");
          }

          const orgData = {
            ...data.data,
            id: data.data.id || data.data._id,
            role: data.data.role,
          };

          console.log("Extracted organization data:", orgData);

          // Call the login function from AuthContext
          login({
            token: data.token,
            accountType: loginData.accountType,
            user: orgData,
          });
        }

        console.log(
          "Login context function called, state should update and trigger useEffect"
        );
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
        // Handle organization signup - only include required fields
        apiUrl = `org`;
        payload = {
          organizationName: signupData.organizationName,
          email: signupData.email,
          phone: signupData.phone,
          password: signupData.password,
          taxId: signupData.taxId,
          mission: signupData.mission || "", // Make sure mission is at least empty string
          role: signupData.role, // This matches the backend model 'role' field
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 right-20 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 right-40 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="flex min-h-screen">
        {/* Full width form container */}
        <div className="w-full flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 relative z-10">
          <div className="w-full max-w-lg">
            
            {/* Back to home link */}
            <Link
              to="/"
              className="inline-flex items-center text-blue-700 hover:text-blue-800 mb-8 transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Homepage</span>
            </Link>

            {/* Login card */}
            <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 p-8">
              
              {/* Logo and branding */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                  <span className="text-white font-bold text-2xl">C</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to CDRP
                </h1>
                <p className="text-gray-600">
                  {isLoginView
                    ? "Sign in to access your dashboard"
                    : "Create your account to get started"}
                </p>
              </div>

              {/* Login/Signup toggle */}
              <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
                <button
                  type="button"
                  onClick={() => setIsLoginView(true)}
                  className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all duration-200 ${
                    isLoginView
                      ? "bg-white text-blue-700 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoginView(false)}
                  className={`flex-1 py-3 px-4 font-semibold rounded-lg transition-all duration-200 ${
                    !isLoginView
                      ? "bg-white text-blue-700 shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form content */}
              {isLoginView ? (
                <LoginForm onSubmit={handleLoginSubmit} onSwitch={toggleView} />
              ) : (
                <SignupForm onSubmit={handleSignupSubmit} onSwitch={toggleView} />
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                By continuing, you agree to our{" "}
                <Link to="/terms" className="text-blue-700 hover:text-blue-800 font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-700 hover:text-blue-800 font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
