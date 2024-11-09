"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TeacherCreation = () => {
  const router = useRouter();
  const [teacherData, setTeacherData] = useState<{ 
    name: string; 
    email: string; 
    subjectIds: string[];  // Change from subjectId to subjectIds (array)
    classIds: string[]; 
    password: string; 
  }>({
    name: '', 
    email: '', 
    subjectIds: [],  // Initialize as an empty array
    classIds: [], 
    password: '123456789'
  });
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch('/api/subjects');
      if (response.ok) {
        const subjects = await response.json();
        setSubjects(subjects);
      } else {
        console.error('Failed to fetch subjects');
      }
    };

    const fetchClasses = async () => {
      const response = await fetch('/api/classCreation');
      if (response.ok) {
        const classes = await response.json();
        setClasses(classes);
      } else {
        console.error('Failed to fetch classes');
      }
    };

    fetchSubjects();
    fetchClasses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeacherData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setTeacherData((prev) => ({ ...prev, classIds: selectedOptions }));
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Update subjectIds as an array
    const selectedSubjectId = e.target.value;
    setTeacherData((prev) => ({ ...prev, subjectIds: [selectedSubjectId] }));  // Always set as an array
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/teachersCreation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teacherData),  // teacherData already has subjectIds as an array
    });

    if (response.ok) {
      alert('Teacher created successfully!');
      router.push('/admin');
    } else {
      alert('Failed to create teacher');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-2xl font-semibold text-center mb-6">Create New Teacher</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={teacherData.name}
            onChange={handleChange}
            required
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={teacherData.email}
            onChange={handleChange}
            required
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Subject:</label>
          <select
            name="subjectId"
            onChange={handleSubjectChange}  // Change to handleSubjectChange
            required
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a Subject</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Classes:</label>
          <select
            name="classIds"
            multiple
            onChange={handleClassChange}
            required
            className="mt-2 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {classes.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500">Hold down Ctrl (Windows) or Command (Mac) to select multiple classes.</p>
        </div>

        <button
          type="submit"
          className="mt-4 w-full py-3 px-6 bg-main text-white font-semibold rounded-md shadow-lg   "
        >
          Create Teacher
        </button>
      </form>
    </div>
  );
};

export default TeacherCreation;
