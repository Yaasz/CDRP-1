import { useState } from "react";
import { Eye, EyeOff, Mail, LockKeyhole, User, Building2, Phone } from "lucide-react";

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
    name: "",          // Changed from organizationName to match backend
    taxId: "",
    mission: "",       // Changed from missionStatement to match backend
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

    try {
      await onSubmit({...signupData, accountType, type: organizationType});
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

      {accountType === "user" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {signupSuccess && (
            <div className="text-green-600 text-sm text-center p-2 bg-green-100 rounded-md mb-4">
              Account created successfully! Redirecting to login...
            </div>
          )}
          {signupError && (
            <div className="text-red-600 text-sm text-center p-2 bg-red-100 rounded-md mb-4">
              {signupError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="signup-firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><User size={18} className="text-gray-400" /></div>
                <input id="signup-firstName" name="firstName" type="text" required value={signupData.firstName} onChange={handleChange} placeholder="John" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="signup-lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><User size={18} className="text-gray-400" /></div>
                <input id="signup-lastName" name="lastName" type="text" required value={signupData.lastName} onChange={handleChange} placeholder="Doe" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Mail size={18} className="text-gray-400" /></div>
              <input id="signup-email" name="email" type="email" autoComplete="email" required value={signupData.email} onChange={handleChange} placeholder="you@example.com" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Phone size={18} className="text-gray-400" /></div>
              <input id="signup-phone" name="phone" type="tel" autoComplete="tel" required value={signupData.phone} onChange={handleChange} placeholder="e.g., +1234567890" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><LockKeyhole size={18} className="text-gray-400" /></div>
              <input id="signup-password" name="password" type={showPassword ? "text" : "password"} required value={signupData.password} onChange={handleChange} placeholder="Enter password" className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><LockKeyhole size={18} className="text-gray-400" /></div>
              <input id="signup-confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={signupData.confirmPassword} onChange={handleChange} placeholder="Confirm password" className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="w-full py-3 px-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Account
          </button>
        </form>
      )}

      {accountType === "organization" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {signupSuccess && (
            <div className="text-green-600 text-sm text-center p-2 bg-green-100 rounded-md mb-4">
              Account created successfully! Redirecting to login...
            </div>
          )}
          {signupError && (
            <div className="text-red-600 text-sm text-center p-2 bg-red-100 rounded-md mb-4">
              {signupError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="signup-firstName" className="block text-sm font-medium text-gray-700">Admin First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><User size={18} className="text-gray-400" /></div>
                <input id="signup-firstName" name="firstName" type="text" required value={signupData.firstName} onChange={handleChange} placeholder="John" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <label htmlFor="signup-lastName" className="block text-sm font-medium text-gray-700">Admin Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><User size={18} className="text-gray-400" /></div>
                <input id="signup-lastName" name="lastName" type="text" required value={signupData.lastName} onChange={handleChange} placeholder="Doe" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Mail size={18} className="text-gray-400" /></div>
              <input id="signup-email" name="email" type="email" autoComplete="email" required value={signupData.email} onChange={handleChange} placeholder="org@example.com" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Phone size={18} className="text-gray-400" /></div>
              <input id="signup-phone" name="phone" type="tel" autoComplete="tel" required value={signupData.phone} onChange={handleChange} placeholder="e.g., +1234567890" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><LockKeyhole size={18} className="text-gray-400" /></div>
              <input id="signup-password" name="password" type={showPassword ? "text" : "password"} required value={signupData.password} onChange={handleChange} placeholder="Enter password" className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><LockKeyhole size={18} className="text-gray-400" /></div>
              <input id="signup-confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={signupData.confirmPassword} onChange={handleChange} placeholder="Confirm password" className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              <button type="button" className="absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-gray-600" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Details</h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Organization Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Building2 size={18} className="text-gray-400" /></div>
                  <input type="text" id="name" name="name" required value={signupData.name} onChange={handleChange} placeholder="Name of your organization" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="orgType" className="block text-sm font-medium text-gray-700">Organization Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrganizationType("charity")}
                    className={`flex-1 py-2 px-4 border rounded-md transition-colors duration-150 ${
                      organizationType === "charity"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Charity
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrganizationType("government")}
                    className={`flex-1 py-2 px-4 border rounded-md transition-colors duration-150 ${
                      organizationType === "government"
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Government
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">Tax ID / Registration Number</label>
                <input type="text" id="taxId" name="taxId" value={signupData.taxId} onChange={handleChange} placeholder="(Optional)" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div className="space-y-2">
                <label htmlFor="mission" className="block text-sm font-medium text-gray-700">Mission Statement</label>
                <textarea id="mission" name="mission" rows={3} value={signupData.mission} onChange={handleChange} placeholder="Briefly describe your organization's mission (Optional)" className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full py-3 px-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Account
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Login
          </button>
        </p>
      </div>
    </>
  );
} 