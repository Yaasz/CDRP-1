import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  User,
  Building2,
  Phone,
} from "lucide-react";

export default function SignupForm({ onSubmit, onSwitch }) {
  const [accountType, setAccountType] = useState("user");
  const [organizationType, setOrganizationType] = useState("charity");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupError, setSignupError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    name: "", // Organization name
    taxId: "",
    mission: "", // Mission statement
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(false);

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }

    // Additional validation for organization signup
    if (accountType === "organization") {
      if (signupData.name.length < 5) {
        setSignupError("Organization name must be at least 5 characters.");
        return;
      }

      if (!signupData.taxId) {
        setSignupError("Tax ID is required for organizations.");
        return;
      }

      if (
        signupData.mission &&
        (signupData.mission.length < 5 || signupData.mission.length > 100)
      ) {
        setSignupError(
          "Mission statement must be between 5 and 100 characters."
        );
        return;
      }
    }

    try {
      // For organizations, make sure to include taxId in the payload
      await onSubmit({
        ...signupData,
        accountType,
        role: organizationType, // Use 'role' to match backend expectation
      });
      setSignupSuccess(true);
      setSignupData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        name: "",
        taxId: "",
        mission: "",
      });
      setTimeout(() => {
        onSwitch();
        setSignupSuccess(false);
      }, 2000);
    } catch (err) {
      setSignupError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <>
      {/* Account type selection */}
      <div className="mb-6">
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

      {/* Individual signup form */}
      {accountType === "user" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Success/Error messages */}
          {signupSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              Account created successfully! Redirecting to login...
            </div>
          )}
          {signupError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {signupError}
            </div>
          )}

          {/* Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="signup-firstName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                First Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="signup-firstName"
                  name="firstName"
                  type="text"
                  required
                  value={signupData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="signup-lastName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Last Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="signup-lastName"
                  name="lastName"
                  type="text"
                  required
                  value={signupData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={signupData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Phone field */}
          <div>
            <label
              htmlFor="signup-phone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Phone size={18} className="text-gray-400" />
              </div>
              <input
                id="signup-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={signupData.phone}
                onChange={handleChange}
                placeholder="e.g., +1234567890"
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <LockKeyhole size={18} className="text-gray-400" />
                </div>
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={signupData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <LockKeyhole size={18} className="text-gray-400" />
                </div>
                <input
                  id="signup-confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={signupData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Create Account
          </button>
        </form>
      )}

      {/* Organization signup form */}
      {accountType === "organization" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Success/Error messages */}
          {signupSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              Account created successfully! Redirecting to login...
            </div>
          )}
          {signupError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {signupError}
            </div>
          )}

          {/* Organization name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Organization Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Building2 size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={signupData.name}
                onChange={handleChange}
                placeholder="Name of your organization"
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>
          </div>

          {/* Organization type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Organization Type
            </label>
            <div className="flex rounded-lg bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setOrganizationType("charity")}
                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  organizationType === "charity"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                Charity
              </button>
              <button
                type="button"
                onClick={() => setOrganizationType("government")}
                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                  organizationType === "government"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                Government
              </button>
            </div>
          </div>

          {/* Email and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={signupData.email}
                  onChange={handleChange}
                  placeholder="org@example.com"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-phone"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  id="signup-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={signupData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +1234567890"
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tax ID */}
          <div>
            <label
              htmlFor="taxId"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Tax ID / Registration Number
            </label>
            <input
              type="text"
              id="taxId"
              name="taxId"
              required
              value={signupData.taxId}
              onChange={handleChange}
              placeholder="Enter your organization's tax ID"
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>

          {/* Password fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <LockKeyhole size={18} className="text-gray-400" />
                </div>
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={signupData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="signup-confirmPassword"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <LockKeyhole size={18} className="text-gray-400" />
                </div>
                <input
                  id="signup-confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={signupData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mission statement */}
          <div>
            <label
              htmlFor="mission"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Mission Statement (Optional)
            </label>
            <textarea
              id="mission"
              name="mission"
              rows={3}
              value={signupData.mission}
              onChange={handleChange}
              placeholder="Briefly describe your organization's mission"
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            Create Organization Account
          </button>
        </form>
      )}

      {/* Switch to login */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </>
  );
}
