import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Subjects
  const mathSubject = await prisma.subject.create({ data: { name: 'Mathematics' } });
  const scienceSubject = await prisma.subject.create({ data: { name: 'Science' } });
  const englishSubject = await prisma.subject.create({ data: { name: 'English' } });
  const historySubject = await prisma.subject.create({ data: { name: 'History' } });

  // Check if Admin exists; create if not
  const adminExists = await prisma.teacher.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (!adminExists) {
    await prisma.teacher.create({
      data: {
        email: 'admin@example.com',
        password: 'securepassword',
        name: 'Admin User',
        subject: {
          create: { name: 'Administration' },
        },
      },
    });
  }

  // Create Teachers with assigned Subjects
  const teacherUser1 = await prisma.teacher.create({
    data: {
      email: 'ashrafflefl2030@gmail.com',
      password: 'securepassword',
      name: 'Ashraf Elsayed',
      subjectId: scienceSubject.id,
    },
  });

  const teacherUser2 = await prisma.teacher.create({
    data: {
      email: 'ibrahimhassan@gmail.com',
      password: 'securepassword',
      name: 'Ibrahim Hassan',
      subjectId: englishSubject.id,
    },
  });

  // Create Classes
  const class1 = await prisma.class.create({ data: { name: '4C' } });
  const class2 = await prisma.class.create({ data: { name: '5A' } });

  // Link Teachers to Classes using ClassTeacher join table
  await prisma.classTeacher.createMany({
    data: [
      { classId: class1.id, teacherId: teacherUser1.id },
      { classId: class1.id, teacherId: teacherUser2.id },
      { classId: class2.id, teacherId: teacherUser2.id },
    ],
  });

  // Seed Students in each Class
  await prisma.student.createMany({
    data: [
      { name: 'Mohammed Hassan', classId: class1.id },
      { name: 'Ahmed Samy', classId: class1.id },
      { name: 'Ibrahim Salem', classId: class2.id },
    ],
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
