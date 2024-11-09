import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Log the entire request body for debugging
    console.log('Received data:', data);

    // Step 1: Extract fields
    const { name, email, password, subjectIds, classIds } = data;

    // Step 2: Check if subjectIds and classIds are properly passed and are arrays
    if (!Array.isArray(subjectIds)) {
      return NextResponse.json({ error: 'subjectIds must be an array' }, { status: 400 });
    }
    if (!Array.isArray(classIds)) {
      return NextResponse.json({ error: 'classIds must be an array' }, { status: 400 });
    }

    // Step 3: Create Teacher
    const newTeacher = await prisma.teacher.create({
      data: {
        name,
        email,
        password,
      },
    });

    // Step 4: Create or connect SubjectTeacher entries for each subject
    for (const subjectId of subjectIds) {
      // Check if SubjectTeacher already exists or create it
      await prisma.subjectTeacher.upsert({
        where: {
          subjectId_teacherId: { subjectId, teacherId: newTeacher.id }, // Assuming composite unique constraint on subjectId + teacherId
        },
        update: {}, // No need to update, just checking for existence
        create: {
          subjectId,
          teacherId: newTeacher.id, // Link the teacher to the subject
        },
      });
    }

    // Step 5: Create ClassTeacher entries for each selected class
    const classTeacherEntries = classIds.map((classId: string) => ({
      teacherId: newTeacher.id,
      id: randomUUID(),
      classId: classId,
    }));

    // Bulk create ClassTeacher entries
    await prisma.classTeacher.createMany({
      data: classTeacherEntries,
    });

    // Step 6: Create Mark entries for each class and associated students
    for (const classTeacherEntry of classTeacherEntries) {
      const students = await prisma.student.findMany({
        where: { classId: classTeacherEntry.classId },
      });

      // Create mark entries for each student and subject
      const markEntries = [];
      for (const subjectId of subjectIds) {
        for (const student of students) {
          markEntries.push({
            studentId: student.id,
            classTeacherId: classTeacherEntry.id,
            subjectId,  // Assign the current subjectId
            participation: 0,
            behavior: 0,
            workingQuiz: 0,
            project: 0,
            finalExam: 0,
          });
        }
      }

      // Bulk create marks for all students in each class-subject-teacher combination
      await prisma.mark.createMany({ data: markEntries });
    }

    return NextResponse.json({ message: 'Teacher created successfully' });
  } catch (error) {
    console.error('Error creating teacher:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
