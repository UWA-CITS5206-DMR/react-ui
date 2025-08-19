# MediSim - Medical Simulation Platform

A comprehensive medical simulation platform for healthcare education, featuring patient management, group collaboration, and real-time simulation scenarios.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MediSimv1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Initialize database connection
   npm run db:init
   
   # Create database tables
   npm run db:push
   ```

4. **Configure environment (optional)**
   ```bash
   # Create .env file to customize settings
   echo "PORT=3000" > .env
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
MediSimv1/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
├── server/                # Express backend server
│   ├── db.ts             # Database configuration
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage logic
│   └── index.ts          # Server entry point
├── shared/               # Shared code between client/server
│   └── schema.ts         # Database schema definitions
├── data/                 # SQLite database files
├── scripts/              # Utility scripts
└── docs/                 # Documentation
```

## 🗄️ Database

This project uses **SQLite** as the local database solution.

### Database Commands

```bash
# Initialize database
npm run db:init

# Push schema changes to database
npm run db:push

# Generate migration files
npm run db:generate

# Run migrations (production)
npm run db:migrate

# Open database management UI
npm run db:studio
```

### Database Files

- **Database file**: `data/medisim.db`
- **WAL file**: `data/medisim.db-wal`
- **Shared memory**: `data/medisim.db-shm`

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run TypeScript type checking
npm run check

# Database operations
npm run db:init     # Initialize database
npm run db:push     # Push schema changes
npm run db:studio   # Open database UI
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Add other environment variables as needed
```

### Port Configuration

The server runs on port **3000** by default. You can change this by:

1. **Environment variable** (recommended):
   ```bash
   PORT=8080 npm run dev
   ```

2. **`.env` file**:
   ```env
   PORT=8080
   ```

3. **Modify default in code**: Edit `server/index.ts`

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query for server state
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js
- **Database**: SQLite with Drizzle ORM
- **Authentication**: Passport.js with session management
- **File Upload**: Multer for file handling
- **API**: RESTful API design

### Database (SQLite + Drizzle)
- **Database**: SQLite for local development
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Visualizer**: Drizzle Studio for database exploration

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
   lsof -i :3000
   
   # Use a different port
   PORT=3001 npm run dev
   ```

2. **Database connection issues**:
   ```bash
   # Reset database
   rm -rf data/
   npm run db:init
   npm run db:push
   ```

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

### Database Reset

If you need to reset the database:

```bash
# Remove database files
rm -rf data/

# Reinitialize
npm run db:init
npm run db:push
```

## 📚 API Documentation

The API follows RESTful conventions. Key endpoints:

- `GET/POST /api/users` - User management
- `GET/POST /api/sessions` - Simulation sessions
- `GET/POST /api/patients` - Patient records
- `GET/POST /api/groups` - Group management
- `GET/POST /api/documents` - Document handling

## 🚦 Production Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set production environment**:
   ```bash
   export NODE_ENV=production
   export PORT=80
   ```

3. **Run migrations**:
   ```bash
   npm run db:migrate
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

## 🆘 Support

For issues and questions:

1. Check the [troubleshooting section](#🔧-troubleshooting)
2. Review the [documentation](./docs/)
3. Create an issue in the repository

## 📋 Additional Resources

- [Database Setup Guide](./DATABASE_SETUP.md)
- [Port Configuration](./PORT_CONFIGURATION.md)
- [Migration Summary](./MIGRATION_SUMMARY.md)
- [Technical Documentation](./docs/)
