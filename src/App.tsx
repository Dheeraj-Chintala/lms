import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BrowseCourses from "./pages/BrowseCourses";
import MyLearning from "./pages/MyLearning";
import MyCourses from "./pages/MyCourses";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Org Admin Pages
import OrgOverview from "./pages/org/OrgOverview";
import OrgCourses from "./pages/org/OrgCourses";
import OrgUsers from "./pages/org/OrgUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Common Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />

            {/* Learner/Manager Routes */}
            <Route path="/courses" element={
              <ProtectedRoute allowedRoles={['learner', 'manager']}>
                <BrowseCourses />
              </ProtectedRoute>
            } />
            <Route path="/my-learning" element={
              <ProtectedRoute allowedRoles={['learner', 'manager']}>
                <MyLearning />
              </ProtectedRoute>
            } />

            {/* Instructor Routes */}
            <Route path="/my-courses" element={
              <ProtectedRoute allowedRoles={['instructor', 'content_creator']}>
                <MyCourses />
              </ProtectedRoute>
            } />

            {/* Org Admin Routes (Read-only) */}
            <Route path="/org/overview" element={
              <ProtectedRoute allowedRoles={['org_admin']}>
                <OrgOverview />
              </ProtectedRoute>
            } />
            <Route path="/org/courses" element={
              <ProtectedRoute allowedRoles={['org_admin']}>
                <OrgCourses />
              </ProtectedRoute>
            } />
            <Route path="/org/users" element={
              <ProtectedRoute allowedRoles={['org_admin']}>
                <OrgUsers />
              </ProtectedRoute>
            } />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
