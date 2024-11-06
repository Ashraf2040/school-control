import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const StudentResults = () => {
  const router = useRouter();
  const { id } = router.query; // Student ID
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/students/${id}/marks`)
        .then((response) => response.json())
        .then((data) => setStudentData(data))
        .catch((error) => console.error('Error fetching student data:', error));
    }
  }, [id]);

  if (!studentData) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Results for {studentData.name}</h1>
      <p>Class: {studentData.className}</p>

      <table className="min-w-full border-collapse border border-gray-200 text-sm mt-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Behavior</th>
            <th className="border p-2">Participation</th>
            <th className="border p-2">Project</th>
            <th className="border p-2">Quiz</th>
            <th className="border p-2">Final Exam</th>
            <th className="border p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {studentData.marks.map((mark, index) => (
            <tr key={index}>
              <td className="border p-2">{mark.subjectName}</td>
              <td className="border p-2">{mark.behavior}</td>
              <td className="border p-2">{mark.participation}</td>
              <td className="border p-2">{mark.project}</td>
              <td className="border p-2">{mark.workingQuiz}</td>
              <td className="border p-2">{mark.finalExam}</td>
              <td className="border p-2">{mark.totalMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentResults;
