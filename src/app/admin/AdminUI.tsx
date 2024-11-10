'use client';

import { useRef, useState, useEffect } from 'react';
import { Class, Student, Subject } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  const router = useRouter();

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
      if (!selectedClassId || !selectedTeacherId || !selectedSubjectId) return;

      try {
        const response = await fetch(
          `/api/students?classId=${selectedClassId}&teacherId=${selectedTeacherId}&role=admin&subjectId=${selectedSubjectId}`
        );
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
        console.log(mappedStudents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, [selectedClassId, selectedTeacherId, selectedSubjectId]);

  

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
      setSelectedTeacherEmail(selectedTeacher.name);
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
      setSelectedClassName(selectedClass.class.name);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };



  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className='flex justify-between items-center mb-3 flex-wrap print:hidden gap-2'>
      <h1  className="text-white max-w-fit bg-main text-center rounded px-4 py-2 font-semibold">Admin Dashboard
      </h1>
      <button
        className="font-semibold py-2 px-4 bg-main rounded text-white"
        onClick={() => router.push('/teacherCreation')}
      >
        Create New Teacher
      </button>
     
      </div>

      <div className="mb-6 print:hidden">
        <h2 className="text-xl font-semibold mb-2 print:hidden">Select a Subject</h2>
        <select
          className="border rounded p-3 w-full focus:outline-none focus:ring-2 hover:bg-gray-100 focus:ring-blue-400"
          onChange={handleSubjectChange}
          defaultValue=""
        >
          <option value="" disabled>
            Select a subject
          </option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id} >
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
            <option value="" disabled>
              Select a teacher
            </option>
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
            <option value="" disabled>
              Select a class
            </option>
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.class.id}>
                {classItem.class.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {students.length > 0 && (
        <div id="certificate" className="p-2 border border-gray-300 rounded-lg overflow-scroll">
          <div className="bg-gray-200 p-4 grid grid-cols-3">
            <p className="text-lg ">Teacher: {selectedTeacherEmail}</p>
            <p className="text-lg ">Class: {selectedClassName}</p>
            <p className="text-lg ">Signature :</p>
          </div>

          <table className="min-w-full border-collapse border border-gray-200 text-sm ">
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
              {students.map((student: LocalStudent, index) => {
                const totalMarks =
                  (student.marks.find((mark) => mark.subjectId === selectedSubjectId).behavior || 0) +
                  (student.marks.find((mark) => mark.subjectId === selectedSubjectId).participation || 0) +
                  (student.marks.find((mark) => mark.subjectId === selectedSubjectId).workingQuiz || 0) +
                  (student.marks.find((mark) => mark.subjectId === selectedSubjectId).project || 0) +
                  (student.marks.find((mark) => mark.subjectId === selectedSubjectId).finalExam || 0);

                return (
                  <tr key={student.id}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">
                      <Link href={`/students/${student.id}/results`}>{student.name}</Link>
                    </td>
                    <td className="border p-2">{student.marks.find((mark) => mark.subjectId === selectedSubjectId).behavior}</td>
                    <td className="border p-2">{student.marks.find((mark) => mark.subjectId === selectedSubjectId).participation}</td>
                    <td className="border p-2">{student.marks.find((mark) => mark.subjectId === selectedSubjectId).project}</td>
                    <td className="border p-2">{student.marks.find((mark) => mark.subjectId === selectedSubjectId).workingQuiz}</td>
                    <td className="border p-2">{student.marks.find((mark) => mark.subjectId === selectedSubjectId).finalExam}</td>
                    <td className="border p-2">{totalMarks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-2 flex justify-end print:hidden">
            <button
              className="py-2 px-4 bg-main text-white rounded"
              onClick={handlePrintCertificate}
            >
              Print Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUI;
