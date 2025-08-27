# ApplyHub Uganda

## Overview

ApplyHub Uganda is a comprehensive higher education platform designed to connect Ugandan students with universities, scholarships, and educational services. The application serves as a centralized hub where students can discover and apply to universities, find scholarship opportunities, and access educational services like application assistance and resume writing.

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

### State Management
Client-side state is managed through:
- **React Query** for server state, caching, and synchronization
- **React Hook Form** for form state management
- **React Context** (minimal usage) for global UI state
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