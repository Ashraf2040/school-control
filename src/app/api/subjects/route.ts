// src/app/api/subjects/route.ts
import { prisma } from '@/lib/prisma';

// Handle GET request to fetch subjects
export async function GET(req: Request) {
  try {
    const subjects = await prisma.subject.findMany();
    return new Response(JSON.stringify(subjects), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch subjects' }), { status: 500 });
  }
}
