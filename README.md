# Digital Medical Records (DMR) Frontend

A comprehensive medical simulation platform frontend for healthcare education, featuring patient management, group collaboration, and real-time simulation scenarios.

> **Note**: This is a frontend-only React application. The backend is powered by a separate Django REST API.
>
> **Backend Repository**: [UWA-CITS5206-DMR/dmrserver](https://github.com/UWA-CITS5206-DMR/dmrserver)

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v20 or higher recommended)
- **npm** (v8 or higher)
- **Django Backend** (running separately) - [UWA-CITS5206-DMR/dmrserver](https://github.com/UWA-CITS5206-DMR/dmrserver)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/UWA-CITS5206-DMR/react-ui.git
   cd react-ui
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:

   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to: `http://localhost:5173`

## 📁 Project Structure

```text
react-ui/
├── src/                   # React frontend source code
│   ├── components/        # UI components
│   │   ├── ui/            # Reusable UI components (shadcn/ui)
│   │   ├── patients/      # Patient-related components
│   │   ├── instructors/   # Instructor components
│   │   ├── student-groups/# Group collaboration components
│   │   └── layout/        # Layout components
│   ├── pages/             # Application pages
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility libraries & API client
├── cypress/               # E2E testing
├── docs/                  # Documentation
├── .github/               # GitHub Actions workflows
├── index.html             # HTML entry point
└── vite.config.ts         # Vite configuration
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run TypeScript type checking
npm run check
```

### Development Server

The Vite development server runs on port **5173** by default and provides:

- Hot Module Replacement (HMR)
- Fast refresh
- TypeScript support
- Path aliases (`@/`, `@assets`)

### Testing

Run end-to-end tests with Cypress:

```bash
# Open Cypress Test Runner
npx cypress open

# Run tests in headless mode
npx cypress run
```

Tests are located in the `cypress/e2e/` directory.

## 🏗️ Technology Stack

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
- **Testing**: Cypress for E2E testing

## 🎯 Features

### Patient Management

- Comprehensive patient records and medical history
- Document management (admission notes, pathology, imaging, diagnostics)
- File upload and preview with Uppy
- SOAP notes (Subjective, Objective, Assessment, Plan)
- Discharge summaries
- Patient list and search functionality

### Group Collaboration

- Team-based clinical practice with shared student group accounts
- Real-time observations recording (vital signs, clinical notes)
- Investigation requests (imaging, blood tests)
- Medication orders
- Discharge summaries
- Group activity tracking

### Request Management

- Investigation request workflow (pending → completed)
- Lab request approval and status tracking
- File access control through `ApprovedFile` system
- Page-level document authorization
- Request dashboard and statistics for instructors

### User Management

- Multi-role authentication and authorization (Admin, Instructor, Student)
- Role-based dashboards and permissions
- User activity audit logging

## User Roles

The platform supports three distinct user roles:

### 1. Students (Student Group Shared Accounts)

Students operate using a **student group shared account model**, where one student group shares a single login account. All observations and requests are associated with the group account.

**Key Capabilities**:

- View patient records and documents (with page-level access control)
- Submit observations (vital signs, clinical notes)
- Create investigation requests (imaging, blood tests)
- Order medications
- Create discharge summaries
- Access approved files for completed requests only

**Access Control**:

- Can only view and modify their own group's records
- File access restricted by `ApprovedFile` and completed request status
- Cannot upload patient files or manage other groups' data

### 2. Instructors

**Key Capabilities**:

- Manage all diagnostic requests (imaging, blood tests, medications)
- Review and approve investigation requests
- Update request status (pending → completed)
- Upload and manage patient files
- Configure file access permissions (`ApprovedFile` with page ranges)
- View all student observations (read-only)
- Access dashboard with request statistics
- Provide feedback and monitor student progress

**Access Control**:

- Full access to all patient files
- Can manage requests from all student groups
- Cannot modify student observations directly

### 3. Admins

**System Administration**:

- Full system access and control
- User management (create, edit, delete users)
- Role assignment and permission management
- System-wide settings and configuration
- Complete access to all resources without restrictions

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**

   ```bash
   # Check what's using the port
   lsof -i :5173
   ```

   Vite will automatically try the next available port (5174, 5175, etc.).

2. **API Connection issues**

   - Verify Django backend is running on the configured port
   - Check `VITE_API_BASE_URL` in `.env` file
   - Ensure CORS is configured in Django backend settings
   - Check browser console for network errors

3. **TypeScript errors**

   ```bash
   # Run type checking
   npm run check
   ```

4. **Dependencies issues**

   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

5. **Build failures**

   - Ensure Node.js version is 18 or higher
   - Clear build cache: `rm -rf dist`
   - Check for TypeScript errors: `npm run check`

## 📚 API Documentation

The API documentation is maintained in the Django backend repository:
[UWA-CITS5206-DMR/dmrserver](https://github.com/UWA-CITS5206-DMR/dmrserver)

## 🚦 Production Deployment

### Automated Build and Release

This project uses GitHub Actions to automatically build and publish releases when you push a version tag.

**Create a release:**

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will automatically:

1. Run type checking
2. Build the project
3. Create release artifacts (`.tar.gz` and `.zip`)
4. Publish a GitHub Release

**Download build artifacts:**

```bash
# Latest version
wget https://github.com/UWA-CITS5206-DMR/react-ui/releases/latest/download/react-ui-dist.tar.gz

# Specific version
wget https://github.com/UWA-CITS5206-DMR/react-ui/releases/download/v1.0.0/react-ui-dist.tar.gz
```

**Extract and deploy:**

```bash
tar -xzf react-ui-dist.tar.gz -C /var/www/react-ui
```

### Manual Build

```bash
npm run build
```

Built files will be in the `dist/` directory.

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/react-ui;
    index index.html;

    # SPA routing - redirect all requests to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
}
```

### Production Environment Variables

```env
VITE_API_BASE_URL=https://api.your-domain.com
```

**Important**: Rebuild the application after changing environment variables, as Vite embeds them at build time.

## 🆘 Support

For issues and questions:

1. Check the [Troubleshooting](#-troubleshooting) section above
2. Review the [documentation](./docs/)
3. Check existing [GitHub Issues](https://github.com/UWA-CITS5206-DMR/react-ui/issues)
4. Create a new issue if needed

## 📋 Additional Resources

- [Technical Documentation](./docs/)
- [Architecture Diagrams](./docs/architecture-diagrams.md)
- [Platform Documentation](./docs/PLATFORM_DOCUMENTATION.md)
- [Frontend Stack Details](./docs/FRONTEND_STACK.md)
- [Django Backend Repository](https://github.com/UWA-CITS5206-DMR/dmrserver)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
