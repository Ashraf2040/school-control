'use client';

import { useRef, useState,useEffect } from 'react';
import { Class, Student, Subject } from '@prisma/client';
import Link from 'next/link';

interface AdminUIProps {
  subjects: Subject[];
}

interface Teacher {
  id: string;
  email: string;
  name: string;
}
interface LocalStudent {
  name: string;
  id: string;
  classId: string;
  behavior?: number;
  participation?: number;
  workingQuiz?: number;
  project?: number;
  finalExam?: number;
}
const AdminUI: React.FC<AdminUIProps> = ({ subjects }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTeacherEmail, setSelectedTeacherEmail] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string | null>(null);

  const fetchTeachersBySubject = async (subjectId: string) => {
    const res = await fetch(`/api/teachers?subjectId=${subjectId}`);
    if (!res.ok) throw new Error('Failed to fetch teachers');
    const data = await res.json();
    return data;
  };

  const fetchClasses = async (teacherId: string) => {
    const res = await fetch(`/api/classes?teacherId=${teacherId}`);
    if (!res.ok) throw new Error('Failed to fetch classes');
    const data = await res.json();
    console.log(data)
    return data;
  };
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassId || !selectedTeacherId) return;
  
      try {
        const response = await fetch(`/api/students?classId=${selectedClassId}&teacherId=${selectedTeacherId}&role=admin`);
        if (!response.ok) throw new Error('Failed to fetch students');
  
        const data = await response.json();
  
        const mappedStudents = data.map((student: any) => ({
          ...student,
          behavior: student.marks?.behavior || 0,
          participation: student.marks?.participation || 0,
          workingQuiz: student.marks?.workingQuiz || 0,
          project: student.marks?.project || 0,
          finalExam: student.marks?.finalExam || 0,
        }));
  
        setStudents(mappedStudents);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchStudents();
  }, [selectedClassId, selectedTeacherId]);
  
 console.log(students)
  const handleSubjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = e.target.value;
    setSelectedSubjectId(subjectId);

    const teachersData = await fetchTeachersBySubject(subjectId);
    setTeachers(teachersData);
    setSelectedTeacherId(null);
    setClasses([]);
    setStudents([]);
  };

  const handleTeacherChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const teacherId = e.target.value;
    setSelectedTeacherId(teacherId);

    const selectedTeacher = teachers.find((teacher) => teacher.id === teacherId);
    if (selectedTeacher) {
      setSelectedTeacherEmail(selectedTeacher.email);
    }

    const classesData = await fetchClasses(teacherId);
    setClasses(classesData);
    setSelectedClassId(null);
    setSelectedClassName(null);
    setStudents([]);
  };

  const handleClassChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClassId(classId);

    const selectedClass = classes.find((classItem) => classItem.id === classId);
    if (selectedClass) {
      setSelectedClassName(selectedClass.name);
    }

  
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 flex justify-center items-center  print:hidden "><span className='text-white max-w-fit bg-[#3a4750] text-center rounded-lg p-3'>Admin Dashboard</span></h1>

      <div className="mb-6 print:hidden">
        <h2 className="text-xl font-semibold mb-2 print:hidden">Select a Subject</h2>
        <select
          className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleSubjectChange}
          defaultValue=""
        >
          <option value="" disabled>Select a subject</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSubjectId && teachers.length > 0 && (
        <div className="mb-6 print:hidden">
          <h2 className="text-xl font-semibold mb-2 print:hidden">Select a Teacher</h2>
          <select
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleTeacherChange}
            defaultValue=""
          >
            <option value="" disabled>Select a teacher</option>
            {teachers.map((teacher: Teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedTeacherId && classes.length > 0 && (
        <div className="mb-6 print:hidden">
          <h2 className="text-xl font-semibold mb-2 print:hidden">Select a Class</h2>
          <select
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleClassChange}
            defaultValue=""
          >
            <option value="" disabled>Select a class</option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.class.id}>
                {classItem.class.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {students.length > 0 && (
        <div id="certificate" className="p-2 border border-gray-300 rounded-lg">
          <div className="bg-gray-200 p-4 grid grid-cols-3">
            <p className="text-lg ">Teacher: {selectedTeacherEmail}</p>
            <p className="text-lg ">Class: {selectedClassName}</p>
            <p className="text-lg ">Signature :</p>
          </div>

          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">No</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Attendance</th>
                <th className="border p-2">Participation</th>
                <th className="border p-2">Project</th>
                <th className="border p-2">Quiz</th>
                <th className="border p-2">Final Exam</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student:LocalStudent, index) => {
                const totalMarks = (student.marks[0].behavior || 0) + (student.marks[0].participation || 0) +
                  (student.marks[0].workingQuiz || 0) + (student.marks[0].project || 0) + (student.marks[0].finalExam || 0);

                return (
                  <tr key={student.id}>
                    <td className="border p-2 text-center font-bold">{index + 1}</td>
                    <td className="border p-2 font-bold">
  <Link href={`/students/${student.id}/results`}>
    {student.name}
  </Link>
</td>
                    <td className="border p-2">{student.marks[0].behavior}</td>
                    <td className="border p-2">{student.marks[0].participation}</td>
                    <td className="border p-2">{student.marks[0].workingQuiz}</td>
                    <td className="border p-2">{student.marks[0].project}</td>
                    <td className="border p-2">{student.marks[0].finalExam}</td>
                    <td className="border p-2 text-center font-bold">{totalMarks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="mt-4 font-semibold py-2 px-4 bg-[#3a4750] rounded text-white"
            onClick={handlePrintCertificate}
          >
            Print Certificate
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUI;
