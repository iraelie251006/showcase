import React from 'react'
import ReactPlayer from 'react-player';

const ComingSoon = () => {
  return (
    <section>
        <h1 className='heading'>
            Coming
            <span className='text-purple'> Soon</span>
        </h1>
        <div className='w-full mt-12 flex flex-col'>
            
            <p className='text-sm lg:text-base font-light text-center'>I’m currently building <span className='text-purple font-bold'>TechNura</span>, a tech company focused on delivering modern, scalable digital solutions tailored for startups and small businesses.</p> 
            <p className='text-sm lg:text-base font-light text-center max-sm:mt-2'>Our mission is to empower organizations with intuitive, performance-driven web and mobile applications.</p> 
            <p className='text-sm lg:text-base font-light text-center max-sm:mt-2'>The full launch is in progress stay tuned for more soon.</p>
            
            <p className='text-center mt-5 font-light text-sm lg:text-base'>Status: In <span className='text-purple font-semibold'>development</span> — launching soon.</p>
<div className='flex justify-center items-center mt-5'>
   <ReactPlayer
                src="/nura.mp4"
                controls
                width="500px"
                height="500px"
            /> 
</div>
            
        </div>
    </section>
  )
}

export default ComingSoon