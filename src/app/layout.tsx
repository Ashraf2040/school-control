import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className='print:p-0 print:m-0'>
        <body className="bg-gray-100 text-gray-900 ">
          <header className="bg-white shadow-md p-4 flex justify-between items-center print:hidden">
            <div className="text-xl font-bold">School Management System</div>
            <div>
              <SignedOut>
                <SignInButton>
                  <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Sign In</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          <main className="max-w-7xl mx-auto mt-6 p-6 bg-white rounded shadow-lg">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
