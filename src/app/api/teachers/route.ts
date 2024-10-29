import { NextResponse } from 'next/server'; // Import NextResponse from next/server
import { prisma } from '../../../lib/prisma'; // Adjust the path according to your project structure

// Define the GET handler
export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany(); // Fetch all teachers from the database
    return NextResponse.json(teachers); // Use NextResponse to send the JSON response
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 }); // Send error response
  }
}
