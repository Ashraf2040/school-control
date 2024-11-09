import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <header className="bg-main mx-4 py-1  rounded-lg my-2 h-20 px-16 grid grid-cols-3 items-center print:hidden">
            <div className='col-span-2 relative    h-full   flex items-center justify-between'>
              
              
                <Image src="/forqan.jpg" alt="Logo"  width={800} height={800}  className=' absolute w-16 h-16 left-0 rounded-full '  />
                  
            <div className='text-3xl font-extrabold text-second  absolute right-0  '>Al-Forqan Private School</div></div>
            <div className='    text-end items-center'>
              <SignedOut>
                <SignInButton >
                  <button className="  right-0 font-semibold text-main bg-second py-2 px-4 rounded text-xl">Sign In</button>
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