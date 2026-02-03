import { Link } from "react-router-dom";
import { Shield, Users, Truck, ArrowRight, CheckCircle } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">Occamy Bioscience</span>
          </div>
          <Link
            to="/login"
            className="px-4 py-2 text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Field Operations Tracking &<br />
            <span className="text-emerald-600">Distribution Management</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Streamline your agricultural operations with real-time tracking, 
            sample distribution, and sales management for rural field teams.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Real-time GPS Tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Mobile-First Design</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Offline Capable</span>
            </div>
          </div>
        </div>

        {/* Role-Based CTAs */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          {/* Field Officer Card */}
          <Link
            to="/login?role=field_officer"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500"
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

          {/* Distributor Card */}
          <Link
            to="/login?role=distributor"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500"
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

          {/* Admin Card */}
          <Link
            to="/login?role=admin"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500"
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
        </div>

        {/* Features Section */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Secure & Reliable</h4>
            <p className="text-sm text-gray-600">Enterprise-grade security for your data</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Role-Based Access</h4>
            <p className="text-sm text-gray-600">Tailored interfaces for each user type</p>
          </div>
          <div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Real-Time Tracking</h4>
            <p className="text-sm text-gray-600">Monitor operations as they happen</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 text-sm">
          <p>© 2024 Occamy Bioscience. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
