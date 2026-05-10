# ClearPass Platform

A comprehensive compliance management platform for Nigerian businesses, MDAs, and partners.

## Documentation

All documentation has been moved to the `docs/` directory:
- [README](docs/README.md) - Project overview and getting started
- [QUICK_START_GUIDE](docs/QUICK_START_GUIDE.md) - Quick start instructions
- [BACKEND_DEVELOPMENT_GUIDE](docs/BACKEND_DEVELOPMENT_GUIDE.md) - Backend development guide
- [FRONTEND_AUDIT_REPORT_2026](docs/FRONTEND_AUDIT_REPORT_2026.md) - Latest frontend audit report

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **State Management**: React Context, Hooks
- **UI Components**: Custom components with Lucide icons
- **Build Tool**: Vite
- **Testing**: Vitest
- **Code Quality**: ESLint, Prettier

## Project Structure

```
clearpass/
├── src/
│   ├── app/          # Main application code
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── styles/       # Global styles
├── docs/             # Documentation
├── public/           # Static assets
└── scripts/          # Build and utility scripts
```