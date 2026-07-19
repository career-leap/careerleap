import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import ThemeProvider from './components/ThemeProvider';
import App from './App';

// Eagerly import all public route components for prerendering.
// This avoids React.lazy Suspense issues during server-side rendering.
import Home from './pages/HomeV2';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Impressum from './pages/Impressum';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import ITSystemsAdministration from './pages/tracks/ITSystemsAdministration';
import DataBICareerSimulation from './pages/tracks/DataBICareerSimulation';
import BusinessOperationsAnalyst from './pages/tracks/BusinessOperationsAnalyst';
import CareerAccelerationSupport from './pages/tracks/CareerAccelerationSupport';
import HelpMeChoose from './pages/tracks/HelpMeChoose';
import MentorExpertSupport from './pages/tracks/MentorExpertSupport';
import PartnershipCollaboration from './pages/tracks/PartnershipCollaboration';

export const publicRouteComponents = {
  Home,
  About,
  HowItWorks,
  Pricing,
  Contact,
  Impressum,
  PrivacyPolicy,
  CookiePolicy,
  ITSystemsAdministration,
  DataBICareerSimulation,
  BusinessOperationsAnalyst,
  CareerAccelerationSupport,
  HelpMeChoose,
  MentorExpertSupport,
  PartnershipCollaboration,
};

const authRouteStubs = {
  Login: () => null,
  ForgotPassword: () => null,
  ResetPassword: () => null,
  Mentors: () => null,
  Profile: () => null,
  MySessions: () => null,
  FileUpload: () => null,
};

export const routeComponents = { ...publicRouteComponents, ...authRouteStubs };

export const publicRoutes = [
  '/',
  '/how-it-works',
  '/about',
  '/career-tracks',
  '/career-tracks/it-systems-administration',
  '/career-tracks/data-bi-career-simulation',
  '/career-tracks/business-operations-analyst',
  '/career-tracks/career-acceleration-support',
  '/career-tracks/help-me-choose',
  '/career-tracks/mentor-expert-support',
  '/career-tracks/partnership-collaboration',
  '/contact',
  '/pricing',
  '/impressum',
  '/privacy',
  '/cookies',
];

export function render(route, template) {
  const helmetContext = {};

  const appHtml = ReactDOMServer.renderToString(
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <App
          RouterComponent={StaticRouter}
          routerProps={{ location: route }}
          routeComponents={routeComponents}
        />
      </ThemeProvider>
    </HelmetProvider>
  );

  const helmet = helmetContext.helmet;
  const headHtml = [
    helmet.title.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ].join('\n    ');

  // Inject the rendered head tags and body content into the Vite-built template.
  let html = template
    .replace(/<title>.*?<\/title>/, headHtml)
    .replace(/<meta name="description" content=".*?"\/?>/i, '')
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  return { html };
}

export default { render, publicRoutes };
