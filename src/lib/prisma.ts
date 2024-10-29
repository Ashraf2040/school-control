// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

declare global {
  // Allow global `var` declarations for hot reloading in development
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: ['query'], // Optional: Log queries in development
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
