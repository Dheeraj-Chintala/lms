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
import CourseContentBuilder from "./pages/instructor/CourseContentBuilder";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// Manager Pages
import ManagerDashboard from "./pages/manager/ManagerDashboard";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";

// Certificate Pages
import VerifyCertificate from "./pages/VerifyCertificate";

// Internship Pages
import InternshipListPage from "./pages/internships/InternshipListPage";
import CreateInternship from "./pages/internships/CreateInternship";
import InternshipDetail from "./pages/internships/InternshipDetail";
import MyInternships from "./pages/internships/MyInternships";

// Instructor Panel Pages
import InstructorAnalytics from "./pages/instructor/InstructorAnalytics";
import InstructorStudents from "./pages/instructor/InstructorStudents";
import InstructorLiveClasses from "./pages/instructor/InstructorLiveClasses";
import InstructorAssignments from "./pages/instructor/InstructorAssignments";
import AdminCertificates from "./pages/admin/AdminCertificates";

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
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute allowedRoles={['student', 'corporate_hr', 'franchise', 'distributor', 'super_distributor', 'affiliate']}>
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
              <ProtectedRoute allowedRoles={['student', 'corporate_hr']}>
                <MyLearning />
              </ProtectedRoute>
            } />

            {/* Trainer/Mentor Routes */}
            <Route path="/my-courses" element={
              <ProtectedRoute allowedRoles={['trainer', 'mentor']}>
                <MyCourses />
              </ProtectedRoute>
            } />
            <Route path="/instructor/dashboard" element={
              <ProtectedRoute allowedRoles={['trainer', 'mentor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses" element={
              <ProtectedRoute allowedRoles={['trainer', 'mentor']}>
                <InstructorCourses />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/create" element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <CreateCourse />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/:id/edit" element={
              <ProtectedRoute allowedRoles={['trainer', 'mentor']}>
                <EditCourse />
              </ProtectedRoute>
            } />
            <Route path="/instructor/courses/:id/content" element={
              <ProtectedRoute allowedRoles={['trainer', 'mentor']}>
                <CourseContentBuilder />
              </ProtectedRoute>
            } />
            <Route path="/instructor/analytics" element={
              <ProtectedRoute allowedRoles={['trainer', 'mentor']}>
                <InstructorAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/instructor/students" element={
              <ProtectedRoute allowedRoles={['trainer', 'mentor']}>
                <InstructorStudents />
              </ProtectedRoute>
            } />
            <Route path="/instructor/live-classes" element={
              <ProtectedRoute allowedRoles={['trainer', 'mentor']}>
                <InstructorLiveClasses />
              </ProtectedRoute>
            } />
            <Route path="/instructor/assignments" element={
              <ProtectedRoute allowedRoles={['trainer', 'mentor']}>
                <InstructorAssignments />
              </ProtectedRoute>
            } />
            
            {/* Internship Routes */}
            <Route path="/internships" element={
              <ProtectedRoute>
                <InternshipListPage />
              </ProtectedRoute>
            } />
            <Route path="/internships/create" element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'trainer', 'mentor']}>
                <CreateInternship />
              </ProtectedRoute>
            } />
            <Route path="/internships/:id" element={
              <ProtectedRoute>
                <InternshipDetail />
              </ProtectedRoute>
            } />
            <Route path="/my-internships" element={
              <ProtectedRoute allowedRoles={['student']}>
                <MyInternships />
              </ProtectedRoute>
            } />
            
            {/* Public Certificate Verification */}
            <Route path="/verify/:id" element={<VerifyCertificate />} />
            
            {/* Admin Certificate Management */}
            <Route path="/admin/certificates" element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'sub_admin', 'trainer']}>
                <AdminCertificates />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'sub_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses" element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'sub_admin']}>
                <OrgCourses />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin', 'sub_admin']}>
                <OrgUsers />
              </ProtectedRoute>
            } />

            {/* Corporate HR / Manager Routes */}
            <Route path="/manager/dashboard" element={
              <ProtectedRoute allowedRoles={['corporate_hr']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />

            {/* Legacy Org Admin Routes (redirect to admin routes) */}
            <Route path="/org/overview" element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <OrgOverview />
              </ProtectedRoute>
            } />
            <Route path="/org/courses" element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
                <OrgCourses />
              </ProtectedRoute>
            } />
            <Route path="/org/users" element={
              <ProtectedRoute allowedRoles={['super_admin', 'admin']}>
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
