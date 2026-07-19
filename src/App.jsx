import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import ThemeToggle from './components/ThemeToggle';
import CareerTracksDropdown from './components/CareerTracksDropdown';
import CookieConsent, { useCookieConsent } from './components/CookieConsent';
import { trackPageView } from './lib/metrics';

// Eagerly load only the landing page for fast first paint;
// lazy-load all other route-level pages to reduce initial bundle size.
// PREVIEW: using HomeV2 for internal review. Swap back to Home before production.
import Home from './pages/HomeV2';

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

const defaultRouteComponents = {
  Home,
  About,
  Mentors,
  HowItWorks,
  Pricing,
  ITSystemsAdministration,
  DataBICareerSimulation,
  BusinessOperationsAnalyst,
  CareerAccelerationSupport,
  HelpMeChoose,
  MentorExpertSupport,
  PartnershipCollaboration,
  Contact,
  Login,
  ForgotPassword,
  ResetPassword,
  Profile,
  MySessions,
  FileUpload,
  Impressum,
  PrivacyPolicy,
  CookiePolicy,
};

// Simple fallback shown while lazy-loaded chunks download
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 dark:border-teal-400" />
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
          <NavLink to="/" className="flex items-center gap-2 text-2xl font-extrabold text-teal-600">
            <picture>
              <source srcSet="/image.webp" type="image/webp" />
              <img src="/image.png" alt="CareerLeap Logo" className="h-9 w-auto object-contain" />
            </picture>
            CareerLeap
          </NavLink>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'}`}>Home</NavLink>
            <NavLink to="/how-it-works" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'}`}>How it works</NavLink>
            <NavLink to="/about" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'}`}>Why CareerLeap</NavLink>
            <CareerTracksDropdown />
            {isAuthenticated && (
              <>
                <NavLink to="/mentors" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'}`}>Mentors</NavLink>
                <NavLink to="/my-sessions" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'}`}>My Sessions</NavLink>
                <NavLink to="/files" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'}`}>Files</NavLink>
                <NavLink to="/profile" className={({isActive}) => `font-medium transition-colors ${isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400'}`}>Profile</NavLink>
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
                <NavLink to="/login" className="px-4 py-2 text-teal-600 dark:text-teal-400 border-2 border-teal-600 dark:border-teal-400 rounded-lg font-semibold hover:bg-teal-600 hover:text-white transition-all">
                  Log In
                </NavLink>
                <NavLink to="/contact" className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Get Started
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button 
              className="p-2 text-teal-600 dark:text-teal-400"
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
              <NavLink to="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300">How it works</NavLink>
              <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 dark:text-gray-300">Why CareerLeap</NavLink>
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
                  <NavLink to="/login" onClick={() => setMobileMenuOpen(false)} className="text-teal-600 dark:text-teal-400">Login</NavLink>
                  <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-teal-600 dark:text-teal-400">Get Started</NavLink>
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

function App({ 
  RouterComponent = BrowserRouter, 
  routerProps = {},
  routeComponents = defaultRouteComponents 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { checkAuth } = useAuthStore();
  const { openSettings } = useCookieConsent();

  useEffect(() => {
    checkAuth();
  }, []);

  const {
    Home: HomeComponent,
    About: AboutComponent,
    Mentors: MentorsComponent,
    HowItWorks: HowItWorksComponent,
    Pricing: PricingComponent,
    ITSystemsAdministration: ITSystemsAdministrationComponent,
    DataBICareerSimulation: DataBICareerSimulationComponent,
    BusinessOperationsAnalyst: BusinessOperationsAnalystComponent,
    CareerAccelerationSupport: CareerAccelerationSupportComponent,
    HelpMeChoose: HelpMeChooseComponent,
    MentorExpertSupport: MentorExpertSupportComponent,
    PartnershipCollaboration: PartnershipCollaborationComponent,
    Contact: ContactComponent,
    Login: LoginComponent,
    ForgotPassword: ForgotPasswordComponent,
    ResetPassword: ResetPasswordComponent,
    Profile: ProfileComponent,
    MySessions: MySessionsComponent,
    FileUpload: FileUploadComponent,
    Impressum: ImpressumComponent,
    PrivacyPolicy: PrivacyPolicyComponent,
    CookiePolicy: CookiePolicyComponent,
  } = routeComponents;

  return (
    <RouterComponent {...routerProps}>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <PageViewTracker />
        <Navigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        
        <main className="pt-16">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomeComponent />} />
              <Route path="/about" element={<AboutComponent />} />
              <Route path="/how-it-works" element={<HowItWorksComponent />} />
              <Route path="/career-tracks" element={<ITSystemsAdministrationComponent />} />
              <Route path="/career-tracks/it-systems-administration" element={<ITSystemsAdministrationComponent />} />
              <Route path="/career-tracks/data-bi-career-simulation" element={<DataBICareerSimulationComponent />} />
              <Route path="/career-tracks/business-operations-analyst" element={<BusinessOperationsAnalystComponent />} />
              <Route path="/career-tracks/career-acceleration-support" element={<CareerAccelerationSupportComponent />} />
              <Route path="/career-tracks/help-me-choose" element={<HelpMeChooseComponent />} />
              <Route path="/career-tracks/mentor-expert-support" element={<MentorExpertSupportComponent />} />
              <Route path="/career-tracks/partnership-collaboration" element={<PartnershipCollaborationComponent />} />
              <Route path="/pricing" element={<PricingComponent />} />
              <Route path="/contact" element={<ContactComponent />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route path="/forgot-password" element={<ForgotPasswordComponent />} />
              <Route path="/reset-password" element={<ResetPasswordComponent />} />
              <Route 
                path="/mentors" 
                element={
                  <ProtectedRoute>
                    <MentorsComponent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileComponent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/my-sessions" 
                element={
                  <ProtectedRoute>
                    <MySessionsComponent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/files" 
                element={
                  <ProtectedRoute>
                    <FileUploadComponent />
                  </ProtectedRoute>
                } 
              />
              <Route path="/impressum" element={<ImpressumComponent />} />
              <Route path="/privacy" element={<PrivacyPolicyComponent />} />
              <Route path="/cookies" element={<CookiePolicyComponent />} />
            </Routes>
          </Suspense>
        </main>

        <footer className="bg-teal-900 dark:bg-teal-950 text-white py-16 px-4 transition-colors">
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
                Germany's career simulation platform for international professionals entering IT, Data, and Operations roles.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Programmes</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><NavLink to="/career-tracks" className="hover:text-white transition-colors">Career Tracks</NavLink></li>
                <li><NavLink to="/contact" className="hover:text-white transition-colors">Join as a Team Lead</NavLink></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><NavLink to="/about" className="hover:text-white transition-colors">Why CareerLeap</NavLink></li>
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
    </RouterComponent>
  );
}

export default App;
