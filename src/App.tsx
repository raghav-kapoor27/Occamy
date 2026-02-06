import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Home } from "./pages/Home";
import { NatureShowcase } from "./pages/NatureShowcase";
import { Layout } from "./components/Layout";

// Admin Pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminMeetings } from "./pages/admin/AdminMeetings";
import { AdminSamples } from "./pages/admin/AdminSamples";
import { AdminSales } from "./pages/admin/AdminSales";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";

// Field Officer Pages
import { FieldDashboard } from "./pages/field/FieldDashboard";
import { MeetingLog } from "./pages/field/MeetingLog";
import { SampleDistribution } from "./pages/field/SampleDistribution";
import { SalesCapture } from "./pages/field/SalesCapture";

// Distributor Pages
import { DistributorDashboard } from "./pages/distributor/DistributorDashboard";
import { InventoryManagement } from "./pages/distributor/InventoryManagement";
import { SalesView } from "./pages/distributor/SalesView";
import { DistributorAnalytics } from "./pages/distributor/DistributorAnalytics";

// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: ("admin" | "field_officer" | "distributor")[];
}) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    switch (user.role) {
      case "admin":
        return <Navigate to="/admin" replace />;
      case "field_officer":
        return <Navigate to="/field" replace />;
      case "distributor":
        return <Navigate to="/distributor" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return <Layout>{children}</Layout>;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/nature" element={<NatureShowcase />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/meetings"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminMeetings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/samples"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSamples />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminSales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Field Officer Routes */}
        <Route
          path="/field"
          element={
            <ProtectedRoute allowedRoles={["field_officer"]}>
              <FieldDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/field/meetings"
          element={
            <ProtectedRoute allowedRoles={["field_officer"]}>
              <MeetingLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="/field/samples"
          element={
            <ProtectedRoute allowedRoles={["field_officer"]}>
              <SampleDistribution />
            </ProtectedRoute>
          }
        />
        <Route
          path="/field/sales"
          element={
            <ProtectedRoute allowedRoles={["field_officer"]}>
              <SalesCapture />
            </ProtectedRoute>
          }
        />

        {/* Distributor Routes */}
        <Route
          path="/distributor"
          element={
            <ProtectedRoute allowedRoles={["distributor"]}>
              <DistributorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/distributor/inventory"
          element={
            <ProtectedRoute allowedRoles={["distributor"]}>
              <InventoryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/distributor/sales"
          element={
            <ProtectedRoute allowedRoles={["distributor"]}>
              <SalesView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/distributor/analytics"
          element={
            <ProtectedRoute allowedRoles={["distributor"]}>
              <DistributorAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Legacy/Default Route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["admin", "field_officer", "distributor"]}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
