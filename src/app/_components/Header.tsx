import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <header className="bg-main mx-4 py-1   rounded-lg my-2 h-16 px-4 md:px-8 lg:px-12 grid grid-cols-3 items-center print:hidden">
            <div className='col-span-2 relative    h-full   flex items-center justify-between'>
              
              
                <Image src="/forqan.jpg" alt="Logo"  width={800} height={800}  className=' absolute w-12 h-12 left-0 rounded-full '  />
                  
            <div className='text-3xl hidden md:block font-bold text-second  absolute right-0  '>Al-Forqan Private School</div></div>
            <div className='    text-end items-center'>
              <SignedOut>
                <SignInButton >
                  <button className="  right-0 text-xs font-bold text-main bg-second p-1 md:px-2 rounded md:text-lg">Sign In</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
  )
}

export default Header