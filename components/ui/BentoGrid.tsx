"use client"
/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import { GradientBg } from "./GradientBg";
import animationData from "@/data/animationData.json";
import { useState } from "react";

import { IoCopyOutline } from "react-icons/io5";
import dynamic from "next/dynamic";
import Lottie from "react-lottie";

const MagicButton = dynamic(() => import('./MagicButton'), { ssr: false });


export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  img, 
  imgClassName, 
  titleClassName, 
  spareImg,
  id
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  img?: string
  imgClassName?: string;
  titleClassName?: string;
  spareImg?: string;
  id?: number
}) => {
  const [copied, setCopied] = useState(false);
  const options={
    loop: true,
    autoplay: copied,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleCopy = async () => {
    navigator.clipboard.writeText("niyubwayoiraelie5777@gmail.com");
    setCopied(true);
    await sleep(2000);
    setCopied(false);
  }

  return (
    <div
      className={cn(
        "row-span-1 rounded-3xl relative overflow-hidden group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none px-2 justify-between flex flex-col space-y-4 border border-border dark:border-white/[0.1]",
        className
      )}
      data-bento-id={id}
      style={{
        background: 'var(--portfolio-panel)',
      }}
    >
      <div className={`${id === 6  && 'flex justify-center'} h-full`}>
        <div className="portfolio-art w-full h-full absolute">
          {img && (
            <img 
            src={img} 
            alt={img}
            className={cn(imgClassName, 'object-cover object-center')}
            />
          )}
        </div>
        <div className={`portfolio-art absolute right-0 -bottom-5 ${id === 5 && 'w-full opacity-80'}`}>
          {spareImg && (
            <img 
             src={spareImg} 
             alt={spareImg}
             className={'object-cover object-center w-full h-full'}
            />
          )}
        </div>
        {id === 6 && (
          <GradientBg containerClassName="portfolio-gradient">
            
          </GradientBg>
        )}
        
        <div className={cn(
          titleClassName,
          'portfolio-bento-content group-hover/bento: translate-x-2 transition duration-200 relative md:h-full min-h-40 flex flex-col px-5 p-5 lg:p-10'
        )}>
          <div className="portfolio-bento-copy group-hover/bento:translate-x-2 transition duration-200">
            <div className="font-sans font-extralight text-muted-foreground dark:text-[#c1c2d3] text-sm md:text-xs lg:text-base z-10">
              {description}
            </div>
            <div className="font-sans font-bold text-lg lg:text-3xl max-w-96 z-10">
              {title}
            </div>
          </div>         
            {id === 3 && (
            <div className="flex gap-1 lg:gap-2 w-fit absolute -right-3 lg:-right-2">
              <div className="flex flex-col gap-3 lg:gap-7">
                {['Kubernetes', 'Docker', 'AWS'].map((item) => (
                  <span key={item} className="py-2 lg:py-5 lg:px-3 px-3 text-xs lg:text-base opacity-100 dark:opacity-50 rounded-lg text-center bg-[var(--portfolio-chip)]">{item}</span>
                ))}
                <span className="py-4 px-3 rounded-lg text-center bg-[var(--portfolio-chip)]"/>
              </div>
              <div className="flex flex-col gap-3 lg:gap-7">
                <span className="py-4 px-3 rounded-lg text-center bg-[var(--portfolio-chip)]"/>
                {['Spring Boot', 'Nginx', 'PostgreSQL'].map((item) => (
                  <span key={item} className="py-2 lg:py-5 lg:px-3 px-3 text-xs lg:text-base opacity-100 dark:opacity-50 rounded-lg text-center bg-[var(--portfolio-chip)]">{item}</span>
                ))}
                
              </div>
            </div>
            )}
            {id === 6 && (
              <div className="mt-5 relative">
                <div className={`absolute -bottom-5 right-0`}>
                  <Lottie options={options}/>
                </div>
                <MagicButton title={copied ? 'Email Copied' : 'Copy My Email'} icon={<IoCopyOutline />} position="left" otherClasses="dark:!bg-[#161a31]"
                handleClick={() => handleCopy()}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
