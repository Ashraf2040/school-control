// app/api/students/[id]/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Extract student ID directly from URL parameters
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const studentId = params.id;

  if (!studentId) {
    console.error("Missing Student ID");
    return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
  }

  try {
    // Parse JSON body to get updatedData
    const updatedData = await request.json();

    // Log to verify incoming data
    console.log('Updating student with ID:', studentId);
    console.log('Data:', updatedData);

    // Perform validation to ensure data has expected structure
    if (!updatedData || typeof updatedData !== 'object') {
      console.error("Invalid data format:", updatedData);
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Update student by ID, ensuring `studentId` is a string
    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: updatedData,
    });

    return NextResponse.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
