# Digital Medical Records Simulation Platform

## Overview

This project is a comprehensive medical education simulation platform that replicates a digital medical records system. The application provides an immersive learning environment where students can practice clinical decision-making in simulated emergency department scenarios. The platform supports four distinct user roles: System Administrator, Simulation Coordinator, Instructor, and Student, each with specialized functionality and access controls.

The system simulates realistic patient encounters with dynamic vital signs, laboratory results, medical histories, and the ability to write SOAP notes and place medical orders. The platform creates an authentic clinical experience without the risks associated with real patient care, enhanced by advanced features like data versioning, document management, and comprehensive audit trails.

## Recent Updates (January 2025)

- **Complete Four-Role Implementation**: Successfully implemented System Administrator and Simulation Coordinator roles alongside existing Student and Instructor functionality
- **Advanced Data Management**: Added data versioning system for group-specific patient data isolation
- **Document Management System**: Implemented coordinator-controlled document upload, scheduling, and release functionality  
- **Comprehensive API Layer**: Extended backend with full CRUD operations for all new features
- **Enhanced Security**: Added audit logging and role-based access control for all system operations
- **Production-Ready Architecture**: Fixed API integration issues and ensured stable operation across all user roles
- **Complete Documentation Suite**: Created comprehensive technical and product architecture documentation in `docs/` directory
  - Technical architecture with detailed frontend/backend implementation
  - Product architecture covering user roles and feature specifications
  - User guides and platform documentation in Chinese
  - Centralized documentation index for easy navigation
- **Group-Level Data Isolation**: Implemented comprehensive data isolation architecture (January 8, 2025)
  - Added middleware for group access control and patient data validation
  - SOAP notes and medical orders now filtered by group membership
  - Patients assigned to groups through data version system
  - Complete documentation of isolation mechanisms in `docs/data-isolation-architecture.md`
  - Created patient assignment configuration guide in `docs/group-patient-assignment-guide.md`
  - Restored normal patient access while maintaining isolation infrastructure
  - System Administrator Dashboard provides full group and patient assignment management

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React with TypeScript, leveraging modern development patterns including:
- **Component-based architecture** using functional components with hooks
- **State management** through React Context for authentication and React Query for server state
- **UI component library** based on Radix UI primitives with shadcn/ui styling
- **Routing** handled by Wouter for lightweight client-side navigation
- **Styling** implemented with Tailwind CSS for utility-first responsive design
- **Build system** powered by Vite for fast development and optimized production builds

### Backend Architecture
The server follows a RESTful API design using Express.js with TypeScript:
- **Route-based organization** with centralized route registration
- **Middleware pipeline** for request logging, JSON parsing, and error handling
- **Storage abstraction layer** providing a clean interface for data operations
- **Session-based authentication** with simple credential verification
- **Development tooling** integrated with Vite for hot module replacement in development

### Data Storage Solutions
The application uses a PostgreSQL database accessed through Drizzle ORM:
- **Schema-first approach** with type-safe database operations
- **Migration management** through Drizzle Kit for database evolution
- **Connection pooling** via Neon serverless PostgreSQL for scalability
- **Shared schema types** between client and server for type consistency
- **Validation layer** using Zod schemas derived from database models

### Authentication and Authorization
Simple role-based authentication system:
- **Username/password authentication** with plaintext storage (suitable for educational environments)
- **Role-based access control** distinguishing between student and instructor capabilities
- **Session persistence** using localStorage for client-side session management
- **Route protection** based on authentication status and user roles

### Key Domain Models
The database schema supports comprehensive medical record simulation:
- **User management** with role-based permissions for students and instructors
- **Session orchestration** allowing instructors to manage multiple concurrent scenarios
- **Patient records** with complete demographic and clinical information
- **Vital signs tracking** with historical data and real-time updates
- **Laboratory results** with instructor-controlled release timing
- **SOAP notes** for structured clinical documentation
- **Medical orders** for tracking student clinical decisions
- **Medical history and medications** for comprehensive patient profiles

### Real-time Features
The system supports dynamic scenario management:
- **Instructor controls** for real-time patient condition updates
- **Laboratory result release** allowing instructors to simulate lab timing
- **Session monitoring** with participant tracking and time management
- **Notification system** for important clinical updates and alerts

## External Dependencies

### Database and ORM
- **Neon PostgreSQL** - Serverless PostgreSQL database for scalable data storage
- **Drizzle ORM** - Type-safe database toolkit with excellent TypeScript integration
- **Drizzle Kit** - Database migration and schema management tools

### UI and Styling
- **Radix UI** - Comprehensive set of accessible component primitives
- **shadcn/ui** - Pre-built component library with consistent design patterns
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Lucide React** - Icon library providing medical and general purpose icons

### State Management and API
- **TanStack React Query** - Server state management with caching and synchronization
- **React Hook Form** - Form handling with validation and error management
- **Zod** - Runtime type validation and schema definition

### Development Tools
- **Vite** - Build tool providing fast development server and optimized builds
- **TypeScript** - Static type checking for enhanced development experience
- **ESBuild** - Fast JavaScript bundler for production builds
- **Wouter** - Lightweight routing library for client-side navigation

### Runtime and Utilities
- **Express.js** - Web application framework for the REST API server
- **tsx** - TypeScript execution environment for development
- **date-fns** - Date manipulation utilities for handling timestamps
- **class-variance-authority** - Utility for building variant-based component APIs
- **clsx** - Conditional className utility for dynamic styling