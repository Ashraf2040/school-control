import { prisma } from './prisma';
import { Student } from '@prisma/client';

// Fetch all teachers
export async function getAllTeachers() {
  return await prisma.teacher.findMany({
    include: {
      classes: { include: { class: true } }, // Use join table for teacher-class association
      subject: true,
    },
  });
}

// Fetch all subjects
export async function getAllSubjects() {
  return await prisma.subject.findMany();
}

// Fetch teachers by subject
export async function getTeachersBySubject(subjectId: string) {
  return await prisma.teacher.findMany({
    where: { subjectId },
  });
}

// Fetch classes by teacher using ClassTeacher join table
export async function getClassesByTeacher(teacherId: string) {
  return await prisma.classTeacher.findMany({
    where: { teacherId },
    include: {
      class: { include: { students: true } },
    },
  });
}

// Fetch students by class
export async function getStudentsByClass(classId: string) {
  return await prisma.student.findMany({
    where: { classId },
    select: {
      id: true,
      name: true,
      participation: true,
      behavior: true,
      workingQuiz: true,
      project: true,
      finalExam: true,
      totalMarks: true,
    },
  });
}

// Create a new teacher
export async function createTeacher(email: string, password: string, name: string, subjectId: string) {
  return await prisma.teacher.create({
    data: {
      email,
      password, // Ensure password hashing in real applications
      name,
      subjectId,
    },
  });
}

// Create a new class and assign it to a teacher using ClassTeacher
export async function createClass(teacherId: string, className: string) {
  const newClass = await prisma.class.create({
    data: { name: className },
  });
  await prisma.classTeacher.create({
    data: {
      classId: newClass.id,
      teacherId,
    },
  });
  return newClass;
}

// Add a student to a class
export async function addStudentToClass(classId: string, studentName: string) {
  return await prisma.student.create({
    data: {
      name: studentName,
      classId,
    },
  });
}

// Create a new subject
export async function createSubject(subjectName: string) {
  return await prisma.subject.create({
    data: { name: subjectName },
  });
}

// Delete a class by ID
export async function deleteClass(classId: string) {
  return await prisma.class.delete({
    where: { id: classId },
  });
}

// Delete a student by ID
export async function deleteStudent(studentId: string) {
  return await prisma.student.delete({
    where: { id: studentId },
  });
}

// Update student information
export async function updateStudent(studentId: string, newName: string) {
  return await prisma.student.update({
    where: { id: studentId },
    data: {
      name: newName,
    },
  });
}

// Update class information
export async function updateClass(classId: string, newName: string) {
  return await prisma.class.update({
    where: { id: classId },
    data: {
      name: newName,
    },
  });
}

// Update student marks
export async function updateStudentMarks(studentId: string, updatedData: Partial<Student>) {
  return await prisma.student.update({
    where: { id: studentId },
    data: updatedData,
  });
}