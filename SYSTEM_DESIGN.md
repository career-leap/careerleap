# CareerLeap — System Design Document

> Architecture overview for the CareerLeap mentorship and career simulation platform.
---

## 1. System Overview

CareerLeap is a full-stack web platform that connects international students and graduates in Germany with career simulation cohorts and mentorship opportunities. The system supports public marketing pages, authenticated user flows, mentor discovery, session booking, file management, lead capture, and analytics tracking.

### Primary Goals
- Convert visitors into leads via the customer journey form
- Allow mentees to discover and book mentors
- Allow mentors to manage availability and sessions
- Deliver career track content (live + upcoming cohorts)
- Track user behaviour with privacy-first analytics
- Operate securely with role-based access control

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │   Browser    │  │   Browser    │  │   Browser    │  │   Browser   │ │
│  │  (Marketing) │  │  (Mentee)    │  │   (Mentor)   │  │   (Admin)   │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │
└─────────┼─────────────────┼─────────────────┼─────────────────┼────────┘
          │                 │                 │                 │
          └─────────────────┴────────┬────────┴─────────────────┘
                                     │
                              ┌──────▼──────┐
                              │   nginx     │  (Production only)
                              │  Reverse    │  Static/Media + API proxy
                              │   Proxy     │
                              └──────┬──────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
   ┌──────▼──────┐          ┌────────▼────────┐        ┌────────▼───────┐
   │   React     │          │     Django      │        │  PostgreSQL    │
   │  Frontend   │◄────────►│     REST API    │◄──────►│   Database     │
   │   (Vite)    │  HTTP    │   (Gunicorn)    │  psycopg2                │
   └─────────────┘          └─────────────────┘        └────────────────┘
```

### Architecture Style
- **Monolithic full-stack application** with clear separation between frontend and backend
- **REST API** communication over HTTP/HTTPS
- **Stateless backend** with JWT authentication
- **Client-side rendering** with React and React Router
- **Server-side data persistence** with PostgreSQL

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend Framework** | React 18 | UI components and routing |
| **Build Tool** | Vite 7 | Fast development and optimized production builds |
| **Styling** | Tailwind CSS 4 | Utility-first CSS with dark mode support |
| **State Management** | Zustand | Global state for auth, mentors, bookings, files, theme |
| **HTTP Client** | Axios | API requests with interceptors |
| **Animations** | Framer Motion | Page transitions and scroll animations |
| **Icons** | Lucide React | Consistent iconography |
| **Backend Framework** | Django 4.2 | Web framework and ORM |
| **API Layer** | Django REST Framework | RESTful API endpoints |
| **Authentication** | djangorestframework-simplejwt | JWT access/refresh tokens |
| **Database** | PostgreSQL 16 | Relational data storage |
| **Cache** | Local memory / Redis | Password reset tokens, rate limiting |
| **File Storage** | Local filesystem / AWS S3 | User uploads |
| **Email** | Resend SMTP | Transactional emails |
| **Containerization** | Docker + Docker Compose | Local dev and production deployment |
| **Hosting** | Render | Production deployment |

---

## 4. Frontend Architecture

### Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── CareerTracksDropdown.jsx
│   ├── CookieConsent.jsx
│   ├── ThemeProvider.jsx
│   ├── ThemeToggle.jsx
│   ├── MentorCard.jsx
│   ├── BookingModal.jsx
│   └── JourneyFormMockup.jsx
├── pages/                # Route-level pages
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Mentors.jsx
│   ├── MySessions.jsx
│   ├── Profile.jsx
│   ├── FileUpload.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   ├── HowItWorks.jsx
│   ├── Pricing.jsx
│   ├── Impressum.jsx
│   ├── PrivacyPolicy.jsx
│   ├── CookiePolicy.jsx
│   └── tracks/           # Career track detail pages
│       ├── ITSystemsAdministration.jsx
│       ├── DataBICareerSimulation.jsx
│       ├── BusinessOperationsAnalyst.jsx
│       ├── CareerAccelerationSupport.jsx
│       ├── MentorExpertSupport.jsx
│       ├── PartnershipCollaboration.jsx
│       ├── HelpMeChoose.jsx
│       └── UpcomingTrack.jsx
├── store/                # Zustand stores
│   ├── authStore.js
│   ├── mentorStore.js
│   ├── bookingStore.js
│   ├── fileStore.js
│   └── themeStore.js
├── lib/                  # Utilities and API client
│   ├── api.js
│   └── metrics.js
├── App.jsx               # Application router and navigation
└── main.jsx              # Entry point
```

### Routing

| Route | Access | Page |
|-------|--------|------|
| `/` | Public | Home |
| `/about` | Public | About |
| `/how-it-works` | Public | How It Works |
| `/pricing` | Public | Pricing |
| `/contact` | Public | Contact / Journey Form |
| `/career-tracks` | Public | IT Systems Administration track |
| `/career-tracks/*` | Public | Individual track pages |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Public | Auth flows |
| `/mentors` | Protected | Mentor discovery |
| `/my-sessions` | Protected | User sessions |
| `/files` | Protected | File management |
| `/profile` | Protected | User profile |
| `/impressum`, `/privacy`, `/cookies` | Public | Legal pages |

### State Management

| Store | Responsibility |
|-------|----------------|
| `authStore` | Login, register, logout, password reset, auth persistence |
| `mentorStore` | Mentor listing, filters, pagination |
| `bookingStore` | Availability, session booking, my sessions |
| `fileStore` | Uploads, downloads, deletions, stats |
| `themeStore` | Light/dark/system theme preference |

### API Client

The centralized Axios instance in `src/lib/api.js` handles:
- Base URL resolution from `VITE_API_URL`
- JWT Bearer token injection from `localStorage`
- Automatic `Content-Type` handling for `FormData`
- Global 401 handling (logout + redirect)
- 429 rate-limit warnings

---

## 5. Backend Architecture

### Django Apps

```
backend_django/
├── accounts/              # Custom user model, auth views, password reset
├── mentors/               # Mentor profiles and discovery
├── mentorship_sessions/   # Session booking and availability
├── files/                 # File uploads and management
├── leads/                 # Customer journey form and lead scoring
├── metrics/               # Analytics event tracking
└── backend_django/        # Settings, URLs, middleware
```

### App Responsibilities

#### `accounts`
- Custom `User` model with UUID primary key, email-based login, roles
- JWT login/register/password reset flows
- Rate limiting on public auth endpoints
- Contact form submission

#### `mentors`
- `MentorProfile` model linked one-to-one to users
- Mentor listing with filtering, search, pagination
- Mentor profile updates

#### `mentorship_sessions`
- `Session` model linking mentees and mentors
- Availability generation (9 AM–5 PM, next 7 days)
- Session CRUD and cancellation
- Server-side price computation from mentor rate

#### `files`
- `FileUpload` model with metadata and categorization
- Secure upload/download/delete endpoints
- MIME type validation and file size limits
- Optional AWS S3 integration

#### `leads`
- `Lead` model capturing full journey form data
- Lead scoring, classification, and temperature logic
- Internal notification and auto-reply emails

#### `metrics`
- `Event` model for privacy-first analytics
- Rate-limited event ingestion endpoint

### Authentication Flow

```
┌─────────┐      register/login      ┌──────────┐
│ Client  │ ───────────────────────► │  Django  │
└─────────┘                          │   API    │
     ▲                               └────┬─────┘
     │                                    │
     │  2. Returns access + refresh      │
     │◄──────────────────────────────────┤
     │                                    │
     │  3. Sends access token in         │
     │     Authorization header          │
     │──────────────────────────────────►│
     │                                    │
     │  4. Returns protected data        │
     │◄──────────────────────────────────┤
```

### Security Measures

- JWT access tokens (configurable lifetime, default 15 min)
- Rotating refresh tokens with blacklist
- Password reset tokens hashed with SHA-256 and cached for 30 min
- Rate limiting on auth, contact, and lead endpoints
- CORS restricted to configured origins
- Custom security middleware adding CSP and other headers
- File upload validation (MIME type, extension blacklist, 50MB limit)
- Server-side price computation to prevent client manipulation

---

## 6. Database Schema

### Core Entities

```
┌─────────────┐       ┌─────────────────┐       ┌───────────────────┐
│    User     │◄─────►│  MentorProfile  │       │      Session      │
├─────────────┤  1:1  ├─────────────────┤       ├───────────────────┤
│ id (UUID)   │       │ id (UUID)       │       │ id (UUID)         │
│ email       │       │ user_id         │       │ mentee_id         │
│ first_name  │       │ hourly_rate     │       │ mentor_id         │
│ last_name   │       │ expertise       │       │ scheduled_at      │
│ role        │       │ is_available    │       │ duration          │
│ is_active   │       │ total_sessions  │       │ status            │
│ ...         │       │ average_rating  │       │ price             │
└─────────────┘       └─────────────────┘       │ payment_status    │
                                                │ meeting_link      │
                                                └───────────────────┘
┌─────────────┐       ┌─────────────────┐
│ FileUpload  │       │      Lead       │
├─────────────┤       ├─────────────────┤
│ id (UUID)   │       │ id (UUID)       │
│ user_id     │       │ full form data  │
│ file        │       │ lead_score      │
│ file_type   │       │ lead_type       │
│ file_size   │       │ lead_status     │
│ category    │       │ lead_temperature│
│ ...         │       │ created_at      │
└─────────────┘       └─────────────────┘
```

### Key Relationships
- `User` 1:1 `MentorProfile`
- `User` 1:N `Session` (as mentee)
- `User` 1:N `Session` (as mentor)
- `User` 1:N `FileUpload`
- `User` 1:N `Event`

---

## 7. Deployment Architecture

### Development (Docker Compose)

```
┌─────────────────────────────────────────────┐
│           docker-compose.yml                │
├─────────────┬─────────────┬────────────────┤
│  frontend   │   backend   │       db       │
│  Vite dev   │ Django dev  │ PostgreSQL 16  │
│   :5177     │   :8000     │     :5432      │
└─────────────┴─────────────┴────────────────┘
         │                           │
         └───────────┬───────────────┘
                     │
                adminer :8080
```

### Production (Docker Compose + nginx)

```
┌─────────────────────────────────────────────┐
│        docker-compose.prod.yml              │
├─────────────────────────────────────────────┤
│                   nginx                     │
│              (:80 / :443)                   │
├──────────────────┬──────────────────────────┤
│     backend      │         db               │
│    (Gunicorn)    │    PostgreSQL 16         │
├──────────────────┴──────────────────────────┤
│  static/ + media/ volumes                   │
└─────────────────────────────────────────────┘
```

### Render Deployment

The `render.yaml` Blueprint defines:
- Backend web service (Python/Django)
- Static frontend site
- PostgreSQL database
- Environment variables and build commands

---

## 8. Data Flow Examples

### Visitor → Lead

1. Visitor lands on `/` (Home)
2. Clicks "Apply for the Next Cohort"
3. Navigates to `/contact`
4. Completes multi-step journey form
5. Frontend POSTs to `/api/leads/journey/`
6. Backend validates, scores, classifies lead
7. Lead saved to database
8. Internal notification email sent to `info@career-leap.academy`
9. Auto-reply email sent to user

### Mentee Books a Session

1. Authenticated user browses `/mentors`
2. Selects mentor and opens `BookingModal`
3. Frontend fetches availability from `/api/sessions/availability/`
4. User selects date/time slot
5. Frontend POSTs to `/api/sessions/create/`
6. Backend computes price from mentor's hourly rate
7. Session saved to database
8. Confirmation email sent

---

## 9. External Integrations

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| **Resend** | Transactional email | Django SMTP backend |
| **Calendly** | Info session booking | `VITE_CALENDLY_URL` env var + homepage button |

---

## 10. Environment & Configuration

### Backend Variables

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | Django cryptographic signing |
| `DEBUG` | Debug mode toggle |
| `ALLOWED_HOSTS` | Host header validation |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |
| `DATABASE_URL` | PostgreSQL connection |
| `EMAIL_*` | SMTP configuration |
| `DEFAULT_FROM_EMAIL` | Sender address |
| `FRONTEND_URL` | Password reset link base |

### Frontend Variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | API base URL (`/api` or full URL) |
| `VITE_CALENDLY_URL` | Calendly booking link |

---

## 11. Scaling Considerations

### Current Limits
- Local memory cache (development)
- File storage on local filesystem (development)
- Single-node deployment

### Recommended Production Scaling
- Replace local cache with Redis for password reset tokens and rate limiting
- Move media files to AWS S3 or similar object storage
- Use managed PostgreSQL (e.g. Render PostgreSQL, AWS RDS)
- Add CDN for static assets
- Consider horizontal scaling of backend behind a load balancer
- Implement background task queue (Celery + Redis) for emails and heavy operations

---

## 12. Future Considerations

- Real-time notifications (WebSockets or Server-Sent Events)
- In-app messaging between mentors and mentees
- Payment integration for session bookings
- Admin dashboard for cohort and lead management
- More career tracks and track-specific application forms
- Enhanced analytics dashboard
- Automated email sequences for leads
- Calendar integration beyond Calendly (Google Calendar, Outlook)

---

## 13. Decision Log

| Decision | Rationale |
|----------|-----------|
| **JWT in localStorage** | Simple SPA auth; trade-off is XSS risk mitigated by short token lifetime and CSP |
| **Function-based DRF views** | Faster to write and consistent across the codebase |
| **Zustand over Redux** | Lighter state management for the project's scale |
| **Tailwind CSS v4** | Latest utility-first styling with built-in dark mode support |
| **Resend for email** | Cost-effective and reliable transactional email |
| **Calendly for scheduling** | Avoids building custom scheduling logic |
| **PostgreSQL** | Reliable relational database with Django ORM support |
| **Docker Compose** | Easy local development and production parity |
