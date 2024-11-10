import React from 'react'
import ScrollingImages from './ScrollingImages';
import Image from 'next/image';
import Countdown from './CountDown';

const Hero = () => {
  const images = [
    { src: '/stem.png', alt: 'Image 1' },
    { src: '/logo.png', alt: 'Image 2' },
    { src: '/BritishCouncil.png', alt: 'Image 3' },
    { src: '/Cognia.png', alt: 'Image 4' },
  ];

  const targetDate = '2024-11-15T23:59:59Z';
  return (


<section className=" bg-[url('/hero.jpg')] bg-cover w-full flex items-center flex-col   h-screen justify-between pt-4 relative">
  <div className="mx-auto w-full relative px-4   flex  items-center flex-col">
    
   <div className='w-full flex items-center justify-between flex-wrap '>
   <div className='  p-4 flex items-center flex-col justify-center  font-bold text-main shadow-lg w-full md:w-fit   rounded-lg shadow-main'>
<h1 className='text-lg '>1st Trimester Data Entry</h1>
<h6 className='text-sm'>Available Till : <span className='text-red-700'>05/11/2024</span></h6>
    </div>
    <div className=' p-4 flex items-center  w-full md:w-fit flex-col justify-center top-0 font-semibold text-red-700  '>
      <span className='text-main font-semibold text-lg'>Time Remaining :</span>
    <Countdown targetDate={targetDate} />
    </div>
   </div>
    <div className="mx-auto   py-24 text-center  self-center ">
      <h1 className="md:text-4xl text-xl font-extrabold  text-main min-w-fit ">
     Welcome To The School Control System.
        <strong className="font-bold text-red-700 sm:block mt-8"> Alforqan Private School. </strong>
      </h1>

      

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          className="block w-full rounded bg-main px-12 py-3 text-sm font-medium text-white shadow hover:bg-red-700 focus:outline-none focus:ring active:bg-red-500 sm:w-auto"
          href="#"
        >
          Get Started
        </a>

        <a
          className="block w-full rounded px-12 py-3 text-sm font-medium text-main shadow hover:text-red-700 focus:outline-none focus:ring active:text-red-500 sm:w-auto"
          href="#"
        >
          Learn More
        </a>
      </div>
      
    </div>

    
  </div>

  {/* <div className=' absolute bottom-0  w-full  '>
    <Image src="/logo.png" alt="Logo"  width={800} height={800}  className=' absolute w-20 h-20 left-0 rounded-full '  />
  </div> */}
</section>
  )
}

export default Hero