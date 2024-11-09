'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Class, Student, Teacher } from '@prisma/client';
import toast, { Toaster } from 'react-hot-toast';

interface Mark {
  id: string;
  participation?: number;
  behavior?: number;
  workingQuiz?: number;
  project?: number;
  finalExam?: number;
  totalMarks?: number;
}

interface StudentWithMarks extends Student {
  marks: Mark[];
  markId: string;
}

const TeacherPage: React.FC = () => {
  const { user } = useUser();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<StudentWithMarks[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const maxValues = {
    participation: 15,
    behavior: 15,
    workingQuiz: 15,
    project: 20,
    finalExam: 35,
  };

  useEffect(() => {
    const fetchClasses = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/classes?teacherId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch classes');
        const data: Class[] = await response.json();
        setClasses(data);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching classes.');
      }
    };

    fetchClasses();
  }, [user]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`/api/teachers`);
        if (!response.ok) throw new Error('Failed to fetch teachers');
        const data: Teacher[] = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching teachers.');
      }
    };

    fetchTeachers();
  }, []);

  const currentTeacher = teachers.find((teacher) => teacher.id === user?.id);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassId) return;

      try {
        const response = await fetch(`/api/students?classId=${selectedClassId}&teacherId=${user?.id}`);
        if (!response.ok) throw new Error('Failed to fetch students');

        const data: StudentWithMarks[] = await response.json();
        setStudents(data);

        const initialMarks: Record<string, Mark> = {};
        data.forEach((student) => {
          const studentMark = student.marks[0] || {};
          initialMarks[student.id] = {
            id: studentMark.id,
            participation: studentMark.participation || 0,
            behavior: studentMark.behavior || 0,
            workingQuiz: studentMark.workingQuiz || 0,
            project: studentMark.project || 0,
            finalExam: studentMark.finalExam || 0,
          };
        });
        setMarks(initialMarks);
      } catch (error) {
        console.error(error);
        toast.error('Error fetching students.');
      }
    };

    fetchStudents();
  }, [selectedClassId]);

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClassId(event.target.value);
  };

  const handleMarkChange = (studentId: string, field: keyof Mark, value: string) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: {
        ...(prevMarks[studentId] || {}),
        [field]: value ? Number(value) : undefined,
      },
    }));
  };

  const calculateTotalMarks = (studentId: string): number => {
    const studentMarks = marks[studentId] || {};
    return (
      (studentMarks.participation || 0) +
      (studentMarks.behavior || 0) +
      (studentMarks.workingQuiz || 0) +
      (studentMarks.project || 0) +
      (studentMarks.finalExam || 0)
    );
  };

  const handleSaveMarks = async () => {
    try {
      const responses = await Promise.all(
        students.map((student) => {
          const studentMarks = marks[student.id];

          return fetch(`/api/students/${student.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              markId: student.marks[0].id,
              participation: studentMarks.participation,
              behavior: studentMarks.behavior,
              workingQuiz: studentMarks.workingQuiz,
              project: studentMarks.project,
              finalExam: studentMarks.finalExam,
            }),
          });
        })
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error('Failed to update marks');
      }

      toast.success('Marks updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Error updating marks. Please try again.');
    }
  };

  const fillAllMarks = (field: keyof Mark) => {
    const maxValue = maxValues[field];
    setMarks((prevMarks) => {
      const updatedMarks = { ...prevMarks };
      students.forEach((student) => {
        updatedMarks[student.id] = {
          ...updatedMarks[student.id],
          [field]: maxValue,
        };
      });
      return updatedMarks;
    });
  };

  return (
    <div className="mx-auto p-6 min-h-screen">
      <Toaster position="top-right" />
      <h1 className="text-xl font-bold text-white bg-[#0e2e3b] p-3 rounded-xl mb-6 max-w-fit text-center">
        Hello, {currentTeacher?.name}
      </h1>

      <div className="mb-6">
        <label htmlFor="classSelect" className="block my-2 text-xl font-medium text-lamaPurple">
          Select Class
        </label>
        <select
          id="classSelect"
          value={selectedClassId}
          onChange={handleClassChange}
          className="border border-lamaSky p-2 rounded w-full text-lg max-w-fit"
        >
          <option value="">-- Select a Class --</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.class.id}>
              {classItem.class.name}
            </option>
          ))}
        </select>
      </div>

      {students.length > 0 && (
        <div>
          <h2 className="text-2xl text-lamaPurple font-semibold mb-4">Students in Class</h2>
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden border border-lamaYellowLight">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-center text-black">NO</th>
                <th className="p-3 text-center text-black">Name</th>
                {['participation', 'behavior', 'workingQuiz', 'project', 'finalExam'].map((field) => (
                  <th key={field} className="p-3 text-center text-black">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                    <button
                      onClick={() => fillAllMarks(field as keyof Mark)}
                      className="ml-2 bg-[#0e2e3b] hover:bg-gray-400 text-xs font-bold py-1 px-2 rounded text-white"
                    >
                      Fill
                    </button>
                  </th>
                ))}
                <th className="p-3 text-center text-black">Total</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id} className="even:bg-gray-200 odd:bg-gray-100">
                  <td className="px-3">
                    <span className="font-bold">{index + 1}</span>
                  </td>
                  <td className="text-[14px] font-bold">{student.name}</td>
                  {['participation', 'behavior', 'workingQuiz', 'project', 'finalExam'].map((field) => (
                    <td key={field} className="p-1">
                      <input
                        type="number"
                        value={marks[student.id]?.[field as keyof Mark] || ''}
                        onChange={(e) => handleMarkChange(student.id, field as keyof Mark, e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                      />
                    </td>
                  ))}
                  <td className="p-3 text-center font-bold text-lamaPurple">
                    {calculateTotalMarks(student.id)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSaveMarks}
            className="mt-6 bg-[#0e2e3b] hover:bg-lamaYellow text-white font-bold py-2 px-6 rounded shadow-lg"
          >
            Save Marks
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherPage;
