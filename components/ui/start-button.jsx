"use client";
import React from 'react';
import { cn } from '@/lib/utils';

const StartButton = ({ 
  children = "Button", 
  onClick, 
  className = "",
  disabled = false,
  type = "button",
  ...props 
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative cursor-pointer py-4 px-8 text-center font-barlow inline-flex justify-center text-base uppercase text-white rounded-lg border-solid transition-all duration-500 ease-out group outline-offset-4 focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 overflow-hidden",
        "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600",
        "shadow-lg shadow-emerald-500/50 transition-shadow duration-2000 ease-out",
        "hover:shadow-2xl hover:shadow-emerald-500/60 hover:shadow-cyan-500/40",
        "hover:scale-105 active:scale-95",
        "border-2 border-emerald-400/50",
        "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-emerald-400/20 before:via-teal-400/20 before:to-cyan-400/20 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:ease-out",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span className="relative z-20">{children}</span>

      <span
        className="absolute left-[-75%] top-0 h-full w-[50%] bg-gradient-to-r from-white/30 to-white/10 rotate-12 z-10 blur-md group-hover:left-[125%] transition-all duration-700 ease-out"
      ></span>

      <span
        className="w-1/2 transition-all duration-500 ease-out block border-emerald-300 absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0 group-hover:h-[30%] group-hover:border-emerald-200"
      ></span>
      <span
        className="w-1/2 transition-all duration-500 ease-out block border-emerald-300 absolute h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0 group-hover:h-[90%] group-hover:border-emerald-200"
      ></span>
      <span
        className="w-1/2 transition-all duration-500 ease-out block border-emerald-300 absolute h-[60%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0 group-hover:h-[90%] group-hover:border-emerald-200"
      ></span>
      <span
        className="w-1/2 transition-all duration-500 ease-out block border-emerald-300 absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0 group-hover:h-[30%] group-hover:border-emerald-200"
      ></span>
    </button>
  );
};

export default StartButton;
