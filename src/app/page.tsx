"use client";
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hero from './_components/Hero';

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
    <div className="flex flex-col items-center justify-center h-screen  text-white">
    <Hero />
    </div>
  );
}
