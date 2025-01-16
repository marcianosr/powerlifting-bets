import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Initialize Prisma Client
const prisma = new PrismaClient()

export async function middleware(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect()
    await prisma.$disconnect()
  } catch (error) {
    console.error('Database connection error:', error)
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
