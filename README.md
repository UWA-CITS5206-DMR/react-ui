# Digital Medical Records (DMR) Frontend

A React-based frontend application for the Digital Medical Record (DMR) simulation system, designed for medical education and clinical practice training.

> **Backend Repository**: [UWA-CITS5206-DMR/dmrserver](https://github.com/UWA-CITS5206-DMR/dmrserver)

## System Overview

This system is part of UWA's ward simulation program for medical students and nurses. The simulation program involves approximately 40 student groups rotating through different shifts across 4 wards during a 5-week period, managing 12 pre-defined patient cases and building up data history throughout the simulation.

For detailed information about the system architecture, user roles, and features, see [docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md).

## Prerequisites

- **Node.js** (v20 or higher recommended)
- **npm** (v8 or higher)
- **Django Backend** (running separately)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/UWA-CITS5206-DMR/react-ui.git
cd react-ui
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create and configure the environment file:

```bash
cp .env.example .env
```

**Important**: Edit the `.env` file before starting the development server:

```env
VITE_API_BASE_URL=http://localhost:8000
```

**Configuration Notes:**

- The `.env` file is ignored by git and should never be committed
- Environment variables are **embedded at build time** by Vite
- **You must rebuild** (`npm run build`) after changing environment variables
- For production deployment, set `VITE_API_BASE_URL` to your API domain

**Production Example:**

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### 4. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```text
react-ui/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── patients/        # Patient management
│   │   ├── instructors/     # Instructor features
│   │   ├── student-groups/  # Student collaboration
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utilities & API client
├── cypress/                 # E2E tests
├── docs/                    # Documentation
└── vite.config.ts           # Vite configuration
```

## Development

### Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check
```

### Testing

```bash
# Open Cypress Test Runner
npx cypress open

# Run tests headless
npx cypress run
```

## Production Deployment

### Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### Automated Releases

GitHub Actions automatically builds and publishes releases when you push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

Download build artifacts:

```bash
# Latest version
wget https://github.com/UWA-CITS5206-DMR/react-ui/releases/latest/download/react-ui-dist.tar.gz

# Specific version
wget https://github.com/UWA-CITS5206-DMR/react-ui/releases/download/v1.0.0/react-ui-dist.tar.gz
```

### Environment Variables

```env
VITE_API_BASE_URL=https://api.your-domain.com
```

**Important**: Rebuild after changing environment variables, as Vite embeds them at build time.

## Documentation

For comprehensive documentation, see the [`docs/`](docs/) directory:

- **[PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)** - Comprehensive project overview, architecture, and development guidelines
- **[FEATURES.md](docs/FEATURES.md)** - System features, user roles, and technology stack

For backend documentation, see the [Django Backend Repository](https://github.com/UWA-CITS5206-DMR/dmrserver).

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
