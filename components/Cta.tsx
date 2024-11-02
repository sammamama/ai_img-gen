'use client'

import React, { Suspense } from "react";
import { motion } from "framer-motion";
import { SquareArrowUpRight } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { redirect } from "next/navigation";

const Cta = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center relative">
      <div className="w-full h-[70%] shadow-md shadow-neutral-800 flex items-center justify-center bg-neutral-900 rounded-xl">
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          whileInView={{
            opacity: 1,
            y: 30,
            transition: { duration: 0.6, staggerChildren: 0.3 },
          }}
          className="p-10 rounded-xl z-10 w-80 bg-neutral-900 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-bold z-10 text-transparent font-outline-2"
          >
            Ready to enhance your profile
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 30 }}
            transition={{ duration: 0.6 }}
            className="flex"
          >
            <button
              className="border-2 flex items-center justify-center z-10  hover:bg-black transition-all 
            text-neutral-200 bg:text-neutral-800   border-neutral-600 bg-neutral-800 rounded-full px-2 py-1 m-5"
              onClick={() => {redirect('/api/auth/signin')}}
            >
              Sign up
              <SquareArrowUpRight strokeWidth={1.5} className="ml-2" />
            </button>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute inset-0">
      {/* <Suspense fallback={<div className="w-full h-full bg-neutral-900" />}>
          <Canvas>
            <Stars 
              radius={50}
              count={2500}
              factor={4}
              fade
              speed={2}
            />
          </Canvas>
        </Suspense> */}
      </div>
    </div>
  );
};

export default Cta;
