"use client"; // Marks this component as client-side

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

  return (
    <>
      <section className="relative flex items-center justify-center h-[calc(100vh-var(--nav-height))] mt-[var(--nav-height)] w-full bg-gradient-to-b from-blue-400 to-orange-400 dark:from-blue-900 dark:to-orange-900 overflow-hidden">
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
            bottom: "0%",
          }}
          transition={{ duration: 1, type: "spring", damping: 20 }}
          className="absolute left-0 bottom-0 pointer-events-none"
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

        {/* tank */}
        <motion.div
          initial={{ opacity: 0, x: 500 }}
          animate={{
            opacity: 1,
            x: 0,
            bottom: "2rem",
          }}
          transition={{ duration: 1, delay: 0.2, type: "spring", damping: 20 }}
          className="absolute right-0 bottom-0 pointer-events-none"
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

        {/* cloud1 (background decoration) */}
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{
            opacity: 0.6,
            x: "10%",
            top: "15%",
          }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute pointer-events-none select-none blur-[1px]"
        >
          <Image src={cloud1} alt="Decoration Cloud" width={150} />
        </motion.div>

        {/* cloud2 (background decoration) */}
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{
            opacity: 0.4,
            x: "45%",
            top: "25%",
          }}
          transition={{ duration: 2, delay: 0.7 }}
          className="absolute pointer-events-none select-none blur-[2px]"
        >
          <Image src={cloud1} alt="Decoration Cloud" width={200} />
        </motion.div>

        {/* cloud3 (background decoration) */}
        <motion.div
          initial={{ opacity: 0, x: "100%" }}
          animate={{
            opacity: 0.5,
            x: "75%",
            top: "10%",
          }}
          transition={{ duration: 2, delay: 1 }}
          className="absolute pointer-events-none select-none blur-[1px]"
        >
          <Image src={cloud1} alt="Decoration Cloud" width={120} />
        </motion.div>
      </section>
    </>
  );
}
