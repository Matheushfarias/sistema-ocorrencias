# BO.Militar - Emergency Response System

## Overview

BO.Militar is a comprehensive emergency response platform designed to connect Brazilian citizens with the Polícia Militar (PM) and Corpo de Bombeiros (Fire Department). The system enables citizens to register emergency occurrences and track their status, while emergency service attendants can receive, dispatch, and manage these incidents in real-time. The platform includes geolocation support, real-time chat, media uploads, and status tracking throughout the emergency response lifecycle.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, built using Vite as the build tool.

**UI Component Library**: Shadcn/ui components based on Radix UI primitives, styled with Tailwind CSS. The design follows Material Design 3 principles adapted for emergency services with enhanced contrast and visibility.

**State Management**: TanStack Query (React Query) for server state management, with local React state for UI-specific concerns.

**Routing**: Single-page application with view-based navigation using state management. No client-side router library is used; instead, views are controlled through component state.

**Design System**: 
- Custom color palette with specific colors for PM (police - blue) and Bombeiros (fire department - red/orange)
- Emergency status colors: aguardando (waiting), despachado (dispatched), atendimento (in service), concluido (completed)
- Responsive layout using Tailwind breakpoints
- Accessibility-focused with proper ARIA labels and keyboard navigation

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API pattern with JSON payloads. All endpoints prefixed with `/api`.

**Authentication**: JWT (JSON Web Token) based authentication with bearer token scheme. Passwords are hashed using bcrypt. Session secrets stored in environment variables.

**Middleware Stack**:
- JSON body parsing with raw body preservation for webhooks
- CORS support for cross-origin requests
- Express session management
- Custom authentication middleware with role-based access control (RBAC)
- Request logging with timing information

**File Uploads**: Multer for handling multipart/form-data with local disk storage. Uploaded files stored in `/uploads` directory with size limits (50MB) and type restrictions (images and videos only).

**Development Setup**: Vite middleware integration for hot module replacement (HMR) in development mode.

### Database Architecture

**ORM**: Drizzle ORM for type-safe database queries and migrations.

**Database**: PostgreSQL (using Neon serverless driver with WebSocket support).

**Schema Design**:
- **users**: Polymorphic table supporting both citizen and attendant user types with institution-specific fields
- **occurrences**: Emergency incident records with geolocation (latitude/longitude), status tracking, and foreign key to citizens
- **occurrence_media**: File attachments for occurrences (photos/videos)
- **messages**: Real-time chat messages linked to occurrences
- **status_history**: Audit trail of status changes

**Enums**: PostgreSQL enums for type safety on user_type, institution, occurrence_status, and message_role.

**Unique Constraints**: Auto-generated occurrence codes following pattern `BO-{YEAR}-{6-digit-random}`.

### Authentication & Authorization

**User Types**:
1. **Cidadao (Citizen)**: Can create occurrences, view their own occurrences, and chat with attendants
2. **Atendente (Attendant)**: PM or Bombeiros staff who can view all occurrences for their institution, update status, and communicate with citizens

**Access Control**:
- JWT payload contains userId, user type, and institution
- Middleware functions `authMiddleware`, `requireCidadao`, and `requireAtendente` enforce role-based access
- Tokens stored in localStorage on client with 7-day expiration
- Authorization header: `Bearer {token}`

**Password Security**: bcrypt with salt rounds of 10 for password hashing.

### Real-time Features

**Polling Strategy**: Client-side polling at 5-second intervals for chat messages when chat view is active. Uses React Query's `refetchInterval` option.

**Status Updates**: Real-time status changes recorded in status_history table with timestamps and triggering user information.

### File Storage

**Upload Strategy**: Local filesystem storage using Multer with custom filename generation (timestamp + random suffix).

**Supported Types**: JPEG, PNG, WebP images; MP4, WebM videos.

**File Metadata**: Tracked in occurrence_media table including original filename, MIME type, size, and storage filename.

## External Dependencies

### Third-Party Libraries

**UI Components**: 
- Radix UI primitives (@radix-ui/*) for accessible, unstyled components
- Tailwind CSS for utility-first styling
- class-variance-authority and clsx for component variant management
- Lucide React for icons

**Form Management**:
- React Hook Form with Zod resolvers for validation
- Zod for schema validation shared between client and server

**Data Fetching**: TanStack Query for server state management, caching, and background updates.

**Backend Utilities**:
- bcryptjs for password hashing
- jsonwebtoken for JWT creation and verification
- multer for file upload handling
- nanoid for unique ID generation

### Database & ORM

**Database Provider**: Neon serverless PostgreSQL (@neondatabase/serverless) with WebSocket support for serverless environments.

**ORM**: Drizzle ORM (drizzle-orm) with Drizzle Kit for migrations.

**Session Store**: connect-pg-simple for PostgreSQL-backed session storage (optional, JWT is primary).

### Build Tools

**Frontend Build**: Vite with React plugin, TypeScript support, and Replit-specific plugins (runtime error overlay, cartographer, dev banner).

**Backend Build**: esbuild for server bundling with selective dependency bundling to reduce cold start times.

**Development**: tsx for running TypeScript directly in development mode.

### Environment Variables

**Required**:
- `DATABASE_URL`: PostgreSQL connection string (Neon)
- `SESSION_SECRET`: JWT signing secret (defaults to hardcoded value if not set)

**Optional**:
- `NODE_ENV`: development/production mode
- `REPL_ID`: Replit-specific environment detection