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
import CourseDetails from "./pages/CourseDetails";
import CoursePlayer from "./pages/CoursePlayer";
import MyLearning from "./pages/MyLearning";
import MyCourses from "./pages/MyCourses";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Org Admin Pages
import OrgOverview from "./pages/org/OrgOverview";
import OrgCourses from "./pages/org/OrgCourses";
import OrgUsers from "./pages/org/OrgUsers";

// Instructor Pages
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import InstructorCourses from "./pages/instructor/InstructorCourses";
import CreateCourse from "./pages/instructor/CreateCourse";
import EditCourse from "./pages/instructor/EditCourse";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";

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

            {/* Student Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['learner']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute allowedRoles={['learner', 'manager']}>
                <BrowseCourses />
              </ProtectedRoute>
            } />
            <Route path="/courses/:id" element={
              <ProtectedRoute>
                <CourseDetails />
              </ProtectedRoute>
            } />
            <Route path="/courses/:courseId/learn" element={
              <ProtectedRoute>
                <CoursePlayer />
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
            <Route path="/instructor/dashboard" element={
              <ProtectedRoute allowedRoles={['instructor', 'content_creator']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses" element={
              <ProtectedRoute allowedRoles={['instructor', 'content_creator']}>
                <InstructorCourses />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/create" element={
              <ProtectedRoute allowedRoles={['instructor', 'content_creator']}>
                <CreateCourse />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/:id/edit" element={
              <ProtectedRoute allowedRoles={['instructor', 'content_creator']}>
                <EditCourse />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['org_admin', 'super_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute allowedRoles={['org_admin', 'super_admin']}>
                <OrgCourses />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['org_admin', 'super_admin']}>
                <OrgUsers />
              </ProtectedRoute>
            } />

            {/* Manager Routes */}
            <Route path="/manager/dashboard" element={
              <ProtectedRoute allowedRoles={['manager']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />

            {/* Legacy Org Admin Routes */}
            <Route path="/org/overview" element={
              <ProtectedRoute allowedRoles={['org_admin', 'super_admin']}>
                <OrgOverview />
              </ProtectedRoute>
            } />
            <Route path="/org/courses" element={
              <ProtectedRoute allowedRoles={['org_admin', 'super_admin']}>
                <OrgCourses />
              </ProtectedRoute>
            } />
            <Route path="/org/users" element={
              <ProtectedRoute allowedRoles={['org_admin', 'super_admin']}>
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
