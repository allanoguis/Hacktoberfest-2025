"use client"; // Marks this component as client-side

import React from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs"; // Clerk's useUser hook
import { motion } from "framer-motion"; // Added useAnimation
import Image from "next/image";
import herogojira from "@/assets/images/hero/herogojira.png";
import herotank from "@/assets/images/hero/herotank.png";
import cloud1 from "@/assets/images/game/cloud1.png";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { isLoaded, isSignedIn, user } = useUser(); // useUser hook for client-side user data
  // Safely get the username, or use firstName, or fallback to "Guest"
  const username = isLoaded && isSignedIn && user ? user.firstName : "Guest";

  // Animation variants
  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const router = useRouter();
  const Start = () => {
    router.push("/game");
  };

  // Multiply clouds by 3 and randomize their positions for continuous scrolling
  const clouds = React.useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      top: `${Math.floor(Math.random() * 40) + 5}%`, // 5% to 45%
      delay: Math.random() * -60, // Negative delay to populate screen immediately
      duration: Math.floor(Math.random() * 20) + 30, // 30s to 50s for a slow drift
      width: Math.floor(Math.random() * 150) + 100, // 100px to 250px
      opacity: (Math.random() * 0.4 + 0.3).toFixed(2), // 0.3 to 0.7
      blur: `blur(${Math.floor(Math.random() * 3)}px)`,
    }));
  }, []);

  return (
    <>
      <section className="relative flex items-center justify-center h-screen w-full bg-gradient-to-b from-blue-400 to-orange-400 dark:from-blue-900 dark:to-orange-900 overflow-hidden">
        {/* Loading Screen */}
        {!isLoaded && (
          <motion.div
            variants={loadingVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0 flex items-center justify-center bg-background z-20"
          >
            <h2 className="text-2xl font-bold">Loading...</h2>
          </motion.div>
        )}

        {/* Randomized Continuous Clouds - Background Layer */}
        {clouds.map((cloud) => (
          <motion.div
            key={cloud.id}
            initial={{ opacity: cloud.opacity, x: "110vw", top: cloud.top }}
            animate={{
              x: "-110vw",
            }}
            transition={{
              duration: cloud.duration,
              delay: cloud.delay,
              ease: "linear",
              repeat: Infinity,
            }}
            className={`absolute pointer-events-none select-none ${cloud.blur}`}
          >
            <Image src={cloud1} alt="Decoration Cloud" width={cloud.width} />
          </motion.div>
        ))}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 text-center px-4"
        >
          <p className="text-3xl md:text-5xl font-extrabold mb-4 uppercase text-balance">
            Welcome to Gojirun, {username}!
          </p>

          <p className="text-base md:text-lg mb-8 opacity-90">
            A 2D platformer inspired by the classic Chrome T-Rex run.
          </p>

          <Button
            asChild
            className="px-8 py-6 bg-gradient-to-r from-accent to-pink-600 text-lg font-bold rounded-full hover:animate-ping-once transition-transform duration-1000 shadow-lg animate-bounce cursor-pointer group"
            onClick={Start}
          >
            <span className="group-hover:scale-105 transition-transform">Play Now</span>
          </Button>
        </motion.div>

        {/* gojira */}
        <motion.div
          initial={{ opacity: 0, x: -500 }}
          animate={{
            opacity: 1,
            x: 0,
            bottom: 0,
          }}
          transition={{ duration: 1, type: "spring", damping: 20 }}
          className="absolute left-0 bottom-0 pointer-events-none z-20"
        >
          <div className="relative w-[300px] md:w-[500px] h-[300px] md:h-[500px]">
            <Image
              src={herogojira}
              alt="Gojira Hero"
              fill
              className="object-contain object-bottom"
              priority
            />
          </div>
        </motion.div>

        {/* tank - hidden on mobile, visible from md breakpoint */}
        <motion.div
          initial={{ opacity: 0, x: 500 }}
          animate={{
            opacity: 1,
            x: 0,
            bottom: 0,
          }}
          transition={{ duration: 1, delay: 0.2, type: "spring", damping: 20 }}
          className="absolute right-0 bottom-0 pointer-events-none z-20 hidden md:block"
        >
          <div className="relative w-[250px] md:w-[500px] h-[150px] md:h-[250px]">
            <Image
              src={herotank}
              alt="Tank Hero"
              fill
              className="object-contain object-bottom"
            />
          </div>
        </motion.div>
      </section>
    </>
  );
}
