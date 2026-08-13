import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Scholarships } from './pages/Scholarships';
import { ScholarshipDetails } from './pages/ScholarshipDetails';
import { Fields } from './pages/Fields';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { NotFound } from './pages/NotFound';

// Admin Imports
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminScholarships } from './pages/admin/AdminScholarships';
import { AdminScholarshipForm } from './pages/admin/AdminScholarshipForm';
import { AdminFields } from './pages/admin/AdminFields';
import { AdminPromotions } from './pages/admin/AdminPromotions';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminLayout } from './components/admin/AdminLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

// Helper component to scroll window to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Public website wrapper layout with Public Header & Footer
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/scholarships/:slug" element={<ScholarshipDetails />} />
          <Route path="/fields" element={<Fields />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Private Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Private Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="scholarships" element={<AdminScholarships />} />
          <Route path="scholarships/new" element={<AdminScholarshipForm />} />
          <Route path="scholarships/:id/edit" element={<AdminScholarshipForm />} />
          <Route path="fields" element={<AdminFields />} />
          <Route path="affiliate-promotions" element={<AdminPromotions />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

