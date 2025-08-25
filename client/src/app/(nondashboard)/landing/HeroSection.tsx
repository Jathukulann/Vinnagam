"use client"
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function HeroSection() {
  return (
    <div className="relative h-screen">
      <Image
        src="/landingPage.jpg"
        alt="Landing Background"
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 ">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-1/3 transform -translate-x-1/2 -translate-y-1/2 text-center w-full"
        >
            <div className="max-w-4xl mx-auto px-16 sm:px-12">
                <h1 className="text-4xl font-bold text-white">Start your journey to finding the perfect place to call Home </h1>
                <p className="text-xl text-white mb-8">Discover your ideal living space with us.</p>
               <div className="flex justify-center">
                   <button className="bg-secondary-600 text-white px-6 py-3 rounded-lg hover:bg-secondary-500 transition duration-300"
                   onClick={() => {}}>
                       browse Houses
                   </button>
               </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroSection;