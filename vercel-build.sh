#!/bin/bash

# Print Prisma version
echo "Prisma version:"
npx prisma --version

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Push database schema
echo "Pushing database schema..."
npx prisma db push

# Build Next.js app
echo "Building Next.js app..."
next build
