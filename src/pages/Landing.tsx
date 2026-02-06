import { Link } from "react-router-dom";
import { Shield, Users, Truck, ArrowRight, CheckCircle, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/nature";
import { FractalTreeCanvas } from "@/components/nature/FractalTreeCanvas";
import { FloatingLeaf } from "@/components/nature/FloatingLeaf";

export function Landing() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
        transition: {
          delay: i * 0.2 + 1.5,
          duration: 0.8,
        },
    }),
  };

  return (
    <AuroraBackground className="min-h-screen">
      {/* Hero Section with Nature Theme */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <FractalTreeCanvas />

        {[...Array(8)].map((_, i) => (
          <FloatingLeaf key={i} delay={i * 2} />
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 via-transparent to-transparent z-10"></div>

        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-30 container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <div className="w-14 h-14 bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-lg flex items-center justify-center">
              <img src="https://i.ibb.co/LDBc15Qp/Whats-App-Image-2026-02-06-at-11-16-41-PM-1.jpg" alt="Occamy Bioscience Logo" className="w-14 h-14 object-contain" />
              </div>
              <span className="text-2xl font-bold text-white">Occamy Bioscience</span>
            </div>
            <Link
              to="/login"
              className="px-4 py-2 text-white font-medium hover:text-white bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-all"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-20 text-center p-6 w-full">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 backdrop-blur-sm"
          >
            <Wind className="h-4 w-4 text-emerald-300" />
            <span className="text-sm font-medium text-white">
              Field Operations Platform
            </span>
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-emerald-100 to-emerald-400"
          >
            Field Operations Tracking &<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-emerald-200 to-emerald-500">
              Distribution Management
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto text-lg md:text-xl text-emerald-100 mb-8"
          >
            Streamline your agricultural operations with real-time tracking, 
            sample distribution, and sales management for rural field teams.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-4 mb-12 text-sm text-white"
          >
            <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm px-3 py-2 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Real-time GPS Tracking</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm px-3 py-2 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Mobile-First Design</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm px-3 py-2 rounded-full border border-emerald-500/20">
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Offline Capable</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Role-Based CTAs Section */}
      <section className="relative z-20 pb-20 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
            {/* Field Officer Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5 }}
            >
              <Link
                to="/login?role=field_officer"
                className="group bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-emerald-500/20 hover:border-emerald-500/50 block"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors">
                  <Users className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Field Officer</h3>
                <p className="text-gray-600 mb-6">
                  Log meetings, distribute samples, and record sales on the go. 
                  Optimized for mobile devices in rural areas.
                </p>
                <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Login as Field Officer</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>

            {/* Distributor Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.7 }}
            >
              <Link
                to="/login?role=distributor"
                className="group bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-500/20 hover:border-blue-500/50 block"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                  <Truck className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Distributor Portal</h3>
                <p className="text-gray-600 mb-6">
                  Manage inventory, track distributions, and view sales analytics. 
                  Simple interface for efficient operations.
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Access Distributor Portal</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>

            {/* Admin Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.9 }}
            >
              <Link
                to="/login?role=admin"
                className="group bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-purple-500/20 hover:border-purple-500/50 block"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors">
                  <Shield className="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Admin Dashboard</h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive analytics, user management, and oversight of all 
                  field operations. Desktop-optimized interface.
                </p>
                <div className="flex items-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Login as Admin</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-20 pb-20 bg-emerald-950/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <Shield className="w-6 h-6 text-emerald-300" />
              </div>
              <h4 className="font-semibold text-emerald-100 mb-2">Secure & Reliable</h4>
              <p className="text-sm text-emerald-200/80">Enterprise-grade security for your data</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                <Users className="w-6 h-6 text-blue-300" />
              </div>
              <h4 className="font-semibold text-emerald-100 mb-2">Role-Based Access</h4>
              <p className="text-sm text-emerald-200/80">Tailored interfaces for each user type</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                <Truck className="w-6 h-6 text-purple-300" />
              </div>
              <h4 className="font-semibold text-emerald-100 mb-2">Real-Time Tracking</h4>
              <p className="text-sm text-emerald-200/80">Monitor operations as they happen</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-emerald-500/20 mt-20 bg-emerald-950/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-white text-sm font-medium">
          <p>© 2026 Occamy Bioscience. All rights reserved.</p>
        </div>
      </footer>
    </AuroraBackground>
  );
}
