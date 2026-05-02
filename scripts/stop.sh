#!/bin/bash

# SafeLedger Stop Script
# This script stops development servers

set -e

echo "🛑 SafeLedger Stop Script"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Stop backend server
stop_backend() {
    if [ -f .backend.pid ]; then
        BACKEND_PID=$(cat .backend.pid)
        if ps -p $BACKEND_PID > /dev/null; then
            print_status "Stopping backend server (PID: $BACKEND_PID)..."
            kill $BACKEND_PID
            rm .backend.pid
        else
            print_warning "Backend server not running"
        fi
    else
        print_warning "No backend PID file found"
    fi
}

# Stop frontend server
stop_frontend() {
    if [ -f .frontend.pid ]; then
        FRONTEND_PID=$(cat .frontend.pid)
        if ps -p $FRONTEND_PID > /dev/null; then
            print_status "Stopping frontend server (PID: $FRONTEND_PID)..."
            kill $FRONTEND_PID
            rm .frontend.pid
        else
            print_warning "Frontend server not running"
        fi
    else
        print_warning "No frontend PID file found"
    fi
}

# Stop Docker containers
stop_docker() {
    print_status "Stopping Docker containers..."
    cd Server
    docker-compose down
    cd ..
    print_status "Docker containers stopped"
}

# Force stop all processes
force_stop() {
    print_warning "Force stopping all SafeLedger processes..."
    
    # Kill Node.js processes related to SafeLedger
    pkill -f "node.*server.js" || true
    pkill -f "npm.*dev" || true
    pkill -f "npm.*start" || true
    
    # Clean up PID files
    rm -f .backend.pid .frontend.pid
    
    print_status "All processes stopped"
}

case "${1:-normal}" in
    "normal")
        stop_backend
        stop_frontend
        print_status "Development servers stopped"
        ;;
    "docker")
        stop_docker
        ;;
    "force"|"-f"|"--force")
        force_stop
        ;;
    "help"|"-h"|"--help")
        echo "SafeLedger Stop Script"
        echo "====================="
        echo ""
        echo "Usage: $0 [OPTION]"
        echo ""
        echo "Options:"
        echo "  normal    - Stop development servers (default)"
        echo "  docker    - Stop Docker containers"
        echo "  force     - Force stop all SafeLedger processes"
        echo "  help      - Show this help message"
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
