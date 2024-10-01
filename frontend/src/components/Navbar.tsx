"use client";

import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaWallet } from 'react-icons/fa';

const Navbar: React.FC = () => {
  
  return (
    <div className="bg-[#1d292c] flex justify-between items-center z-20 shadow-md shadow-secondary px-5 py-2">
       
        {/* Left Section - Logo */}
        <div className="flex flex-col items-center justify-center flex-1 mb-4 sm:mb-0">  
        <Link href="/" passHref>
            <div className="flex items-center gap-3 cursor-pointer">

            <div className="relative w-20 h-20 overflow-hidden rounded-full">
            <Image 
             alt="Asset chain logo" 
             fill 
             src="/igwebuikelogo.png" 
            style={{ objectFit: "contain" }} // This will ensure the entire logo fits within the circle
           />
           </div>


                <div className="flex flex-col">
                <span className="text-4xl font-bold text-white flex justify-center items-center  ">IGWEBUIKE </span>
                {/* "RWA ISUSU" Centered Below */}
                <span className="text-xl font-bold text-white mt-1 mx-auto block text-center">ISUSU</span>
                </div>
                

               
                </div>
                </Link>
               
          
      
       {/* Right Section - Wallet and Connect Button */}
        <div className="flex items-center gap-20 justify-center mt-7">
          <Link href="/wallet" passHref>
            <FaWallet className="text-5xl text-white cursor-pointer" />
          </Link>
          <div className="scale-150">
          <ConnectButton />
          </div>

         
          </div>
      </div>
      </div>
    
    
  );
};

export default Navbar;