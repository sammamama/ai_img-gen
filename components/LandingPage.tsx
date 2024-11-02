"use client";

import React from "react";
import DatingAppComponent from "@/components/DatingAppComponent";
import Examples from "./Examples";
import {Pixelify_Sans} from 'next/font/google'
import Cta from "./Cta";

const pixelify = Pixelify_Sans({ subsets: ['latin'] });

const LandingPage = () => {

  return (
    <div className="relative  h-full w-full bg-white select-none">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:29px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      <div className="flex h-screen w-full items-center justify-between ">
        <div className="flex w-full flex-col">
          <div className="flex flex-col w-full text-6xl h-full tracking-wide justify-center items-center ">
            <div className="p-3 font-bold text-center bg-gradient-to-r from-blue-500 to-red-500 bg-clip-text text-transparent shadow-md">Bring your A Game</div>
            <div className="text-lg font-light" style={{ wordSpacing: "12px" }}>
              Elevate your dating profile by the help of AI
            </div>
          </div>
          <div className={`flex justify-center font-black p-8 text-[60px] ${pixelify.className}`}>
            <div className={`flex flex-col text-center justify-center`}>
              80% <br />{" "}
              <span className="text-lg font-thin">Increase in matches</span>
            </div>
            <div className="flex flex-col text-center justify-center">
              80% <br />{" "}
              <span className="text-lg font-thin px-20">
                Increase in matches
              </span>
            </div>
            <div className="flex flex-col text-center justify-center">
              80% <br />{" "}
              <span className="text-lg font-thin">Increase in matches</span>
            </div>
          </div>
        </div>

        <div className="flex w-full h-full justify-center items-center">
          <DatingAppComponent />
        </div>
      </div>
      <Examples />
      <Cta />
    </div>
  );
};

export default LandingPage;
