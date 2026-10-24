import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Pages
import { Home } from '../pages/public/Home';
import { AboutUs } from '../pages/public/AboutUs';
import { Courses } from '../pages/public/Courses';
import { CourseDetails } from '../pages/public/CourseDetails';
import { NotesResources } from '../pages/public/NotesResources';
import { Projects } from '../pages/public/Projects';
import { Jobs } from '../pages/public/Jobs';
import { Internships } from '../pages/public/Internships';
import { OpportunityDetails } from '../pages/public/OpportunityDetails';
import { Careers } from '../pages/public/Careers';
import { Mentorship } from '../pages/public/Mentorship';
import { Services } from '../pages/public/Services';
import { Contact } from '../pages/public/Contact';
import { PrivacyPolicy, TermsConditions } from '../pages/public/LegalPages';
import { Unauthorized, NotFound } from '../pages/public/ErrorPages';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { MyCourses } from '../pages/student/MyCourses';
import { MyApplications } from '../pages/student/MyApplications';
import { SavedOpportunities } from '../pages/student/SavedOpportunities';
import { StudentProfile } from '../pages/student/StudentProfile';
import { ResumeManager } from '../pages/student/ResumeManager';

// Manager & Admin Dashboards
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ContentDashboard } from '../pages/content-manager/ContentDashboard';
import { PlacementDashboard } from '../pages/placement-manager/PlacementDashboard';
import { SupportDashboard } from '../pages/support-manager/SupportDashboard';
import { FinanceDashboard } from '../pages/finance-manager/FinanceDashboard';

// Helper component to route to the user's appropriate workspace
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case ROLES.ADMIN:
      return <Navigate to="/admin/dashboard" replace />;
    case ROLES.CONTENT_MANAGER:
      return <Navigate to="/content-manager/dashboard" replace />;
    case ROLES.PLACEMENT_MANAGER:
      return <Navigate to="/placement-manager/dashboard" replace />;
    case ROLES.SUPPORT_MANAGER:
      return <Navigate to="/support-manager/dashboard" replace />;
    case ROLES.FINANCE_MANAGER:
      return <Navigate to="/finance-manager/dashboard" replace />;
    case ROLES.STUDENT:
    default:
      return <Navigate to="/student/dashboard" replace />;
  }
};

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/notes" element={<NotesResources />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<OpportunityDetails />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:id" element={<OpportunityDetails />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Global Dashboard Redirect */}
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* Student Workspace */}
      <Route element={<DashboardLayout allowedRoles={[ROLES.STUDENT, ROLES.ADMIN]} />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/courses" element={<MyCourses />} />
        <Route path="/student/applications" element={<MyApplications />} />
        <Route path="/student/saved" element={<SavedOpportunities />} />
        <Route path="/student/resources" element={<NotesResources />} />
        <Route path="/student/resume" element={<ResumeManager />} />
        <Route path="/student/profile" element={<StudentProfile />} />
      </Route>

      {/* Admin Workspace */}
      <Route element={<DashboardLayout allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminDashboard />} />
        <Route path="/admin/courses" element={<ContentDashboard />} />
        <Route path="/admin/opportunities" element={<PlacementDashboard />} />
        <Route path="/admin/applications" element={<PlacementDashboard />} />
        <Route path="/admin/enquiries" element={<SupportDashboard />} />
        <Route path="/admin/finance" element={<FinanceDashboard />} />
        <Route path="/admin/staff" element={<AdminDashboard />} />
      </Route>

      {/* Content Manager Workspace */}
      <Route element={<DashboardLayout allowedRoles={[ROLES.CONTENT_MANAGER, ROLES.ADMIN]} />}>
        <Route path="/content-manager/dashboard" element={<ContentDashboard />} />
        <Route path="/content-manager/courses" element={<ContentDashboard />} />
        <Route path="/content-manager/notes" element={<ContentDashboard />} />
        <Route path="/content-manager/projects" element={<ContentDashboard />} />
      </Route>

      {/* Placement Manager Workspace */}
      <Route element={<DashboardLayout allowedRoles={[ROLES.PLACEMENT_MANAGER, ROLES.ADMIN]} />}>
        <Route path="/placement-manager/dashboard" element={<PlacementDashboard />} />
        <Route path="/placement-manager/openings" element={<PlacementDashboard />} />
        <Route path="/placement-manager/applications" element={<PlacementDashboard />} />
        <Route path="/placement-manager/interviews" element={<PlacementDashboard />} />
      </Route>

      {/* Support Manager Workspace */}
      <Route element={<DashboardLayout allowedRoles={[ROLES.SUPPORT_MANAGER, ROLES.ADMIN]} />}>
        <Route path="/support-manager/dashboard" element={<SupportDashboard />} />
        <Route path="/support-manager/enquiries" element={<SupportDashboard />} />
        <Route path="/support-manager/services" element={<SupportDashboard />} />
      </Route>

      {/* Finance Manager Workspace */}
      <Route element={<DashboardLayout allowedRoles={[ROLES.FINANCE_MANAGER, ROLES.ADMIN]} />}>
        <Route path="/finance-manager/dashboard" element={<FinanceDashboard />} />
        <Route path="/finance-manager/transactions" element={<FinanceDashboard />} />
        <Route path="/finance-manager/reports" element={<FinanceDashboard />} />
      </Route>

      {/* 404 Fallback Catch-All */}
      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
