'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Class, Student, Teacher } from '@prisma/client';

interface Marks {
  participation?: number;
  behavior?: number;
  workingQuiz?: number;
  project?: number;
  finalExam?: number;
}

const TeacherPage: React.FC = () => {
  const { user } = useUser();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>(''); // Selected class
  const [marks, setMarks] = useState<Record<number, Marks>>({}); // Store marks for each student
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Fetch classes for the logged-in teacher
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
      }
    };

    fetchClasses();
  }, [user]);

  // Fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      if (!user) return; 

      try {
        const response = await fetch(`/api/teachers`);
        if (!response.ok) throw new Error('Failed to fetch teachers');

        const data: Teacher[] = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTeachers();
  }, [user]);

  const currentTeacher = teachers.filter((teacher) => teacher?.id === user?.id);

  // Fetch students based on the selected class
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClassId) return;
      try {
        const response = await fetch(`/api/students?classId=${selectedClassId}`);
        if (!response.ok) throw new Error('Failed to fetch students');
        const data: Student[] = await response.json();
        setStudents(data);

        const initialMarks: Record<number, Marks> = data.reduce((acc: Record<number, Marks>, student) => {
          acc[+student.id] = {
            participation: student.participation || 0,
            behavior: student.behavior || 0,
            workingQuiz: student.workingQuiz || 0,
            project: student.project || 0,
            finalExam: student.finalExam || 0,
          };
          return acc;
        }, {});

        setMarks(initialMarks); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, [selectedClassId]);

  // Handle class selection change
  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClassId(event.target.value);
  };

  // Handle changes to marks for individual students
  const handleMarkChange = (studentId: number, field: keyof Marks, value: string) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: {
        ...(prevMarks[studentId] || {}),
        [field]: value ? Number(value) : undefined,
      },
    }));
  };

  // Calculate total marks for a student
  const calculateTotalMarks = (studentId: number) => {
    const studentMarks = marks[studentId] || {};
    return Object.values(studentMarks).reduce((total, mark) => total + (mark || 0), 0);
  };

  // Save the updated marks to the database
  const handleSaveMarks = async () => {
    try {
      const responses = await Promise.all(
        Object.entries(marks).map(([studentId, studentMarks]) =>
          fetch(`/api/students/${studentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentMarks),
          })
        )
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error('Failed to update marks');
      }

      alert('Marks updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Error updating marks. Please try again.');
    }
  };

  // Fill all marks for a specific field
  const fillAllMarks = (field: keyof Marks) => {
    const fillValue = prompt(`Enter value to fill all ${field} marks:`); // Get value from the user
    if (fillValue !== null) {
      const fillNumber = Number(fillValue);
      if (!isNaN(fillNumber)) {
        setMarks((prevMarks) => {
          const updatedMarks = { ...prevMarks };
          students.forEach((student) => {
            updatedMarks[+student.id] = {
              ...updatedMarks[+student.id],
              [field]: fillNumber,
            };
          });
          return updatedMarks;
        });
      } else {
        alert('Invalid number entered. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hello : {currentTeacher[0]?.name}</h1>

      {/* Class selection */}
      <div className="mb-4">
        <label htmlFor="classSelect" className="block text-lg font-medium mb-2">
          Select Class
        </label>
        <select
          id="classSelect"
          value={selectedClassId}
          onChange={handleClassChange}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">-- Select a Class --</option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.class.id}>
              {classItem.class.name}
            </option>
          ))}
        </select>
      </div>

      {/* Student table */}
      {students.length > 0 && (
        <div>
          <h2 className="text-xl mb-2">Students in Class</h2>
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300">NO</th>
                <th className="border border-gray-300">Name</th>

                {/* Marks Columns */}
                <th className="border border-gray-300">
                  Participation
                  <button
                    onClick={() => fillAllMarks('participation')}
                    className="ml-2 text-sm text-blue-500"
                  >
                    Fill All
                  </button>
                </th>
                <th className="border border-gray-300">
                  Behavior
                  <button
                    onClick={() => fillAllMarks('behavior')}
                    className="ml-2 text-sm text-blue-500"
                  >
                    Fill All
                  </button>
                </th>
                <th className="border border-gray-300">
                  Working Quiz
                  <button
                    onClick={() => fillAllMarks('workingQuiz')}
                    className="ml-2 text-sm text-blue-500"
                  >
                    Fill All
                  </button>
                </th>
                <th className="border border-gray-300">
                  Project
                  <button
                    onClick={() => fillAllMarks('project')}
                    className="ml-2 text-sm text-blue-500"
                  >
                    Fill All
                  </button>
                </th>
                <th className="border border-gray-300">
                  Final Exam
                  <button
                    onClick={() => fillAllMarks('finalExam')}
                    className="ml-2 text-sm text-blue-500"
                  >
                    Fill All
                  </button>
                </th>
                
                {/* Total Marks Column */}
                <th className="border border-gray-300">Total Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td className="border border-gray-300">{index + 1}</td>
                  <td className="border border-gray-300">{student.name}</td>

                  {/* Participation */}
                  <td className="border border-gray-300">
                    <input
                      type="number"
                      value={marks[+student.id]?.participation || ''}
                      onChange={(e) => handleMarkChange(+student.id, 'participation', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  </td>

                  {/* Behavior */}
                  <td className="border border-gray-300">
                    <input
                      type="number"
                      value={marks[+student.id]?.behavior || ''}
                      onChange={(e) => handleMarkChange(+student.id, 'behavior', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  </td>

                  {/* Working Quiz */}
                  <td className="border border-gray-300">
                    <input
                      type="number"
                      value={marks[+student.id]?.workingQuiz || ''}
                      onChange={(e) => handleMarkChange(+student.id, 'workingQuiz', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  </td>

                  {/* Project */}
                  <td className="border border-gray-300">
                    <input
                      type="number"
                      value={marks[+student.id]?.project || ''}
                      onChange={(e) => handleMarkChange(+student.id, 'project', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  </td>

                  {/* Final Exam */}
                  <td className="border border-gray-300">
                    <input
                      type="number"
                      value={marks[+student.id]?.finalExam || ''}
                      onChange={(e) => handleMarkChange(+student.id, 'finalExam', e.target.value)}
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  </td>

                  {/* Total Marks */}
                  <td className="border border-gray-300">{calculateTotalMarks(+student.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleSaveMarks}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save Marks
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherPage;
