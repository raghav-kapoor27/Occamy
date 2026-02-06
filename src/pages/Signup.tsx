import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import { Shield, Users, Truck, AlertCircle, Mail, Lock, User, Phone, MapPin, Leaf, Sprout, TreeDeciduous, CheckCircle } from "lucide-react";
import { AuroraBackground } from "@/components/nature";

export function Signup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup, user, isAuthenticated } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    (searchParams.get("role") as UserRole) || "field_officer"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const success = await signup(
        email,
        password,
        name,
        selectedRole,
        phone,
        state,
        district
      );

      if (success && user) {
        redirectBasedOnRole(user.role);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string; icon: typeof Shield; color: string }[] = [
    { value: "admin", label: "Admin", icon: Shield, color: "purple" },
    { value: "field_officer", label: "Field Officer", icon: Users, color: "emerald" },
    { value: "distributor", label: "Distributor", icon: Truck, color: "blue" },
  ];

  const states = [
    "Maharashtra",
    "Gujarat",
    "Rajasthan",
    "Punjab",
    "Haryana",
    "Uttar Pradesh",
    "Madhya Pradesh",
    "Karnataka",
  ];

  return (
    <AuroraBackground className="min-h-screen flex items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Animated nature background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-10 left-10 text-emerald-300/20 dark:text-emerald-700/20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf className="w-24 h-24" />
        </motion.div>
        <motion.div
          className="absolute top-40 right-20 text-green-300/20 dark:text-green-700/20"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Sprout className="w-32 h-32" />
        </motion.div>
        <motion.div
          className="absolute bottom-20 left-1/4 text-teal-300/20 dark:text-teal-700/20"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 3, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <TreeDeciduous className="w-28 h-28" />
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-1/3 text-emerald-300/20 dark:text-emerald-700/20"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Leaf className="w-20 h-20" />
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-emerald-400/30 dark:bg-emerald-600/30 rounded-full z-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full relative z-10 px-4"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: form card */}
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 dark:border-emerald-800/50 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
            <div className="text-center space-y-3 mb-6 relative">
              <div className="text-center space-y-3 mb-8 relative">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center"
                >
                  <img src="https://i.ibb.co/LDBc15Qp/Whats-App-Image-2026-02-06-at-11-16-41-PM-1.jpg" alt="Occamy Bioscience Logo" className="w-20 h-20 object-contain" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Occamy Bioscience
                  </h1>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 pt-2"
                >
                  Create Account
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-600 dark:text-slate-400 text-sm"
                >
                  Select your role and fill in your details
                </motion.p>
              </div>

              
            </div>
          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              I am a:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.value;
                return (
                  <motion.button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ scale: 1.02 }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 text-sm font-medium ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-emerald-600"}`} />
                    <span className="mt-1">{role.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Full Name input */}
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedInput === "name"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-11 h-12 bg-white/50 dark:bg-slate-800/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Email input */}
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedInput === "email"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-11 h-12 bg-white/50 dark:bg-slate-800/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Phone Number input */}
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedInput === "phone"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={() => setFocusedInput("phone")}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-11 h-12 bg-white/50 dark:bg-slate-800/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* State and District */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="relative"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  State
                </label>
                <div className="relative">
                  <MapPin
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedInput === "state"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  <select
                    className="w-full pl-11 h-12 bg-white/50 dark:bg-slate-800/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    onFocus={() => setFocusedInput("state")}
                    onBlur={() => setFocusedInput(null)}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  District
                </label>
                <div className="relative">
                  <MapPin
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                      focusedInput === "district"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="District"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    onFocus={() => setFocusedInput("district")}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full pl-11 h-12 bg-white/50 dark:bg-slate-800/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    required
                  />
                </div>
              </motion.div>
            </div>

            {/* Password input */}
            <motion.div
              className="relative"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                    focusedInput === "password"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  className="w-full pl-11 h-12 bg-white/50 dark:bg-slate-800/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Minimum 6 characters</p>
            </motion.div>

            {/* Create Account button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 dark:from-emerald-700 dark:to-green-700 dark:hover:from-emerald-600 dark:hover:to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center"
                    >
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Create Account
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>

            {/* Divider */}
            <div className="relative flex items-center py-3">
              <div className="flex-grow border-t border-emerald-200 dark:border-emerald-800" />
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to={`/login${selectedRole ? `?role=${selectedRole}` : ""}`}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-emerald-200 dark:border-emerald-800" />
            </div>

            {/* Back to home */}
            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              >
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>

        {/* Right: hero content (grid second column) */}
        <div className="order-first md:order-last text-center md:text-left px-4">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4">Streamline Your Field Operations</h3>
          <ul className="text-lg text-slate-600 mb-6 space-y-3 list-none">
            <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 mt-1" /> Track field activity</li>
            <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 mt-1" /> Verify visits & travel</li>
            <li className="flex items-start gap-3"><CheckCircle className="w-5 h-5 text-emerald-500 mt-1" /> Centralized admin dashboard</li>
          </ul>
          <div className="mt-6">
            <div className="w-full bg-emerald-50 rounded-xl p-6 shadow-inner">
              <img
                src="https://i.ibb.co/Xf238df3/Chat-GPT-Image-Feb-7-2026-12-37-38-AM.png"
                alt="Signup illustration"
                className="w-full h-56 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        </div>
      </motion.div>
    </AuroraBackground>
  );
}
