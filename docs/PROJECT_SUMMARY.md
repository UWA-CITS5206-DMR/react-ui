# DMR Frontend Project Summary

This document provides a comprehensive project overview, system architecture, component boundaries, routing structure, and key implementation details. For setup and deployment instructions, see [README.md](../README.md).

## 1. Project Purpose and Context

This is a React + TypeScript-based Digital Medical Records (DMR) simulation frontend for teaching practice: students record observations and notes, and initiate lab requests under shared group accounts; instructors review and manage requests. The system serves approximately 40 student groups rotating through 4 wards during a 5-week simulation period.

**Key Characteristics:**

- **Tech Stack**: React 18 with TypeScript
- **Build Tool**: Vite 5 for fast development and optimized builds
- **Styling**: Tailwind CSS 3 with shadcn/ui components
- **Routing**: Wouter 3 (lightweight React router)
- **State Management**: TanStack Query (React Query) v5 for server state
- **Authentication**: Token-based authentication with role-based access control
- **API Client**: Custom API client (`api-client-v2.ts`) for backend communication

For setup and running instructions, see `README.md` in the root directory.

## 2. Routing and Component Boundaries

### 2.1 Top-level Routes (`src/App.tsx`)

- `/` → Role-based dashboard (redirects based on user role)
- `/student` → Student Dashboard (`StudentDashboard`)
- `/instructor` → Instructor Dashboard (`InstructorDashboard`)
- `/admin` → Admin Dashboard (`AdminDashboard`)
- `/group-manager` → Group Manager (`GroupManager`)

### 2.2 Component Organization

The application follows a feature-based component structure:

- **`components/ui/`**: Reusable UI primitives (shadcn/ui components)

  - Form elements (Button, Input, Select, etc.)
  - Layout components (Card, Dialog, Sheet, Tabs)
  - Data display (Table, Avatar, Badge, etc.)

- **`components/layout/`**: Application layout components

  - Navigation bars, sidebars, and page containers

- **`components/patients/`**: Patient management features

  - `patient-list.tsx`: Patient browsing and search
  - `patient-overview.tsx`: Patient detail view
  - `patient-header.tsx`: Patient information header
  - `patient-documents.tsx`: Document management interface
  - `file-management.tsx`: File upload and management (instructor/admin only)
  - `file-preview-dialog.tsx`: PDF viewer with page authorization
  - `soap-notes-form.tsx`: SOAP notes entry form
  - `discharge-summary.tsx`: Discharge summary creation

- **`components/student-groups/`**: Student collaboration features

  - `observations/`: Vital signs recording (blood pressure, heart rate, temperature, etc.)
  - `investigation-requests/`: Lab request forms (imaging, blood tests)
  - `medication-orders/`: Medication order management
  - `student-patient-overview.tsx`: Student view of patient data

- **`components/instructors/`**: Instructor management features

  - `instructor-lab-requests.tsx`: Request approval and management
  - `instructor-patient-overview.tsx`: Instructor view with full control

- **`pages/`**: Top-level page components

  - `landing.tsx`: Landing page with login
  - `login.tsx`: Authentication page
  - `student-dashboard.tsx`: Student interface
  - `instructor-dashboard.tsx`: Instructor interface
  - `admin-dashboard.tsx`: Admin interface
  - `group-manager.tsx`: Group management
  - `not-found.tsx`: 404 page

- **`lib/`**: Utility functions and API client
  - `api-client-v2.ts`: Backend API communication
  - `queryClient.ts`: TanStack Query configuration
  - `utils.ts`: Helper functions
  - `error-utils.ts`: Error handling utilities

## 3. User Roles and Access Control

### 3.1 Role Overview

The system defines three user roles:

- **admin**: Full system access (superusers)
- **instructor**: Teaching staff with management capabilities
- **student**: Student group shared accounts with restricted access

Role determination is handled by the backend API during authentication. The frontend enforces role-based features through conditional rendering and route protection.

### 3.2 Access Control Architecture

The system follows **RBAC (Role-Based Access Control)** principles for access management.

**Backend Access Control:**

The backend API implements comprehensive permission checks based on:

- **Resource-Based Permissions**: API endpoints enforce permissions based on the resource being accessed (patients, files, observations, requests)
- **Method-Level Control**: Different HTTP methods (GET, POST, PUT, DELETE) have different permission requirements per role
- **Object-Level Control**: Ownership validation ensures students can only access their own group's data
- **Role Verification**: Each request is validated against the user's role (admin, instructor, student)

For detailed information about backend permission architecture and implementation, see the [Backend Repository](https://github.com/UWA-CITS5206-DMR/dmrserver).

**Frontend Implementation:**

- **Authentication State**: Managed by `AuthProvider` (`hooks/use-auth.tsx`)
- **Role-Based UI**: Conditional rendering of components based on user role
- **Route Protection**: Unauthorized users are redirected to the login page
- **API Integration**: API client (`lib/api-client-v2.ts`) automatically includes authentication token in all requests
- **Error Handling**: 403 Forbidden responses trigger appropriate UI feedback

**Access Control Flow:**

1. User logs in → receives authentication token and role from backend
2. Frontend stores token and role in state
3. User attempts to access a feature → frontend checks role for UI rendering
4. API request is made → backend validates permissions
5. Backend returns data or error → frontend updates UI accordingly

### 3.3 Role-Based Features

**Students (Student Group Shared Accounts):**

Students operate using a **student group shared account model**, where each student group shares a single Django User account for login. All observations and requests are associated with that group's account.

- View patient records and documents (with page-level access control)
- Submit observations (vital signs, clinical notes)
- Create investigation requests (imaging, blood tests)
- Order medications
- Create discharge summaries
- Access approved files for completed requests only
- Can only view and modify their own group's records (enforced by backend)
- File access controlled by three-tier mechanism: `ApprovedFile` + `page_range` + completed request status

**Instructors:**

- Manage all diagnostic requests (imaging, blood tests, medications) from all student groups
- Review and approve investigation requests
- Update request status (pending → completed)
- Upload and manage patient files
- Configure file access permissions (`ApprovedFile` with page ranges)
- View all student observations (read-only access)
- Access dashboard with request statistics and to-do lists
- Monitor student progress across all groups

**Admins:**

- Full system access and control
- User management (create, edit, delete users)
- Role assignment and permission management
- System-wide settings and configuration
- Complete access to all resources without restrictions

## 4. Key Features and Business Flow

### 4.1 Patient Management

- Comprehensive patient records and medical history
- Document management (admission notes, pathology, imaging, diagnostics)
- File upload and preview with Uppy integration
- SOAP notes (Subjective, Objective, Assessment, Plan)
- Discharge summaries
- Patient list and search functionality

### 4.2 Group Collaboration - Student Group Shared Account Model

**Account Model:**

The system adopts a **"student group shared account"** model for teaching practice:

- Each student group shares **one Django User account** for login
- The `user` foreign key in all models (observations, requests, etc.) represents the **group's shared account**, not individual students
- All observations, requests, and records created by any member of the group are associated with the same group account
- When logged in, all group members access and operate on the same shared data set

**"Own Records" Definition:**

- In the shared account model, "own records" refers to records associated with the authenticated group account
- This is equivalent to "records belonging to this group"
- All members of the same group see the same data when logged in with the group account
- There is no per-student data distinction within a group

**Permission Enforcement:**

- Backend API enforces object-level permission checks on all requests
- Students can only view and modify records associated with their group's account
- Cross-group access is strictly prevented by the backend
- Example: Group A cannot access observations created by Group B, even though both are "students"

**Practical Workflow:**

- **Team-based clinical practice**: All group members collaborate using the shared account
- **Real-time observations**: Vital signs and clinical notes are recorded under the group account
- **Investigation requests**: Imaging and blood test requests are automatically associated with the authenticated group
- **Medication orders and discharge summaries**: Created and managed by the group
- **Group activity tracking**: All activities are tracked across the 5-week simulation period under the group's account

**Technical Implementation:**

**Frontend:**

- User authentication returns the group's authentication token and role from the backend API
- Token is stored and included in all subsequent API requests via the API client
- UI components conditionally render based on the user's role
- All API requests for student operations include the authentication token

**Backend API Behavior:**

- Student-side creation endpoints automatically associate records with the authenticated group
- Student-side query endpoints return only data belonging to the authenticated group
- Object ownership is verified before allowing access or modifications
- Cross-group data access is prevented through automatic filtering

For detailed backend implementation, see the [Backend Repository](https://github.com/UWA-CITS5206-DMR/dmrserver).

### 4.3 Request Management

- Investigation request workflow (pending → completed)
- Student-side: Create and view own group's requests (automatically scoped by backend)
- Instructor-side: Full CRUD management of all diagnostic requests
- Lab request approval and status tracking with backend validation
- File access control through approved file system with page-range authorization
- Students can only access files linked to their completed requests
- Request dashboard, to-do lists, and statistics for instructors

### 4.4 File Access Control

**Role-Based Access:**

- **Admins/Instructors**: Full access to all patient files without restrictions
- **Students**: Restricted access based on three combined conditions:
  1. `ApprovedFile` record must exist linking the file to a request
  2. `page_range` specifies which pages are accessible (e.g., "1-3")
  3. Associated request must have `status="completed"`

**Access Control Flow:**

1. Student submits a lab request (e.g., imaging request, blood test request)
2. Instructor approves the request and changes status to "completed"
3. Instructor creates an approved file record linking the request to a file with specific page range
4. Student can now access only the authorized pages of that file
5. Backend API enforces all three conditions before serving file content

**Technical Implementation:**

**Backend API:**

- Enforces file access permissions at the API level
- Validates three conditions before serving file content to students:
  - Approved file record exists for the request
  - Requested pages are within the approved page range
  - Associated request has completed status
- Admins and instructors have unrestricted access to all files

**Frontend Components:**

- `file-preview-dialog.tsx`: PDF preview component that renders only authorized pages
- `file-management.tsx`: File upload and management interface (instructor/admin only)
- API client handles file download requests and error responses

**Example User Flow:**

1. **Student submits request**: Student Group A creates an imaging request through the frontend form

   - Request status: "pending"
   - Associated with: Student Group A's account

2. **Instructor reviews**: Instructor views all pending requests in their dashboard

   - Reviews the imaging request from Student Group A
   - Changes request status to "completed"

3. **Instructor grants access**: Instructor creates an approved file record

   - Links a radiology report PDF to the request
   - Specifies accessible pages: "1-3"

4. **Student accesses file**: Student Group A can now view the file
   - Can view pages 1-3 of the radiology report
   - Cannot view pages 4+ (outside approved range)
   - Student Group B cannot view this file (different group)

For detailed backend implementation of file access control, see the [Backend Repository](https://github.com/UWA-CITS5206-DMR/dmrserver).

## 5. State Management and Data Flow

### 5.1 TanStack Query (React Query)

The application uses TanStack Query for all server state management:

- **Queries**: Fetching data from backend (patients, requests, observations)
- **Mutations**: Creating, updating, deleting resources
- **Caching**: Automatic caching and invalidation
- **Optimistic Updates**: Immediate UI feedback with rollback on error

### 5.2 Authentication Flow

1. User logs in via `landing.tsx` or `login.tsx`
2. Backend returns authentication token and user role
3. Token stored in localStorage and added to API requests
4. `AuthProvider` (`hooks/use-auth.tsx`) manages auth state
5. Protected routes redirect unauthenticated users to landing page
6. Role-based rendering shows/hides features based on user role

### 5.3 API Client

`lib/api-client-v2.ts` provides type-safe API communication:

- Automatic token injection in request headers
- Error handling and transformation
- Response type validation
- Request/response interceptors

## 6. Technology Stack

### Frontend Technologies

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 for fast development and optimized builds
- **Styling**: Tailwind CSS 3 with custom components
- **Routing**: Wouter 3 (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI primitives with shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: Uppy for advanced file uploading
- **Charts**: Recharts for data visualization
- **Animation**: Framer Motion for smooth animations
- **Icons**: Lucide React and React Icons
- **Testing**: Cypress for E2E testing

### Backend

For backend technology stack details, see the [Django Backend Repository](https://github.com/UWA-CITS5206-DMR/dmrserver).

## 7. Development Guidelines

### 7.1 Component Design Principles

- **Single Responsibility**: Each component should have one clear purpose
- **Composition**: Build complex UIs from small, reusable components
- **Type Safety**: Use TypeScript for all components and utilities
- **Accessibility**: Follow WCAG guidelines, use semantic HTML and ARIA attributes
- **Performance**: Use React.memo, useMemo, useCallback for optimization

### 7.2 Naming Conventions

- **Files**: kebab-case (e.g., `patient-list.tsx`)
- **Components**: PascalCase (e.g., `PatientList`)
- **Functions**: camelCase (e.g., `fetchPatients`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### 7.3 State Management Best Practices

- Use TanStack Query for server state (data from API)
- Use React hooks (useState, useReducer) for local UI state
- Avoid prop drilling by using context when necessary
- Keep state as close to where it's used as possible

### 7.4 API Integration

- Use `lib/api-client-v2.ts` for all backend communication
- Define query keys consistently for cache management
- Handle loading and error states in components
- Use optimistic updates for better UX

## 8. Testing Strategy

### 8.1 E2E Testing with Cypress

- Test critical user flows (login, patient viewing, request creation)
- Test role-based access control
- Test file upload and preview functionality
- Test form validation and submission

### 8.2 Test Organization

Tests are located in `cypress/e2e/` and follow naming convention:

- `{feature}.cy.ts` (e.g., `patient-list.cy.ts`)

## 9. Build and Deployment

### 9.1 Development

```bash
npm run dev  # Start Vite dev server at http://localhost:5173
```

### 9.2 Production Build

```bash
npm run build  # Build to dist/ directory
npm run preview  # Preview production build locally
```

### 9.3 Environment Variables

Environment variables must be prefixed with `VITE_` to be exposed to client:

```env
VITE_API_BASE_URL=https://api.your-domain.com
```

**Important**: Rebuild after changing environment variables, as Vite embeds them at build time.

### 9.4 Automated Releases

GitHub Actions automatically builds and publishes releases when you push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## 10. Quick Reference

**Key Configuration Files:**

- Vite Config: `vite.config.ts`
- TypeScript Config: `tsconfig.json`
- Tailwind Config: `tailwind.config.ts`
- Package Manager: `package.json`

**Module Locations:**

- **Pages**: `src/pages/` (top-level routes)
- **Components**: `src/components/` (organized by feature)
- **API Client**: `src/lib/api-client-v2.ts`
- **Hooks**: `src/hooks/` (custom React hooks)
- **UI Components**: `src/components/ui/` (shadcn/ui)
- **Tests**: `cypress/e2e/` (E2E tests)

**Related Documentation:**

- Setup Guide: [README.md](../README.md)

**Backend Documentation:**

For backend documentation, see the [Django Backend Repository](https://github.com/UWA-CITS5206-DMR/dmrserver).
