#!/bin/bash

# SafeLedger Setup Script
# This script sets up the complete SafeLedger environment

set -e  # Exit on any error

echo "🚀 SafeLedger Setup Script"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
    else
        print_error "Node.js not found. Please install Node.js 16+"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm"
        exit 1
    fi
    
    # Check PostgreSQL
    if command -v psql &> /dev/null; then
        PG_VERSION=$(psql --version)
        print_status "PostgreSQL found: $PG_VERSION"
    else
        print_warning "PostgreSQL not found. Please install PostgreSQL 12+"
    fi
    
    # Check Redis
    if command -v redis-server &> /dev/null; then
        REDIS_VERSION=$(redis-server --version)
        print_status "Redis found: $REDIS_VERSION"
    else
        print_warning "Redis not found. Please install Redis 6+"
    fi
    
    # Check Docker (optional)
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_status "Docker found: $DOCKER_VERSION"
    else
        print_warning "Docker not found (optional for containerized setup)"
    fi
}

# Setup backend
setup_backend() {
    echo ""
    echo "🔧 Setting up backend..."
    
    cd Server
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Check if .env exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration"
    else
        print_status ".env file found"
    fi
    
    # Run database migrations
    print_status "Running database migrations..."
    npx prisma migrate dev
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    cd ..
    print_status "Backend setup completed"
}

# Setup frontend
setup_frontend() {
    echo ""
    echo "🎨 Setting up frontend..."
    
    cd Client
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Check if .env exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.example .env
    else
        print_status ".env file found"
    fi
    
    cd ..
    print_status "Frontend setup completed"
}

# Setup database using Docker
setup_database_docker() {
    echo ""
    echo "🗄️  Setting up database with Docker..."
    
    cd Server
    
    # Start Docker containers
    print_status "Starting PostgreSQL and Redis containers..."
    docker-compose up -d
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 10
    
    # Run migrations
    print_status "Running database migrations..."
    npx prisma migrate dev
    
    cd ..
    print_status "Database setup completed"
}

# Start development servers
start_development() {
    echo ""
    echo "🚀 Starting development servers..."
    
    # Start backend in background
    echo "Starting backend server..."
    cd Server
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    echo "Starting frontend server..."
    cd Client
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    print_status "Development servers started"
    print_status "Backend: http://localhost:5000"
    print_status "Frontend: http://localhost:3000"
    print_status "API Docs: http://localhost:5000/api-docs"
    
    # Save PIDs for cleanup
    echo $BACKEND_PID > .backend.pid
    echo $FRONTEND_PID > .frontend.pid
    
    print_status "To stop servers, run: ./scripts/stop.sh"
}

# Run tests
run_tests() {
    echo ""
    echo "🧪 Running tests..."
    
    cd Server
    
    # Run backend tests
    print_status "Running backend tests..."
    npm test
    
    cd ..
    print_status "Tests completed"
}

# Build for production
build_production() {
    echo ""
    echo "🏗️  Building for production..."
    
    # Build backend
    print_status "Building backend..."
    cd Server
    npm run build
    cd ..
    
    # Build frontend
    print_status "Building frontend..."
    cd Client
    npm run build
    cd ..
    
    print_status "Production build completed"
    print_status "Frontend build: Client/build/"
    print_status "Backend ready for production"
}

# Show help
show_help() {
    echo ""
    echo "SafeLedger Setup Script"
    echo "======================"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     - Complete setup (prerequisites + backend + frontend)"
    echo "  backend   - Setup backend only"
    echo "  frontend  - Setup frontend only"
    echo "  database  - Setup database with Docker"
    echo "  dev       - Start development servers"
    echo "  test      - Run tests"
    echo "  build     - Build for production"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup      # Complete setup"
    echo "  $0 dev         # Start development"
    echo "  $0 test        # Run tests"
}

# Main script logic
case "${1:-setup}" in
    "setup")
        check_prerequisites
        setup_backend
        setup_frontend
        echo ""
        print_status "🎉 SafeLedger setup completed!"
        echo ""
        echo "Next steps:"
        echo "1. Edit Server/.env with your Hedera credentials"
        echo "2. Run './scripts/setup.sh dev' to start development servers"
        echo "3. Visit http://localhost:3000"
        ;;
    "backend")
        check_prerequisites
        setup_backend
        ;;
    "frontend")
        check_prerequisites
        setup_frontend
        ;;
    "database")
        setup_database_docker
        ;;
    "dev")
        start_development
        ;;
    "test")
        run_tests
        ;;
    "build")
        check_prerequisites
        build_production
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
