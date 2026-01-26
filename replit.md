# replit.md

## Overview

This is an Arabic-language restaurant website called "مطبخ آدم" (Adam's Kitchen) - an e-commerce style food ordering platform. The application is a full-stack TypeScript project featuring a React frontend with Tailwind CSS styling and an Express backend connected to a PostgreSQL database. The site displays food categories, products, and special offers, with a shopping cart system that sends orders via WhatsApp.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state, React Context for cart state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and scroll animations
- **RTL Support**: Full right-to-left layout with Arabic fonts (Tajawal for body, Aref Ruqaa for display text)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation
- **Build Process**: esbuild for production server bundling, Vite for client

### Data Flow
- Shared schema definitions in `shared/schema.ts` used by both frontend and backend
- API routes defined declaratively in `shared/routes.ts` with type-safe responses
- Storage layer in `server/storage.ts` abstracts database operations

### Key Design Patterns
- **Monorepo Structure**: Client code in `client/`, server in `server/`, shared types in `shared/`
- **Path Aliases**: `@/` maps to client source, `@shared/` maps to shared code
- **Component Organization**: UI primitives in `components/ui/`, feature components at `components/` root

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema-first approach with migrations in `./migrations` directory
- **connect-pg-simple**: Session storage for Express (configured but sessions not actively used)

### Third-Party Services
- **WhatsApp API**: Orders are sent via WhatsApp link to phone number +961 81 984 634
- **Google Fonts**: Tajawal and Aref Ruqaa fonts loaded from Google Fonts CDN

### UI Component Libraries
- **shadcn/ui**: Full component library with Radix UI primitives
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel/slider functionality

### Development Tools
- **Vite**: Development server with HMR and production builds
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment