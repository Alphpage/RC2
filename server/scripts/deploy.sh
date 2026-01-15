#!/bin/bash

echo "🚀 Starting production deployment..."

# Run database migrations
echo "📦 Running Prisma migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Seed database if needed (optional in production)
# npx prisma db seed

echo "✅ Deployment preparation complete!"

# Start the application
echo "🎬 Starting application..."
npm start
