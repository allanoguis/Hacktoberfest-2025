"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchHighScore } from "@/lib/api-client";
import Image from "next/image";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();

  const uname = isLoaded && isSignedIn && user ? user.firstName : "Guest";
  const uemail =
    isLoaded && isSignedIn && user && user.emailAddresses.length > 0
      ? user.emailAddresses[0].emailAddress
      : "";
  const uimage =
    isLoaded && isSignedIn && user
      ? user.imageUrl
      : "https://nosrc.net/100x100";
  const ucd =
    isLoaded && isSignedIn && user && user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "DD/MM/YYYY";
  const uls =
    isLoaded && isSignedIn && user && user.lastSignInAt
      ? new Date(user.lastSignInAt).toLocaleDateString()
      : "DD/MM/YYYY";

  const [highscore, setHighscore] = useState(0);
  const [pastGames, setPastGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/profile?userId=${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch profile data');
      const data = await response.json();

      if (data) {
        setHighscore(data.highScore || 0);
        setPastGames(data.pastGames || []);
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchProfileData();
    }
  }, [isSignedIn, user, fetchProfileData]);

  return (
    <div className="flex flex-col items-center min-h-screen w-full pt-[calc(var(--nav-height)+2rem)] pb-20 px-4">
      <div className="w-full max-w-4xl">
        <header className="flex flex-col md:flex-row items-center gap-6 pb-12 border-b border-primary/10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <Image
              src={uimage}
              alt={uname}
              width={100}
              height={100}
              className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background object-cover shadow-xl"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="font-black text-3xl md:text-5xl text-primary uppercase tracking-tighter antialiased">
              {uname}
            </h1>
            {uemail && (
              <p className="font-mono text-sm md:text-lg text-primary/60 mt-2 lowercase">
                {uemail}
              </p>
            )}
            {!isSignedIn && (
              <p className="font-mono text-xs text-primary/40 uppercase tracking-widest mt-2 antialiased">
                Guest Player Account
              </p>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 my-12 antialiased">
          <div className="p-6 rounded-2xl bg-primary shadow-xl text-secondary flex flex-col items-center justify-center transform hover:scale-[1.02] transition-transform">
            <p className="font-bold text-xs uppercase tracking-widest opacity-70">Created At</p>
            <p className="font-black text-xl md:text-2xl mt-1 font-mono">{isSignedIn ? ucd : "---"}</p>
          </div>
          <div className="p-6 rounded-2xl bg-primary shadow-xl text-secondary flex flex-col items-center justify-center transform hover:scale-[1.02] transition-transform">
            <p className="font-bold text-xs uppercase tracking-widest opacity-70">Last Sign In</p>
            <p className="font-black text-xl md:text-2xl mt-1 font-mono">{isSignedIn ? uls : "---"}</p>
          </div>
          <div className="p-6 rounded-2xl bg-primary shadow-xl text-secondary flex flex-col items-center justify-center transform hover:scale-[1.02] transition-transform">
            <p className="font-bold text-xs uppercase tracking-widest opacity-70">High Score</p>
            <p className="font-black text-3xl md:text-4xl mt-1 font-mono tracking-tighter">
              {highscore.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xl md:text-3xl font-black text-primary uppercase tracking-widest antialiased">
              Past 10 Games
            </h2>
            <div className="h-1 flex-grow bg-primary/10 rounded-full"></div>
          </div>

          {pastGames.length > 0 ? (
            <div className="overflow-hidden rounded-2xl border border-primary/10 shadow-2xl bg-background/50 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary/5 text-primary/60 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
                      <th className="px-6 py-4 md:py-6 whitespace-nowrap">Date</th>
                      <th className="px-6 py-4 md:py-6 whitespace-nowrap">Score</th>
                      <th className="px-6 py-4 md:py-6 whitespace-nowrap text-right">Device/Browser</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {pastGames.map((game, index) => (
                      <tr
                        key={game.id}
                        className="hover:bg-primary/[0.02] transition-colors duration-300 antialiased"
                      >
                        <td className="px-6 py-4 md:py-6 text-xs md:text-sm font-medium text-primary/80">
                          {new Date(game.time).toLocaleDateString()}
                          <span className="block text-[10px] opacity-40 font-mono mt-0.5">
                            {new Date(game.time).toLocaleTimeString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 md:py-6">
                          <span className="font-black text-lg md:text-xl text-primary font-mono tracking-tighter">
                            {game.score.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 md:py-6 text-right">
                          <span className="inline-block px-3 py-1 rounded-full bg-primary/5 text-[9px] md:text-[10px] font-bold text-primary/60 border border-primary/10 shadow-sm uppercase whitespace-nowrap">
                            {game.deviceType || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-6 rounded-3xl border-2 border-dashed border-primary/10 bg-primary/[0.01]">
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <span className="text-3xl opacity-20 transform -rotate-12">🎮</span>
              </div>
              <p className="text-center text-lg md:text-xl font-medium text-primary/40 uppercase tracking-widest antialiased">
                No past games found.
              </p>
              <p className="text-center text-[10px] md:text-xs text-primary/30 mt-2 uppercase tracking-tight antialiased">
                Get started and set your first high score!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
