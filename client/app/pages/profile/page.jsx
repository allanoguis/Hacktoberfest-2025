"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchHighScore } from "@/services/getHighScoreAPI/route";
import axios from "axios";
import Image from "next/image";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();

  const uname = isLoaded && isSignedIn && user ? user.firstName : "Guest";
  const uemail =
    isLoaded && isSignedIn && user && user.emailAddresses.length > 0
      ? user.emailAddresses[0].emailAddress
      : "Guest email";
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
  const [error, setError] = useState(null);
  const [pastGames, setPastGames] = useState([]);

  useEffect(() => {
    if (isSignedIn && user) {
      getHighScore();
      getPastTenGames();
    }
  }, [isSignedIn, user, getHighScore, getPastTenGames]);

  const getHighScore = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetchHighScore({ playerId: user.id });
      if (res.topGame) {
        setHighscore(res.topGame.score);
      }
    } catch (err) {
      console.error("Error fetching high score:", err);
      setError("Failed to fetch high score");
    }
  }, [user?.id]);

  const getPastTenGames = useCallback(async () => {
    if (!user?.id) return;
    try {
      const backendURL = process.env.NEXT_PUBLIC_API_KEY;
      const response = await axios.get(`${backendURL}/api/getpastten`, {
        params: { userId: user.id },
      });
      setPastGames(response.data.pastTenGames);
    } catch (err) {
      console.error("Error fetching past games:", err);
      setError("Failed to fetch past games");
    }
  }, [user?.id]);

  return (
    <>
      <div className="max-w-4xl mx-auto my-10 p-4">
        <header className="flex items-center pb-5">
          <Image
            src={uimage}
            alt={uname}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full mr-10"
          />
          <div>
            <h1 className="font-semibold text-2xl">{uname}</h1>
            <p className="font-light text-sm">{uemail}</p>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-5 mb-10 text-white">
          <div className="p-4 rounded-lg text-center bg-chart-2">
            <p className="font-bold">Created At</p>
            <p>{ucd}</p>
          </div>
          <div className="p-4 rounded-lg text-center bg-chart-2">
            <p className="font-bold">Last Sign In</p>
            <p>{uls}</p>
          </div>
          <div className="p-4 rounded-lg text-center bg-chart-2">
            <p className="font-bold">High Score</p>
            <p>{highscore}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Past 10 Games</h2>
        {pastGames.length > 0 ? (
          <div className="overflow-x-auto p-4 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Device</th>
                </tr>
              </thead>
              <tbody>
                {pastGames.map((game, index) => (
                  <tr
                    key={game.id}
                    className={`border-b ${index % 2 === 0
                        ? "bg-gray-50 dark:bg-gray-700"
                        : "bg-gray-200 dark:bg-gray-600"
                      } hover:bg-gray-100 dark:hover:bg-gray-500 transition-all duration-300`}
                  >
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                      {new Date(game.time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100">
                      {game.score}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                      {game.deviceType}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-xl text-gray-600 dark:text-gray-400 mt-10">
            No past games found. Get started and set your first high score!
          </p>
        )}
      </div>
    </>
  );
}
