"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Users, Zap } from "lucide-react";
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
          name: signupData.name,
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
        {/* Left side - Form */}
        <div className="w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-12 py-12 relative z-10">
          <div className="w-full max-w-md">
            
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

        {/* Right side - Information panel */}
        <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='10' cy='10' r='2'/%3E%3Ccircle cx='50' cy='50' r='2'/%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center p-12 text-white">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-4">
                Community Disaster Response Platform
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of communities worldwide in building resilience and coordinating effective disaster response.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
                  <p className="text-blue-100">
                    Enterprise-grade security with 99.9% uptime ensures your data is safe and accessible when you need it most.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
                  <p className="text-blue-100">
                    Connect with volunteers, organizations, and emergency services to coordinate effective disaster response.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Real-time Response</h3>
                  <p className="text-blue-100">
                    AI-powered incident detection and real-time coordination tools reduce response time by up to 40%.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">150+</div>
                  <div className="text-sm text-blue-100">Communities</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-blue-100">Volunteers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-blue-100">Organizations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
