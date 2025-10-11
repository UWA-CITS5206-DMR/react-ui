# MediSim - Medical Simulation Platform (Frontend)

A comprehensive medical simulation platform frontend for healthcare education, featuring patient management, group collaboration, and real-time simulation scenarios.

> **Note**: This is a frontend-only React application. The backend is powered by a separate Django REST API.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Django Backend** (running separately)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
react-ui/
├── src/                    # React frontend source code
│   ├── components/         # UI components
│   │   ├── ui/            # Reusable UI components (shadcn/ui)
│   │   ├── patients/      # Patient-related components
│   │   ├── instructors/   # Instructor components
│   │   ├── student-groups/ # Group collaboration components
│   │   └── layout/        # Layout components
│   ├── pages/             # Application pages
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utility libraries & API client
├── cypress/               # E2E testing
├── scripts/               # Utility scripts
├── docs/                  # Documentation
├── index.html             # HTML entry point
└── vite.config.ts         # Vite configuration
```

## 🔌 Backend Integration

This frontend application communicates with a Django REST API backend. 

### API Configuration

Configure the backend URL in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The API client is located at `src/lib/api-client-v2.ts` and handles all communication with the Django backend.

## � Backend Integration

This frontend application communicates with a Django REST API backend. 

### API Configuration

Configure the backend URL in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The API client is located at `src/lib/api-client-v2.ts` and handles all communication with the Django backend.

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

### Environment Variables

Create a `.env` file in the root directory:

```env
# Django Backend API URL
VITE_API_URL=http://localhost:8000

# Add other environment variables as needed
```

### Development Server

The Vite development server runs on port **5173** by default and provides:
- Hot Module Replacement (HMR)
- Fast refresh
- TypeScript support
- Path aliases (@/, @assets)

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: Uppy for advanced file uploading

### Backend Integration
- **API Communication**: Fetch-based API client
- **Backend**: Django REST Framework (separate repository)
- **Authentication**: Session-based or token-based (configured via API client)
- **Data Format**: JSON REST API

## 🎯 Features

- **User Management**: Multi-role authentication (Student, Instructor, Admin, Coordinator)
- **Session Management**: Create and manage simulation sessions
- **Patient Records**: Comprehensive patient data management
- **Group Collaboration**: Team-based simulation exercises
- **Document Management**: Upload and release medical documents
- **Real-time Updates**: Live collaboration features
- **Timeline Control**: Scheduled events and document releases
- **Audit Logging**: Complete activity tracking

## 📱 User Roles

1. **Students**: Participate in simulations, access patient data
2. **Instructors**: Create sessions, manage patient scenarios
3. **Coordinators**: Upload documents, control information release
4. **Admins**: System administration and user management

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Check what's using the port
   lsof -i :5173
   
   # Vite will automatically try the next available port
   ```

2. **API Connection issues**:
   - Verify Django backend is running
   - Check `VITE_API_URL` in `.env` file
   - Ensure CORS is configured in Django backend

3. **TypeScript errors**:
   ```bash
   # Run type checking
   npm run check
   ```

4. **Dependencies issues**:
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📚 API Documentation

The API documentation is maintained in the Django backend repository.

Key features:
- RESTful API design
- Authentication endpoints
- Patient management
- Session management
- Document handling
- Group collaboration

Refer to the Django backend documentation for complete API reference.

## 🚦 Production Deployment

### Automated Build and Release

This project uses GitHub Actions to automatically build and publish releases.

**Create a release:**

```bash
git tag v1.0.0
git push origin v1.0.0
```

GitHub Actions will automatically build the project and create a release with build artifacts.

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

### Deployment Options

- **Static Hosting**: Netlify, Vercel, AWS S3
- **Nginx**: See configuration example below
- **CDN**: CloudFront or similar
- **GitHub Actions**: Automated builds on tag push

### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/react-ui;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Production Environment Variables

```env
VITE_API_URL=https://your-backend-domain.com
```

## 🆘 Support

For issues and questions:

1. Check the troubleshooting section above
2. Review the [documentation](./docs/)
3. Create an issue in the repository

## 📋 Additional Resources

- [Technical Documentation](./docs/)
- [Architecture Diagrams](./docs/architecture-diagrams.md)
- [Platform Documentation](./docs/PLATFORM_DOCUMENTATION.md)
- Django Backend Repository (separate)
