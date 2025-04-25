import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, LockKeyhole, User, Building2 } from "lucide-react";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState("user");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    taxId: "",
    missionStatement: "",
  });

  const handleLoginChange = (e) => {
    const { name, value, checked, type } = e.target;
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", loginData);
    alert("Login successful! (Mock)");
    navigate("/dashboard");
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(signupData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await axios.post(`${backendUrl}/api/user`, formData);

      console.log("Signup response:", response.data);

      alert("Account created successfully! Please log in.");
      setIsLoginView(true);
      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        organizationName: "",
        taxId: "",
        missionStatement: "",
      });
    } catch (error) {
      console.error("Signup error:", error);
      alert("There was an error creating your account. Please try again later.");
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
            backgroundSize: '24px 24px'
          }}></div>
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
              {isLoginView ? "Please sign in to your account" : "Join us today!"}
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
            <form onSubmit={handleLoginSubmit} className="space-y-6">
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
                    onChange={handleLoginChange}
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
                    onChange={handleLoginChange}
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
                    onChange={handleLoginChange}
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

              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </form>
          ) : (
            <>
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-700 mb-2">Select Account Type</div>
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

              <form onSubmit={handleSignupSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" id="firstName" name="firstName" required value={signupData.firstName} onChange={handleSignupChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required value={signupData.lastName} onChange={handleSignupChange} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Mail size={18} className="text-gray-400" /></div>
                    <input id="signup-email" name="email" type="email" autoComplete="email" required value={signupData.email} onChange={handleSignupChange} placeholder="Enter your email" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><LockKeyhole size={18} className="text-gray-400" /></div>
                      <input id="signup-password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required value={signupData.password} onChange={handleSignupChange} placeholder="Create a password" className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                      <button type="button" className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><LockKeyhole size={18} className="text-gray-400" /></div>
                      <input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} required value={signupData.confirmPassword} onChange={handleSignupChange} placeholder="Confirm your password" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                  </div>
                </div>

                {accountType === "organization" && (
                  <>
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Details</h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">Organization Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Building2 size={18} className="text-gray-400" /></div>
                            <input type="text" id="organizationName" name="organizationName" required value={signupData.organizationName} onChange={handleSignupChange} placeholder="Name of your organization" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID / Registration Number</label>
                          <input type="text" id="taxId" name="taxId" value={signupData.taxId} onChange={handleSignupChange} placeholder="(Optional)" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="missionStatement" className="block text-sm font-medium text-gray-700">Mission Statement</label>
                          <textarea id="missionStatement" name="missionStatement" rows={3} value={signupData.missionStatement} onChange={handleSignupChange} placeholder="Briefly describe your organization's mission (Optional)" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Account
                </button>
              </form>
            </>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLoginView ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLoginView(!isLoginView)}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {isLoginView ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
