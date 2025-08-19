#!/bin/bash

# MediSim Project Copy Script
# Usage: ./scripts/copy-project.sh [destination-path] [new-project-name]

set -e

# Default values
DESTINATION_PATH="${1:-../}"
PROJECT_NAME="${2:-MediSimv1-copy}"
SOURCE_PATH="$(pwd)"

echo "🚀 MediSim Project Copy Script"
echo "================================"
echo "Source: $SOURCE_PATH"
echo "Destination: $DESTINATION_PATH/$PROJECT_NAME"
echo ""

# Confirm before proceeding
read -p "Do you want to proceed? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Copy cancelled."
    exit 1
fi

# Check if destination already exists
if [ -d "$DESTINATION_PATH/$PROJECT_NAME" ]; then
    echo "⚠️  Destination directory already exists: $DESTINATION_PATH/$PROJECT_NAME"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$DESTINATION_PATH/$PROJECT_NAME"
        echo "🗑️  Removed existing directory"
    else
        echo "❌ Copy cancelled."
        exit 1
    fi
fi

echo "📁 Creating destination directory..."
mkdir -p "$DESTINATION_PATH"

echo "📋 Copying project files..."
cp -r "$SOURCE_PATH" "$DESTINATION_PATH/$PROJECT_NAME"

# Clean up the copied project
cd "$DESTINATION_PATH/$PROJECT_NAME"

echo "🧹 Cleaning up copied project..."

# Remove git history (optional)
read -p "Remove git history in the copy? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    rm -rf .git
    echo "🗑️  Removed git history"
fi

# Remove node_modules and database files
echo "🗑️  Removing node_modules, database, and build files..."
rm -rf node_modules
rm -rf data
rm -rf dist
rm -f package-lock.json

# Update package.json name if needed
if [ "$PROJECT_NAME" != "MediSimv1" ]; then
    echo "📝 Updating package.json name..."
    if command -v jq &> /dev/null; then
        jq ".name = \"$PROJECT_NAME\"" package.json > package.json.tmp && mv package.json.tmp package.json
    else
        sed -i.bak "s/\"name\": \"rest-express\"/\"name\": \"$PROJECT_NAME\"/" package.json
        rm -f package.json.bak
    fi
fi

echo ""
echo "✅ Project copied successfully!"
echo ""
echo "🚀 Next steps:"
echo "   cd $DESTINATION_PATH/$PROJECT_NAME"
echo "   npm install"
echo "   npm run db:init"
echo "   npm run db:push"
echo "   npm run dev"
echo ""
echo "📁 Copy location: $DESTINATION_PATH/$PROJECT_NAME"
