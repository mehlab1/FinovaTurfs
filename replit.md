# Finova Turfs - Sports Ground Booking Platform

## Overview

Finova Turfs is a full-stack web application for booking sports turfs/grounds. It's built as a modern, dark-themed platform with separate interfaces for users and administrators. The application handles ground bookings, pricing management, user authentication, and provides an AI assistant for enhanced user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a React frontend and Express.js backend, utilizing TypeScript throughout for type safety and better developer experience.

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with a dark theme and glassmorphic UI elements
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and local React state
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth transitions and interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Development**: In-memory storage for development/demo purposes
- **Session Management**: Mock JWT tokens stored in localStorage

### Build System
- **Frontend Bundler**: Vite with React plugin
- **Backend Bundler**: esbuild for production builds
- **Development**: Hot module replacement and runtime error overlay

## Key Components

### Authentication System
- Dual login system for users and administrators
- Mock JWT implementation for development
- Role-based access control (user vs admin routes)
- Session persistence via localStorage

### User Interface
- **User Routes**: Dashboard, ground booking, booking management, help center
- **Admin Routes**: Dashboard, slot management, pricing, bookings overview, loyalty system
- Responsive design with mobile-first approach
- Dark theme with accent colors (primary blue, accent green)

### Booking System
- Real-time slot availability checking
- Dynamic pricing based on demand and time slots
- Weather integration for booking decisions
- Loyalty points system integration
- Multiple time slot selection for extended bookings

### AI Assistant
- Chat-based interface for user queries
- Context-aware responses about bookings and recommendations
- Integration with booking system for intelligent suggestions

## Data Flow

### User Booking Flow
1. User browses available grounds
2. Selects preferred ground and views time slots
3. Weather data and pricing information displayed
4. User selects time slots and confirms booking
5. Payment processing (mocked) and confirmation
6. Booking stored and user receives confirmation

### Admin Management Flow
1. Admin accesses specialized dashboard
2. Views analytics and booking statistics
3. Manages slot pricing and availability
4. Handles user bookings and cancellations
5. Configures loyalty programs and system settings

### Data Storage
- **Development**: In-memory storage with pre-populated mock data
- **Production Ready**: Drizzle ORM with PostgreSQL schema
- **Schema**: Users, grounds, bookings, slot pricing, weather data tables

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database client
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **framer-motion**: Animation library
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Frontend build tool and dev server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration tool

## Deployment Strategy

### Development Environment
- Frontend served by Vite dev server on port 3000
- Backend Express server on port 8000
- Hot reloading enabled for both frontend and backend
- In-memory storage for rapid development

### Production Build
- Frontend built to static assets in `dist/public`
- Backend bundled with esbuild to `dist/index.js`
- Single server deployment serving both frontend and API
- Environment-based configuration for database and external services

### Database Strategy
- Development uses in-memory mock storage
- Production configured for PostgreSQL via DATABASE_URL
- Drizzle migrations handle schema changes
- Seed data available for development and testing

### Key Configuration
- TypeScript paths for clean imports (`@/`, `@shared/`)
- Tailwind configured for dark theme and custom colors
- Vite aliases for asset and component resolution
- Express middleware for request logging and error handling