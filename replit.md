# EduMentor AI - Personalized Learning Companion

## Overview

EduMentor AI is an AI-powered educational platform that provides personalized learning experiences through adaptive quizzes, intelligent chat assistance, and gamified progress tracking. The application helps students master subjects through dynamic difficulty adjustment, performance analytics, and motivational game mechanics like XP points, levels, badges, and streak tracking.

**Core Features:**
- **AI Chat Assistant**: Interactive study support powered by OpenAI (GPT-5)
- **Adaptive Quiz System**: Difficulty-adjusted questions based on user performance
- **Gamification**: XP progression, levels, badges, and daily streak tracking
- **Analytics Dashboard**: Visual progress tracking with charts and performance metrics
- **Leaderboard**: Competitive learning environment with user rankings

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool

**UI Components**: 
- Built on shadcn/ui component library (Radix UI primitives)
- Custom design system following Material Design 3 principles adapted for education
- Responsive layout with Tailwind CSS for styling
- Design inspirations from Duolingo (gamification), Khan Academy (educational UI), Linear (typography), and Notion (chat interface)

**State Management**:
- TanStack React Query for server state management and caching
- Local component state with React hooks
- No global state management library (Redux/Zustand)

**Routing**: 
- Wouter for client-side routing (lightweight React Router alternative)
- Main routes: Dashboard (`/`), Chat (`/chat`), Quiz (`/quiz`), Leaderboard (`/leaderboard`), Profile (`/profile`)

**Typography System**:
- Primary: Inter for body text and UI elements
- Display: Lexend for headings and gamification callouts
- Monospace: JetBrains Mono for code snippets

### Backend Architecture

**Runtime**: Node.js with Express.js server

**API Design**:
- RESTful API endpoints under `/api` prefix
- Dedicated service layer for business logic (AIService, GamificationService)
- Demo user system (single hardcoded user: `demo-user-1`)

**Data Storage**:
- **Development**: In-memory storage using `MemStorage` class with Map data structures
- **Production Ready**: Drizzle ORM configured for PostgreSQL (via Neon Database)
- Schema defines three main tables: `users`, `quizzes`, `chatMessages`

**Key Services**:
- **AIService**: Handles OpenAI API integration for chat responses and quiz generation
- **GamificationService**: Manages XP calculations, badge awards, level progression, and streak tracking

### Database Schema

**Users Table**:
- Identity: `id`, `username`, `password`
- Gamification: `xp`, `level`, `streak`, `badges[]`, `lastActiveDate`

**Quizzes Table**:
- Quiz data: `topic`, `difficulty`, `question`, `options[]`, `correctAnswer`
- User interaction: `userId`, `userAnswer`, `isCorrect`
- Metadata: `timestamp`

**Chat Messages Table**:
- Message data: `role` (user/assistant), `content`
- Association: `userId`
- Metadata: `timestamp`

**Design Decisions**:
- PostgreSQL arrays used for storing multiple values (options, badges)
- UUID-based primary keys using `gen_random_uuid()`
- Timestamps default to `now()` for automatic tracking
- Drizzle-Zod integration for runtime validation

### Authentication & Authorization

**Current Implementation**: 
- No authentication system (demo mode)
- All requests use hardcoded `DEMO_USER_ID = "demo-user-1"`

**Future Consideration**: 
- Session-based authentication scaffolded (connect-pg-simple for session storage)
- Password hashing not implemented yet

### AI Integration Strategy

**Primary AI Model**: OpenAI GPT-5 (latest model as of August 2025)

**Chat System**:
- Conversation history maintained per user
- System prompt defines AI as supportive learning companion
- Error handling for missing API key (returns helpful error message)

**Quiz Generation**:
- AI generates questions based on topic and difficulty level
- Returns structured quiz objects with question, multiple-choice options, and correct answer
- Adaptive difficulty based on user performance history

## External Dependencies

### Third-Party Services

**OpenAI API**:
- Required for chat assistance and quiz generation
- Configured via `OPENAI_API_KEY` environment variable
- Model: GPT-5 (do not change unless explicitly requested)

**Neon Database**:
- PostgreSQL provider via `@neondatabase/serverless`
- Configured via `DATABASE_URL` environment variable
- Serverless-optimized connection pooling

### Core Libraries

**UI Framework**:
- React 18+ with TypeScript
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- shadcn/ui component patterns

**Data Visualization**:
- Recharts for progress charts and analytics
- Custom XPDisplay component with SVG progress rings

**Form Management**:
- React Hook Form with Zod validation
- `@hookform/resolvers` for schema integration

**Date Handling**:
- date-fns for date formatting and manipulation

**Development Tools**:
- Vite for fast development and building
- ESBuild for server bundling
- Drizzle Kit for database migrations
- TypeScript for type safety across full stack

### API Dependencies

**Environment Variables Required**:
- `OPENAI_API_KEY`: OpenAI API access
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment mode (development/production)