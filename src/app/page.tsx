"use client";
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { isLoaded, userId } = useAuth(); 
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      const role = user?.publicMetadata?.role;
      if (role === 'ADMIN') {
        router.push('/admin');
      } else if (role === 'TEACHER') {
        router.push('/teacher');
      }
    }
  }, [isLoaded, userId, user, router]);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-6">Welcome to the School Management System</h1>
      <p className="text-lg">You will be redirected shortly...</p>
    </div>
  );
}
