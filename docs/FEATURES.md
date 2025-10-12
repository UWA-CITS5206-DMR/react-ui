# Digital Medical Records (DMR) Frontend Documentation

This document provides a comprehensive overview of the DMR frontend application, including features, user roles, and technology stack.

## Table of Contents

- [Features](#features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)

---

## Features

### Patient Management

- Comprehensive patient records and medical history
- Document management (admission notes, pathology, imaging, diagnostics)
- File upload and preview with Uppy
- SOAP notes (Subjective, Objective, Assessment, Plan)
- Discharge summaries
- Patient list and search functionality

### Group Collaboration

- Team-based clinical practice where each student group shares one user account
- Real-time observations recording (vital signs, clinical notes) associated with group account
- Investigation requests (imaging, blood tests) scoped to the authenticated group
- Medication orders and discharge summaries
- Backend API ensures groups can only access their own data
- Group activity tracking across the 5-week simulation period

### Request Management

- Investigation request workflow (pending → completed)
- Student-side: Create and view own group's requests
- Instructor-side: Full management of all diagnostic requests from all groups
- Lab request approval and status tracking
- File access control through approved file system with page-range authorization
- Students can only access files linked to their completed requests
- Request dashboard, to-do lists, and statistics for instructors

### User Management

- Multi-role authentication and authorization (Admin, Instructor, Student)
- Role-based dashboards and permissions
- User activity audit logging

---

## User Roles

The platform supports three distinct user roles:

### 1. Students (Student Group Shared Accounts)

Students operate using a **student group shared account model**, where each student group shares a single user account for login. All observations and requests are associated with that group's account.

#### Key Capabilities

- View patient records and documents (with page-level access control)
- Submit observations (vital signs, clinical notes)
- Create investigation requests (imaging, blood tests)
- Order medications
- Create discharge summaries
- Access approved files for completed requests only

#### Access Control

- Can only view and modify their own group's records (enforced by backend API)
- **File Access**: Students can only access files linked to their completed requests, controlled by three combined conditions:
  1. Approved file record must exist linking file to request
  2. Page range specifies which pages are accessible
  3. Associated request must have completed status
- Cannot upload patient files or manage other groups' data
- All operations are automatically scoped to the authenticated group account

### 2. Instructors

#### Key Capabilities

- Manage all diagnostic requests (imaging, blood tests, medications) from all student groups
- Review and approve investigation requests
- Update request status (pending → completed)
- Upload and manage patient files
- Configure file access permissions (`ApprovedFile` with page ranges)
- View all student observations (read-only access)
- Access dashboard with request statistics and to-do lists
- Monitor student progress across all groups

#### Access Control

- Full access to all patient files and request management
- Can manage requests from all student groups
- **Read-only access to student observations** (cannot create or modify observations)
- Access to instructor-specific management endpoints
- Can create approved file records to grant students access to specific file pages

### 3. Admins

#### System Administration

- Full system access and control without restrictions
- User management (create, edit, delete users)
- Role assignment and permission management
- System-wide settings and configuration
- Access to Django admin interface at `/admin/`

#### Complete Resource Access

- **Observations**: Full CRUD access (create, read, update, delete) to all observations from all groups
- **Lab Requests**: Full CRUD access to all diagnostic requests (imaging, blood tests, medications) from all groups
- **Patient Files**: Complete access to all files and file management operations
- **File Access Management**: Can create, modify, and delete approved file records for any request
- **User Management**: Full control over user accounts, roles, and group assignments
- **System Configuration**: Access to all system settings and administrative functions

---

## Technology Stack

### Frontend

**Runtime Requirements:**

- **Node.js**: v20 or higher (recommended)
- **npm**: v8 or higher
- **Backend**: Django REST API (Python 3.12+, Django 5.2+)

**Framework and Libraries:**

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 for fast development and optimized builds
- **Styling**: Tailwind CSS 3 with custom components
- **Routing**: Wouter 3 (lightweight React router)
- **State Management**: TanStack Query (React Query) v5 for server state
- **UI Components**: Radix UI primitives with shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: Uppy for advanced file uploading
- **Charts**: Recharts for data visualization
- **Animation**: Framer Motion for smooth animations
- **Icons**: Lucide React and React Icons
- **Testing**: Cypress for E2E testing

### Backend

For backend technology stack details, see the [Django Backend Repository](https://github.com/UWA-CITS5206-DMR/dmrserver).
