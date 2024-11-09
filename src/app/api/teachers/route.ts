import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma'; // Adjust the path according to your project structure

// Define the GET handler
export async function GET(request: Request) {
  try {
    const url = new URL(request.url); // Parse the incoming request URL
    const subjectId = url.searchParams.get('subjectId'); // Get the subjectId from the query parameters

    if (subjectId) {
      // Admin page: Fetch teachers who are associated with the given subjectId
      const teachers = await prisma.teacher.findMany({
        where: {
          subjects: {
            some: {
              subjectId: subjectId, // Filter teachers by subjectId
            },
          },
        },
        include: {
          subjects: true, // Include subjects for the teacher if needed
        },
      });

      return NextResponse.json(teachers); // Return the filtered list of teachers as JSON
    } else {
      // Teacher page: Fetch all teachers
      const teachers = await prisma.teacher.findMany(); // Fetch all teachers from the database
      return NextResponse.json(teachers); // Use NextResponse to send the JSON response
    }
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 }); // Handle errors
  }
}
