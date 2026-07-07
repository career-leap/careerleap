import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import ThemeToggle from './components/ThemeToggle';
import CareerTracksDropdown from './components/CareerTracksDropdown';
import CookieConsent, { useCookieConsent } from './components/CookieConsent';
import { trackPageView } from './lib/metrics';

// Eagerly load only the landing page for fast first paint;
// lazy-load all other route-level pages to reduce initial bundle size.
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Mentors = lazy(() => import('./pages/Mentors'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Pricing = lazy(() => import('./pages/Pricing'));
const ITSystemsAdministration = lazy(() => import('./pages/tracks/ITSystemsAdministration'));
const DataBICareerSimulation = lazy(() => import('./pages/tracks/DataBICareerSimulation'));
const BusinessOperationsAnalyst = lazy(() => import('./pages/tracks/BusinessOperationsAnalyst'));
const CareerAccelerationSupport = lazy(() => import('./pages/tracks/CareerAccelerationSupport'));
const HelpMeChoose = lazy(() => import('./pages/tracks/HelpMeChoose'));
const MentorExpertSupport = lazy(() => import('./pages/tracks/MentorExpertSupport'));
const PartnershipCollaboration = lazy(() => import('./pages/tracks/PartnershipCollaboration'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const MySessions = lazy(() => import('./pages/MySessions'));
const FileUpload = lazy(() => import('./pages/FileUpload'));
const Impressum = lazy(() => import('./pages/Impressum'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

// Simple fallback shown while lazy-loaded chunks download
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 dark:border-indigo-400" />
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Navigation component
function Navigation({ mobileMenuOpen, setMobileMenuOpen }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NavLink to="/" className="flex items-center gap-2 text-2xl font-extrabold text-indigo-600">
            <picture>
              <source srcSet="/image.webp" type="image/webp" />
              <img src="/image.png" alt="CareerLeap Logo" className="h-9 w-auto object-contain" />
            </picture>
            CareerLeap
          </NavLink>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>Home</NavLink>
            <NavLink to="/about" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>About</NavLink>
            <CareerTracksDropdown />
            {isAuthenticated && (
              <>
                <NavLink to="/mentors" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>Mentors</NavLink>
                <NavLink to="/my-sessions" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>My Sessions</NavLink>
                <NavLink to="/files" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>Files</NavLink>
                <NavLink to="/profile" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'}`}>Profile</NavLink>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <span className="text-gray-700 dark:text-gray-300">Hello, {user?.firstName}</span>
                <button 
                  onClick={logout}
                  className="px-4 py-2 text-red-600 dark:text-red-400 border-2 border-red-600 dark:border-red-400 rounded-lg font-semibold hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="px-4 py-2 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-all">
                  Log In
                </NavLink>
                <NavLink to="/contact" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Get Started
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button 
              className="p-2 text-indigo-600 dark:text-indigo-400"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300">Home</NavLink>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300">About</NavLink>
              <CareerTracksDropdown mobile onItemClick={() => setMobileMenuOpen(false)} />
              {isAuthenticated && (
                <>
                  <NavLink to="/mentors" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300">Mentors</NavLink>
                  <NavLink to="/my-sessions" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300">My Sessions</NavLink>
                  <NavLink to="/files" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300">Files</NavLink>
                  <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300">Profile</NavLink>
                </>
              )}
              {isAuthenticated ? (
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-600 dark:text-red-400">Logout</button>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="text-indigo-600 dark:text-indigo-400">Login</NavLink>
                  <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-indigo-600 dark:text-indigo-400">Get Started</NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Track page views on route changes
function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { checkAuth } = useAuthStore();
  const { openSettings } = useCookieConsent();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <PageViewTracker />
        <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        
        <main className="pt-16">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/career-tracks" element={<ITSystemsAdministration />} />
              <Route path="/career-tracks/it-systems-administration" element={<ITSystemsAdministration />} />
              <Route path="/career-tracks/data-bi-career-simulation" element={<DataBICareerSimulation />} />
              <Route path="/career-tracks/business-operations-analyst" element={<BusinessOperationsAnalyst />} />
              <Route path="/career-tracks/career-acceleration-support" element={<CareerAccelerationSupport />} />
              <Route path="/career-tracks/help-me-choose" element={<HelpMeChoose />} />
              <Route path="/career-tracks/mentor-expert-support" element={<MentorExpertSupport />} />
              <Route path="/career-tracks/partnership-collaboration" element={<PartnershipCollaboration />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/mentors" 
                element={
                  <ProtectedRoute>
                    <Mentors />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-sessions" 
                element={
                  <ProtectedRoute>
                    <MySessions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/files" 
                element={
                  <ProtectedRoute>
                    <FileUpload />
                  </ProtectedRoute>
                } 
              />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="bg-slate-900 dark:bg-black text-white py-16 px-4 transition-colors">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 text-2xl font-extrabold text-white mb-4">
                <picture>
              <source srcSet="/image.webp" type="image/webp" />
              <img src="/image.png" alt="CareerLeap Logo" className="h-9 w-auto object-contain" />
            </picture>
                CareerLeap
              </div>
              <p className="text-gray-400 text-sm">
                Connecting ambitious professionals with industry experts for personalized career guidance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><NavLink to="/mentors" className="hover:text-white transition-colors">Find a Mentor</NavLink></li>
                <li><a href="#" className="hover:text-white transition-colors">Become a Mentor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><NavLink to="/about" className="hover:text-white transition-colors">About Us</NavLink></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><NavLink to="/contact" className="hover:text-white transition-colors">Help Center</NavLink></li>
                <li><NavLink to="/privacy" className="hover:text-white transition-colors">Privacy</NavLink></li>
                <li><NavLink to="/cookies" className="hover:text-white transition-colors">Cookie Policy</NavLink></li>
                <li><NavLink to="/impressum" className="hover:text-white transition-colors">Impressum</NavLink></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
            <span>© 2026 CareerLeap. All rights reserved.</span>
            <button
              onClick={openSettings}
              className="hover:text-white transition-colors underline underline-offset-2"
            >
              Cookie-Einstellungen
            </button>
          </div>
        </footer>

        <CookieConsent />
      </div>
    </Router>
  );
}

export default App;
