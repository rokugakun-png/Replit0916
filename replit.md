# Overview

This is a Japanese mobile counseling app designed to provide mental health support through AI-powered character interactions. The app features a wellness-focused UI with calming design elements, worry management capabilities, progress tracking, and weekly reporting. Users can chat with different AI counselor characters (doctors, therapists, consultants) to work through their concerns in a supportive environment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with **React 18** and **TypeScript**, using a component-based architecture with functional components and hooks. The UI framework is **shadcn/ui** with **Tailwind CSS** for styling, specifically configured for Japanese text with Noto Sans JP font. Navigation is handled by **wouter** for client-side routing, and the app uses **TanStack React Query** for state management and API interactions.

The design follows a **mobile-first approach** with a bottom navigation bar pattern. The color system emphasizes calming tones (soft blues and grays) to create a therapeutic atmosphere, avoiding harsh contrasts that might trigger anxiety in users with mental health concerns.

## Backend Architecture
The server uses **Express.js** with **TypeScript** in ESM format. The architecture separates concerns with dedicated route handlers and a storage abstraction layer. Currently implements an in-memory storage solution but is designed to easily swap to database persistence.

The backend follows a **RESTful API pattern** with `/api` prefixed routes. Error handling middleware captures and formats errors appropriately, and request logging provides development visibility.

## Data Storage Solutions
The database schema is defined using **Drizzle ORM** with **PostgreSQL** as the target database. The schema includes entities for worries, goals, tasks, AI characters, conversations, and chat messages, supporting a hierarchical structure where worries contain goals and tasks.

The current implementation uses **memory storage** for development, but production deployment expects PostgreSQL via the `@neondatabase/serverless` driver. Database migrations are managed through Drizzle Kit.

## Component Design System
Components are built using **Radix UI primitives** for accessibility and **class-variance-authority** for consistent styling variants. The design system emphasizes:
- **Soft visual elements** with rounded corners and gentle shadows
- **Progress visualization** that focuses on achievements rather than deficits
- **Empathetic language patterns** in UI copy to reduce user anxiety
- **Character-based interactions** with distinct visual styling per counselor type

## External Dependencies

- **Neon Database** - PostgreSQL hosting via `@neondatabase/serverless`
- **Google Fonts** - Noto Sans JP for Japanese text optimization
- **Radix UI** - Headless component primitives for accessibility
- **Recharts** - Data visualization for weekly progress reports
- **Embla Carousel** - Touch-friendly carousel components
- **React Hook Form** - Form validation with `@hookform/resolvers`
- **Date-fns** - Date manipulation utilities
- **Wouter** - Lightweight client-side routing
- **TanStack React Query** - Server state management
- **Tailwind CSS** - Utility-first styling framework
- **Vite** - Build tool and development server with HMR support

The app is configured for deployment on Replit with specific development tooling and runtime error handling.