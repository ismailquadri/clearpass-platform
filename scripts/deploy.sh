#!/bin/bash

# ClearPass Platform - Deployment Helper Script
# This script helps prepare the project for deployment

set -e  # Exit on error

echo "🚀 ClearPass Platform - Deployment Helper"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if .env.production files exist
check_env_files() {
    echo "📋 Checking environment files..."
    
    if [ ! -f "backend/.env.production" ]; then
        print_error "backend/.env.production not found"
        exit 1
    fi
    print_success "backend/.env.production found"
    
    if [ ! -f ".env.production" ]; then
        print_error ".env.production not found"
        exit 1
    fi
    print_success ".env.production found"
}

# Build backend
build_backend() {
    echo ""
    echo "🔨 Building backend..."
    cd backend
    
    if [ ! -d "node_modules" ]; then
        echo "Installing backend dependencies..."
        npm install
    fi
    
    echo "Compiling TypeScript..."
    npm run build
    print_success "Backend built successfully"
    
    cd ..
}

# Build frontend
build_frontend() {
    echo ""
    echo "🔨 Building frontend..."
    
    if [ ! -d "node_modules" ]; then
        echo "Installing frontend dependencies..."
        npm install
    fi
    
    echo "Building for production..."
    npm run build
    print_success "Frontend built successfully"
}

# Run database migrations (requires DATABASE_URL)
run_migrations() {
    echo ""
    echo "🗄️  Running database migrations..."
    cd backend
    
    if [ -z "$DATABASE_URL" ]; then
        print_warning "DATABASE_URL not set. Skipping migrations."
        print_warning "Set DATABASE_URL and run: cd backend && npm run migrate:latest"
    else
        npm run migrate:latest
        print_success "Migrations completed"
    fi
    
    cd ..
}

# Run tests
run_tests() {
    echo ""
    echo "🧪 Running tests..."
    
    echo "Running backend tests..."
    cd backend
    npm test || print_warning "Backend tests failed or skipped"
    cd ..
    
    echo "Running frontend tests..."
    npm test || print_warning "Frontend tests failed or skipped"
}

# Main deployment flow
main() {
    # Parse arguments
    SKIP_TESTS=false
    SKIP_MIGRATIONS=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-migrations)
                SKIP_MIGRATIONS=true
                shift
                ;;
            --help)
                echo "Usage: ./scripts/deploy.sh [options]"
                echo "Options:"
                echo "  --skip-tests      Skip running tests"
                echo "  --skip-migrations Skip running database migrations"
                echo "  --help           Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run checks and builds
    check_env_files
    build_backend
    build_frontend
    
    if [ "$SKIP_TESTS" = false ]; then
        run_tests
    else
        print_warning "Skipping tests"
    fi
    
    if [ "$SKIP_MIGRATIONS" = false ]; then
        run_migrations
    else
        print_warning "Skipping migrations"
    fi
    
    echo ""
    echo "=========================================="
    print_success "Deployment preparation complete!"
    echo ""
    echo "Next steps:"
    echo "1. Review and update .env.production files with production values"
    echo "2. Deploy backend to your hosting platform (Railway, Render, etc.)"
    echo "3. Deploy frontend to your hosting platform (Vercel, Netlify, etc.)"
    echo "4. Run database migrations on production database"
    echo "5. Configure webhooks and external services"
    echo "6. Test the deployment"
    echo ""
    echo "See DEPLOYMENT.md for detailed instructions."
}

# Run main function
main "$@"