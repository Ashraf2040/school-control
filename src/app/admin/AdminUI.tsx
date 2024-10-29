'use client';

import { useRef, useState } from 'react';
import { Class, Student, Subject } from '@prisma/client';

interface AdminUIProps {
  subjects: Subject[];
}

interface Teacher {
  id: string;
  
    email: string;
    name: string;
  
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

  // Fetch teachers by subject ID
  const fetchTeachersBySubject = async (subjectId: string) => {
    const res = await fetch(`/api/teachers?subjectId=${subjectId}`);
    if (!res.ok) throw new Error('Failed to fetch teachers');
    const data = await res.json();
    return data;
  };

  // Fetch classes by teacher ID
  const fetchClasses = async (teacherId: string) => {
    const res = await fetch(`/api/classes?teacherId=${teacherId}`);
    if (!res.ok) throw new Error('Failed to fetch classes');
    const data = await res.json();
    return data;
  };

  // Fetch students by class ID
  const fetchStudents = async (classId: string) => {
    const res = await fetch(`/api/students?classId=${classId}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    const data = await res.json();
    return data;
  };

  // Handle subject selection change
  const handleSubjectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = e.target.value;
    setSelectedSubjectId(subjectId);

    const teachersData = await fetchTeachersBySubject(subjectId);
    setTeachers(teachersData);
    setSelectedTeacherId(null);
    setClasses([]);
    setStudents([]);
  };

  // Handle teacher selection change
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

  // Handle class selection change
  const handleClassChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClassId(classId);

    const selectedClass = classes.find((classItem) => classItem.id === classId);
    if (selectedClass) {
      setSelectedClassName(selectedClass.name);
    }

    const studentsData = await fetchStudents(classId);
    setStudents(studentsData);
  };
 console.log(selectedClassName)
  // Print students' marks as a certificate
  const handlePrintCertificate = () => {
    window.print();
  };
console.log(teachers)
console.log(classes)
console.log(students)
console.log(selectedClassId)
console.log(selectedTeacherEmail)

 const teacherRef = useRef<HTMLOptionElement>(null);
 const classRef = useRef<HTMLOptionElement>(null);


 console.log(teacherRef.current?.textContent)
 console.log(classRef.current?.textContent)
  return (
    <div className="w-full relative mx-auto p-6 bg-white rounded-lg shadow-lg print:m-0 print:p-0">
      <h1 className="text-3xl font-bold mb-6 text-center print:hidden">Admin Dashboard</h1>

      {/* Subject Select */}
      <div className="mb-6 print:hidden">
        <h2 className="text-xl font-semibold mb-2">Select a Subject</h2>
        <select
          className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={handleSubjectChange}
          defaultValue=""
        >
          <option value="" disabled>
            Select a subject
          </option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher Select */}
      {selectedSubjectId && teachers.length > 0 && (
        <div className="mb-6 print:hidden">
          <h2 className="text-xl font-semibold mb-2">Select a Teacher</h2>
          <select
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleTeacherChange}
            defaultValue=""
          >
            <option value="" disabled>
              Select a teacher
            </option>
            {teachers.map((teacher: Teacher) => (
              <option key={teacher.id} value={teacher.id} className='text-black' ref={teacherRef}>
                {teacher?.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Class Select */}
      {selectedTeacherId && classes.length > 0 && (
        <div className="mb-6 print:hidden">
          <h2 className="text-xl font-semibold mb-2">Select a Class</h2>
          <select
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleClassChange}
            defaultValue=""
          >
            <option value="" disabled>
              Select a class
            </option>
            {classes?.map((classItem) => (
              <option key={classItem.id} value={classItem?.class.id} ref={classRef}>
                {classItem.class?.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Student Marks Table */}
      { students.length > 0 && (
        <div id="certificate" className="p-2 border border-gray-300 rounded-lg relative ">
         <div className="   mb-4 w-full    bg-gray-200 grid grid-cols-5">
    
      <p className="text-lg col-span-2 text-center  ">
        Teacher: {teacherRef.current?.textContent} 
       
      </p>
      <p className="text-lg col-span-1  text-center">
       
        Class: {classRef.current?.textContent}
      </p>

      <p className="text-lg col-span-2 text-center">Signature :</p>
    
  </div>
          {/* Table of students' marks */}
          <table className="min-w-full border-collapse border border-gray-200 text-[10px]">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-200 p-2">No</th>
                <th className="border border-gray-200 p-2">Name</th>
                <th className="border border-gray-200 p-2">Attendance</th>
                <th className="border border-gray-200 p-2">Participation</th>
                <th className="border border-gray-200 p-2">Project</th>
                <th className="border border-gray-200 p-2">Quiz</th>
                <th className="border border-gray-200 p-2">Final Exam</th>
                <th className="border border-gray-200 p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {students?.map((student, index) => {
                const totalMarks = (student.behavior || 0) + (student.participation || 0) +
                  (student.workingQuiz || 0) + (student.project || 0) + (student.finalExam || 0);

                return (
                  <tr key={student.id} className="hover:bg-gray-100">
                    <td className="border bg-gray-200 border-gray-200 p-2 text-center font-bold">{index + 1}</td>
                    <td className="border border-gray-200 px-2 font-bold">{student.name}</td>
                    <td className="border border-gray-200 px-2">{student.behavior}</td>
                    <td className="border border-gray-200 px-2">{student.participation}</td>
                    <td className="border border-gray-200 px-2">{student.workingQuiz}</td>
                    <td className="border border-gray-200 px-2">{student.project}</td>
                    <td className="border border-gray-200 px-2">{student.finalExam}</td>
                    <td className="border border-gray-200 px-2 text-center font-bold">{totalMarks}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button
            className="self-end right-0 m-2 font-semibold py-2 px-4 bg-teal-700 rounded text-white print:hidden"
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
