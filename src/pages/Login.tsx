import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types";
import { Shield, Users, Truck, AlertCircle, Mail, Lock, Eye, EyeOff, Leaf, Sprout, TreeDeciduous, CheckCircle } from "lucide-react";
import { AuroraBackground } from "@/components/nature";

export function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, user, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    (searchParams.get("role") as UserRole) || null
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
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 dark:border-emerald-800/50 p-6 md:p-8">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 pointer-events-none" />

            {/* Logo and header */}
            <div className="text-center space-y-3 mb-6 relative">
              <div className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center">
                <img src="https://i.ibb.co/LDBc15Qp/Whats-App-Image-2026-02-06-at-11-16-41-PM-1.jpg" alt="Occamy Bioscience Logo" className="w-20 h-20 object-contain" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">Occamy Bioscience</h1>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sign In</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Select your role to continue</p>
            </div>

            {/* Role Selector & Form (kept same styles) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">I am a:</label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => { setSelectedRole(role.value); setError(""); }}
                      className={`h-20 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${isSelected ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-emerald-200 bg-white/50'}`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className={`text-xs font-medium ${isSelected ? 'text-emerald-700' : 'text-slate-600'}`}>{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
                  <input type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 h-12 bg-white border-2 border-emerald-200 rounded-xl px-4 text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" required />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-11 h-12 bg-white border-2 border-emerald-200 rounded-xl px-4 text-base focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>

              <div>
                <button type="submit" disabled={loading || !selectedRole} className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg">{loading ? 'Signing in...' : 'Sign In'}</button>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600">New user? <Link to={`/signup${selectedRole ? `?role=${selectedRole}` : ''}`} className="text-emerald-600 font-medium">Create an account</Link></p>
                <div className="mt-3"><Link to="/" className="text-sm text-slate-500">← Back to Home</Link></div>
              </div>
            </form>
          </div>

          {/* Right: hero content */}
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
                  alt="Login illustration"
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
