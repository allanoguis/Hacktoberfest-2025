"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from "./ui/playerCard";
import { Badge } from "./ui/badge";
import { Medal } from "lucide-react";
import { Trophy } from "lucide-react";
import { Star } from "lucide-react";

import { getLeaderboard } from "@/lib/api-client";

export const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLeaderboard();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="flex flex-col w-full h-screen overflow-y-scroll items-center justify-center text-white">
        <div className="mb-10">
          <Badge variant="default" className="text-xl">
            Top Ranking Players
          </Badge>
        </div>
        <ul className="flex flex-col gap-4">
          {data &&
            data.leaderboard
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((game, index) => (
                <li key={`${game.id}-${index}`}>
                  {" "}
                  <Badge variant="default" className="text-sm">
                    {(() => {
                      const badgeLabels = {
                        0: (
                          <>
                            <Trophy className="w-6 h-6 mr-2 animate-pulse" />{" "}
                            CHAMPION
                          </>
                        ),
                        1: (
                          <>
                            <Medal className="w-6 h-6 mr-2 animate-pulse" />{" "}
                            CHALLENGER
                          </>
                        ),
                        2: (
                          <>
                            <Star className="w-6 h-6 mr-2 animate-pulse" />{" "}
                            RUNNER-UP
                          </>
                        ),
                      };
                      return badgeLabels[index] || " ";
                    })()}
                  </Badge>
                  <Card>
                    <CardTitle>
                      <Badge variant="secondary">{index + 1}</Badge>
                    </CardTitle>
                    <CardHeader>score: {game.score}</CardHeader>
                    <CardContent>
                      name: {game.playerName || "Tester"}
                    </CardContent>
                    <CardFooter></CardFooter>
                  </Card>
                </li>
              ))}
        </ul>
      </div>
    </>
  );
};

export default Leaderboard;
