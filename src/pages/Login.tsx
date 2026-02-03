import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import { Shield, Users, Truck, AlertCircle } from "lucide-react";

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    (searchParams.get("role") as UserRole) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      redirectBasedOnRole(user.role);
    }
  }, [isAuthenticated, user]);

  const redirectBasedOnRole = (role: UserRole) => {
    switch (role) {
      case "admin":
        navigate("/admin");
        break;
      case "field_officer":
        navigate("/field");
        break;
      case "distributor":
        navigate("/distributor");
        break;
      default:
        navigate("/home");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!selectedRole) {
      setError("Please select your role");
      return;
    }

    setLoading(true);

    try {
      const success = await login(email, password, selectedRole);
      
      if (success && user) {
        redirectBasedOnRole(user.role);
      } else {
        setError("Invalid email or password, or role mismatch");
      }
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; icon: typeof Shield; color: string }[] = [
    { value: "admin", label: "Admin", icon: Shield, color: "purple" },
    { value: "field_officer", label: "Field Officer", icon: Users, color: "emerald" },
    { value: "distributor", label: "Distributor", icon: Truck, color: "blue" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md shadow-xl border border-gray-100">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="text-2xl font-bold text-gray-800">Occamy Bioscience</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800">Sign In</h1>
        <p className="text-center text-gray-600 mb-6 text-sm">Select your role to continue</p>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            I am a:
          </label>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.value;
              const colorClasses = {
                purple: isSelected
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 bg-white",
                emerald: isSelected
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 hover:border-gray-300 bg-white",
                blue: isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white",
              };
              const iconColorClasses = {
                purple: isSelected ? "text-purple-600" : "text-gray-400",
                emerald: isSelected ? "text-emerald-600" : "text-gray-400",
                blue: isSelected ? "text-blue-600" : "text-gray-400",
              };
              const textColorClasses = {
                purple: isSelected ? "text-purple-700" : "text-gray-600",
                emerald: isSelected ? "text-emerald-700" : "text-gray-600",
                blue: isSelected ? "text-blue-700" : "text-gray-600",
              };
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role.value);
                    setError("");
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${colorClasses[role.color as keyof typeof colorClasses]}`}
                >
                  <Icon
                    className={`w-6 h-6 mx-auto mb-2 ${iconColorClasses[role.color as keyof typeof iconColorClasses]}`}
                  />
                  <p
                    className={`text-xs font-medium ${textColorClasses[role.color as keyof typeof textColorClasses]}`}
                  >
                    {role.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !selectedRole}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold text-base hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          New user?{" "}
          <Link
            to={`/signup${selectedRole ? `?role=${selectedRole}` : ""}`}
            className="text-emerald-600 font-semibold hover:text-emerald-700"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-gray-700 text-center block"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
