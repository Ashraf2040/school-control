import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className='print:p-0 print:m-0'>
        <body className=" text-gray-900 ">
          <header className="bg-[#3a4750] mx-4 my-5 rounded-lg p-4 px-16 grid grid-cols-4 items-center print:hidden">
            <div className='col-span-3 pr-60  flex items-center justify-between'>
              
              <div className="text-xl font-bold text-white  ">School Management System</div>
            <div className='text-xl font-bold text-white  '>Al-Forqan Private School</div></div>
            <div className='    text-end items-center'>
              <SignedOut>
                <SignInButton >
                  <button className="  right-0 bg-[#3a4750] text-white py-2 px-4 rounded text-xl">Sign In</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main className=" mx-auto mt-6 p-6 bg-white rounded shadow-lg">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
