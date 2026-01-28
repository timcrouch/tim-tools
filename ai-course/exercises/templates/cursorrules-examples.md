# .cursorrules Examples

*Copy the relevant template for your tech stack and customize.*

---

## Node.js / Express API

```
You are working on a Node.js REST API.

Tech stack:
- Runtime: Node.js 20+
- Framework: Express.js
- Database: PostgreSQL with Prisma ORM
- Testing: Vitest
- Language: TypeScript (strict mode)

Project structure:
src/
├── routes/       # Route handlers
├── services/     # Business logic
├── repositories/ # Database access
├── middleware/   # Express middleware
├── utils/        # Helpers
└── types/        # TypeScript types

Conventions:
- Use async/await, never callbacks
- All database queries go through repositories
- Services contain business logic, routes are thin
- Validate inputs with Zod
- Use dependency injection pattern
- Error handling with custom error classes

When writing code:
- Add JSDoc comments for public functions
- Include input validation on all endpoints
- Write tests alongside new features
- Follow REST conventions (proper HTTP methods and status codes)
- Never expose internal errors to clients
```

---

## React / Next.js Frontend

```
You are working on a Next.js 14 application with App Router.

Tech stack:
- Framework: Next.js 14 (App Router)
- Language: TypeScript (strict)
- Styling: Tailwind CSS
- State: React Query + Zustand
- Forms: React Hook Form + Zod
- Testing: Vitest + Testing Library

Project structure:
app/
├── (auth)/       # Auth-required routes
├── api/          # API routes
├── components/   # Shared components
│   ├── ui/       # Base UI components
│   └── features/ # Feature-specific components
└── lib/          # Utilities, hooks, types

Conventions:
- Server Components by default
- Client Components in components/client/ or with 'use client'
- Colocate components with their routes when page-specific
- Use path aliases (@/components, @/lib, etc.)
- Keep components small and focused

When writing code:
- Prefer Server Components for data fetching
- Use suspense boundaries for loading states
- Handle errors at route level with error.tsx
- Add aria labels for accessibility
- Mobile-first responsive design
```

---

## Python / FastAPI

```
You are working on a Python FastAPI backend.

Tech stack:
- Framework: FastAPI
- Python: 3.11+
- Database: PostgreSQL with SQLAlchemy 2.0
- Testing: pytest + pytest-asyncio
- Validation: Pydantic v2

Project structure:
src/
├── api/
│   ├── routes/      # Route handlers
│   └── dependencies/ # Dependency injection
├── core/            # Config, security
├── models/          # SQLAlchemy models
├── schemas/         # Pydantic schemas
├── services/        # Business logic
└── repositories/    # Database queries

Conventions:
- Async everywhere (async def, await)
- Use dependency injection for services
- Pydantic models for all request/response
- Repository pattern for database access
- Type hints on all functions

When writing code:
- Add docstrings to all functions
- Use Annotated for complex dependencies
- Return proper HTTP status codes
- Validate all inputs with Pydantic
- Use transactions for multi-step operations
```

---

## Go / Gin API

```
You are working on a Go REST API.

Tech stack:
- Framework: Gin
- Go version: 1.21+
- Database: PostgreSQL with pgx
- Testing: standard testing + testify
- Config: Viper

Project structure:
├── cmd/
│   └── api/         # Main entry point
├── internal/
│   ├── handlers/    # HTTP handlers
│   ├── services/    # Business logic
│   ├── repository/  # Database access
│   ├── models/      # Data models
│   └── middleware/  # HTTP middleware
└── pkg/             # Shared packages

Conventions:
- Accept interfaces, return structs
- Errors are values - handle them
- Use context for cancellation
- Dependency injection via constructors
- Validate inputs at handler level

When writing code:
- Add godoc comments to exported functions
- Handle all errors explicitly
- Use structured logging (slog)
- Write table-driven tests
- Keep functions small and focused
```

---

## Vue 3 / Nuxt

```
You are working on a Nuxt 3 application.

Tech stack:
- Framework: Nuxt 3
- Language: TypeScript
- Styling: Tailwind CSS + Headless UI
- State: Pinia
- Testing: Vitest + Vue Testing Library

Project structure:
├── components/
│   ├── base/        # Base components (Button, Input, etc.)
│   └── [feature]/   # Feature-specific components
├── composables/     # Shared composition functions
├── pages/           # File-based routing
├── stores/          # Pinia stores
└── server/          # API routes

Conventions:
- Use <script setup lang="ts">
- Composition API only, no Options API
- Auto-import components and composables
- Reactive refs over reactive objects
- Props interface for component props

When writing code:
- Use defineProps<{}>() with TypeScript
- Handle loading and error states
- Add aria attributes for accessibility
- Prefer useFetch for data loading
- Keep components under 200 lines
```

---

## Django

```
You are working on a Django application.

Tech stack:
- Framework: Django 5.0
- Python: 3.11+
- Database: PostgreSQL
- API: Django REST Framework
- Testing: pytest-django

Project structure:
project/
├── apps/
│   └── [app_name]/
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       ├── urls.py
│       └── tests/
├── core/            # Settings, base classes
└── utils/           # Shared utilities

Conventions:
- Fat models, thin views
- Use model managers for queries
- Class-based views with DRF
- Serializers for all API I/O
- Use Django signals sparingly

When writing code:
- Add docstrings to models and views
- Use select_related/prefetch_related
- Write model tests first
- Handle permissions properly
- Use Django admin for internal tools
```

---

## General Backend Template

```
You are working on a backend API project.

Tech stack:
- Language: [LANGUAGE]
- Framework: [FRAMEWORK]
- Database: [DATABASE]
- Testing: [TEST FRAMEWORK]

Conventions:
- [CONVENTION 1]
- [CONVENTION 2]
- [CONVENTION 3]

When writing code:
- Always include error handling
- Add comments for complex logic
- Write tests for new features
- Validate all user inputs
- Use environment variables for config
- Log important operations
- Follow [LANGUAGE] naming conventions
```

---

## Tips for Writing .cursorrules

1. **Be specific about your stack** - Include versions when relevant
2. **Describe your project structure** - AI follows existing patterns
3. **List your conventions** - Coding style, patterns, practices
4. **Include "When writing code" section** - Direct behavior guidelines
5. **Update as project evolves** - Keep it current with your decisions

---

*Created with the AI Mastery Course*
