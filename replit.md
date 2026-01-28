# Lectoris

## Overview

Lectoris (formerly ApplyHub Uganda) is a comprehensive higher education platform designed to connect Ugandan students with universities, scholarships, and educational services. The application serves as a centralized hub where students can discover and apply to universities, find scholarship opportunities, and access educational services like application assistance and resume writing.

The platform features a modern web application with user authentication, comprehensive university and scholarship databases, and a service marketplace. It's built with a focus on the Ugandan education landscape, featuring local universities and region-specific opportunities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using **React** with **TypeScript** and **Vite** as the build tool. The application uses:
- **Wouter** for client-side routing instead of React Router
- **TanStack React Query** for server state management and data fetching
- **Radix UI** components with **shadcn/ui** for consistent, accessible UI components
- **Tailwind CSS** for styling with a custom design system
- **React Hook Form** with **Zod** for form validation

The component architecture follows a modular approach with reusable UI components, page-specific components, and shared business logic through custom hooks.

### Backend Architecture
The backend is an **Express.js** server with TypeScript, designed as a REST API. Key architectural decisions include:
- **Modular route handling** with a centralized route registration system
- **Database abstraction layer** through a storage interface for easy testing and maintenance
- **Middleware-based request logging** for API monitoring
- **Error handling** with structured error responses

### Database Design
The application uses **PostgreSQL** with **Drizzle ORM** for type-safe database operations. The schema includes:
- **Users table** for authentication and user profiles
- **Universities table** with comprehensive institution data
- **Scholarships table** with funding opportunities
- **Services table** for educational services
- **Service requests table** for tracking service applications
- **Saved items tables** for user bookmarks
- **Sessions table** for authentication state

### Authentication System
The application integrates **Replit's OIDC authentication** system with:
- **Passport.js** for authentication middleware
- **Session-based authentication** using PostgreSQL session storage
- **User profile management** with automatic user creation/updates
- **Role-based access control** with admin functionality

### Brand Identity (Lectoris - January 2026)
The app uses a refined academic color palette:
- **Midnight Navy (#0B1B32)** - Backgrounds, Headers (Authority)
- **Academic Gold (#D4AF37)** - Icons, Accents, Buttons (Excellence)
- **Oxford Silver (#E5E7E9)** - Main Text, Icons (Clarity)
- **Slate Charcoal (#2C3E50)** - Secondary Text, Cards (Reliability)

### Theme System
The application supports Light, Dark, and System themes:
- **ThemeProvider** component manages theme state and persistence
- **Theme stored in localStorage** under key "lectoris-theme"
- **CSS variables** defined in index.css for both :root (light) and .dark classes
- **ThemeToggle** component in navbar for theme switching

### State Management
Client-side state is managed through:
- **React Query** for server state, caching, and synchronization
- **React Hook Form** for form state management
- **React Context** for theme state (ThemeProvider)
- **Local component state** for UI interactions

### API Design
The REST API follows conventional patterns with:
- **Resource-based endpoints** (/api/universities, /api/scholarships)
- **Query parameters** for filtering and searching
- **Consistent response formats** with proper HTTP status codes
- **Authentication middleware** protecting sensitive endpoints
- **Request/response logging** for debugging and monitoring

## External Dependencies

### Database Services
- **Neon Database** - Serverless PostgreSQL database hosting
- **PostgreSQL** - Primary database engine with JSONB support

### Authentication Services
- **Replit OIDC** - OpenID Connect authentication provider
- **Passport.js** - Authentication middleware with OpenID Connect strategy

### UI Framework
- **Radix UI** - Headless UI components for accessibility
- **shadcn/ui** - Pre-built component library based on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Development Tools
- **Vite** - Frontend build tool and development server
- **TypeScript** - Type safety across frontend and backend
- **Drizzle Kit** - Database migration and management tool
- **ESBuild** - Fast JavaScript bundler for production builds

### Runtime Dependencies
- **Express.js** - Web application framework
- **React Query** - Data fetching and state management
- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation library
- **date-fns** - Date manipulation utilities

## Recent Changes (December 2025)

### Features Added
- **ApplyHub Logo** - Custom branded logo displayed in navbar, footer, and auth pages
- **Direct Application Portal Links** - Each university card has an "Apply" button linking directly to the university's online application portal
- **Password-Based Authentication** - Students can create accounts with email/password using bcrypt hashing
- **University Ranking System** - Gold badges with rankings 1-30 based on Uganda's national ranking system
- **AI Course Advisor Chatbot** - Powered by OpenAI, helps students choose courses and universities based on academic performance
- **Search Autocomplete** - Real-time search suggestions for universities and scholarships in navbar
- **User Dashboard** - View saved universities, scholarships, and service requests
- **Admin Dashboard** - Manage service requests, view platform statistics, user management
- **Mobile Responsiveness** - Complete mobile-first responsive design across all pages
- **Enlarged University Logos** - Increased logo sizes to w-28 h-28 (mobile) and sm:w-40 sm:h-40 (desktop)
- **Apply & Learn More Buttons Below Logo** - Direct action buttons for each university below the logo area
- **Services Tier Integration** - Services now bundled into subscription plans (Standard & Premium) instead of individual pricing

### API Endpoints Added
- `POST /api/auth/signup` - Create new student account with email/password
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout user
- `POST /api/chat` - AI chatbot for course guidance
- `GET /api/search/autocomplete?q=` - Search suggestions for universities/scholarships
- `GET /api/admin/stats` - Platform statistics (admin only)
- `GET /api/admin/users` - User list (admin only)
- `PUT /api/user/profile` - Update user profile
- `GET /api/services` - List of all services with tier assignment (no individual pricing)

### Monetization Model (January 2026)
**Core Philosophy:** Universities and scholarships browsing is FREE for all users. Revenue comes from optional subscription upgrades and pay-per-service purchases.

**Subscription Plans:**
- **Free Plan:** Full access to university/scholarship database, basic search, 5 AI chat messages/month
- **Student Pro (UGX 50,000/month):** Ad-free, unlimited AI chat, advanced filters, application tracking, 10% service discount

**Pay-Per-Service (Max UGX 50,000 each):**
- University Application Assistance - UGX 50,000
- Scholarship Application Support - UGX 50,000
- Career Counseling Session - UGX 50,000
- Scholarship Essay Review - UGX 40,000
- Professional Resume Writing - UGX 30,000

**Payment Methods Supported:**
- MTN Mobile Money
- Airtel Money
- Visa/Mastercard

**Database Tables for Monetization:**
- `subscription_plans` - Plan definitions with features
- `orders` - User orders for subscriptions/services
- `payments` - Payment transaction records
- `discounts` - Promotional discount codes

### University Application Portal URLs
All 30 universities now have direct application portal links:
- Makerere University: https://apply.mak.ac.ug
- Kyambogo University: https://apply.kyu.ac.ug
- Uganda Christian University: https://application.ucu.ac.ug
- (and 27 more with similar patterns)

### Current Database Status
- **In-Memory Storage** - Currently using MemoryStorage class for data
- **Data Seeding** - 30 universities and 20 scholarships pre-loaded on startup
- Note: Data resets on server restart (PostgreSQL credentials sync issue requires platform support)

### Branding Assets
- Logo file: `attached_assets/Gemini_Generated_Image_rjkt7erjkt7erjkt_1769618801021.png`
- Brand colors (Lectoris palette):
  - Midnight Navy (#0B1B32) - Backgrounds, Headers
  - Academic Gold (#D4AF37) - Icons, Accents, Buttons
  - Oxford Silver (#E5E7E9) - Main Text, Icons
  - Slate Charcoal (#2C3E50) - Secondary Text, Cards

### Contact Information
- Phone: +256 708 922 009

### SEO Implementation (December 2025)
**SEO Components & Features:**
- **SEO Component** (`client/src/components/seo.tsx`) - Reusable component using react-helmet-async with dynamic meta tags, Open Graph, Twitter Cards
- **JSON-LD Structured Data** - Schema generators for Organization, University, Scholarship, Article, and Breadcrumb schemas
- **Dynamic Meta Tags** - Every page has unique title, description, canonical URL, and keywords
- **Sitemap.xml** - Dynamic sitemap at `/sitemap.xml` including all static pages, universities, and scholarships
- **Robots.txt** - At `/robots.txt` with proper Allow/Disallow rules

**Pages with SEO:**
- Landing page with Organization schema
- Universities list and detail pages with University schema
- Scholarships list and detail pages with Scholarship schema  
- Services, Blog, Pricing pages with custom meta tags

**Google Integration (Placeholders):**
- Google Analytics: Replace `GA_MEASUREMENT_ID` in index.html with actual ID (e.g., G-XXXXXXXXXX)
- Google Search Console: Replace `YOUR_VERIFICATION_CODE` in index.html with actual verification code

### Progressive Web App (PWA) Implementation (December 2025)
**PWA Files:**
- `client/public/manifest.json` - Web app manifest with name, icons, theme colors
- `client/public/service-worker.js` - Service worker for offline caching
- `client/public/icons/icon-192x192.png` - PWA icon (192x192)
- `client/public/icons/icon-512x512.png` - PWA icon (512x512)

**PWA Features:**
- Standalone display mode
- Offline caching of static assets
- Network-first strategy for API calls with offline fallback
- Apple mobile web app support
- Installable on mobile and desktop

**Testing PWA Installability:**
1. Open app in Chrome (preferably on HTTPS or localhost)
2. Open DevTools (F12) → Application → Manifest to verify manifest loads correctly
3. Check Application → Service Workers to confirm SW is registered
4. Look for "Install" icon in address bar or use Chrome menu → "Install ApplyHub"
5. Run Lighthouse PWA audit for full compliance check