import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';
import Image from 'next/image';
import Header from './_components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className='print:p-0 print:m-0'>
        <body className=" text-gray-900 min-h-screen ">
        <Header />
          <main className=" mx-auto mt-6 p-6  bg-cover bg-center  rounded shadow-lg">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
