'use client';

import { cn } from "@/lib/utils"; // Make sure you have a cn utility function in your project

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)} {...props}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
      >
        <defs>
          <clipPath id="circleClip">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
        </defs>
        
        <g clipPath="url(#circleClip)">
          {/* Background */}
          <rect width="100" height="100" fill="#FBFADC" />
          
          {/* Field */}
          <path d="M0 100C20 80 80 80 100 100" fill="#E8F5E9" />
          <path d="M-10 75 C 20 65, 70 70, 110 85" stroke="#4CAF50" strokeWidth="3" fill="none" />
          <path d="M-10 85 C 25 75, 75 80, 110 95" stroke="#4CAF50" strokeWidth="3" fill="none" />
          <path d="M-10 95 C 30 85, 80 90, 110 105" stroke="#4CAF50" strokeWidth="3" fill="none" />

          {/* Farmer */}
          <g transform="translate(50 60) scale(0.8)">
            {/* Hat */}
            <path d="M -15 -12 C -5 -22, 5 -22, 15 -12 L 10 -10 C 5 -15, -5 -15, -10 -10 Z" fill="#FBC02D" />
            {/* Head */}
            <circle cx="0" cy="-5" r="5" fill="#795548" />
            {/* Body */}
            <path d="M -10 -2 C -15 15, 15 15, 10 -2" fill="#EFEBE9" />
             {/* Legs */}
            <rect x="-8" y="12" width="6" height="10" fill="#004D40" />
            <rect x="2" y="12" width="6" height="10" fill="#004D40" />
          </g>

          {/* Trees */}
          <g transform="translate(15 50) scale(0.7)">
            <rect x="5" y="15" width="4" height="25" fill="#8D6E63" />
            <circle cx="7" cy="5" r="15" fill="#AED581" />
             <circle cx="12" cy="10" r="5" fill="#FFF176" />
             <circle cx="0" cy="0" r="3" fill="#DCE775" />
          </g>
           <g transform="translate(28 58) scale(0.5)">
            <rect x="5" y="15" width="3" height="18" fill="#A1887F" />
            <circle cx="6" cy="5" r="12" fill="#C5E1A5" />
            <circle cx="10" cy="8" r="4" fill="#FFF59D" />
            <circle cx="2" cy="2" r="2" fill="#E6EE9C" />
          </g>

          {/* Tall Grass */}
           <g transform="translate(80 50) scale(0.8)">
            <path d="M 0 20 Q -5 0, 5 0" stroke="#F5E68C" strokeWidth="3" fill="none" />
            <path d="M 5 20 Q 0 -5, 10 0" stroke="#F5E68C" strokeWidth="3" fill="none" />
            <path d="M -5 20 Q -10 0, 0 0" stroke="#F5E68C" strokeWidth="3" fill="none" />
            <path d="M 0 20 Q -2 10, -8 12" stroke="#66BB6A" strokeWidth="2" fill="none" />
            <path d="M 5 20 Q 8 10, 12 15" stroke="#66BB6A" strokeWidth="2" fill="none" />
          </g>
        </g>
      </svg>
      <h1 className="text-xl font-bold font-headline">KrishiMitra</h1>
    </div>
  );
}
