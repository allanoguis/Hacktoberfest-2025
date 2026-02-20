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
      <div className="flex flex-col w-full min-h-screen items-center text-white pt-[calc(var(--nav-height)+4rem)] pb-20">
        <div className="mb-12 text-center px-4">
          <Badge variant="default" className="text-xl md:text-2xl px-6 py-2 shadow-lg">
            Top Ranking Players
          </Badge>
          <p className="mt-4 text-primary/60 text-sm uppercase tracking-[0.2em] antialiased">
            Global Hall of Fame
          </p>
        </div>
        <ul className="flex flex-col gap-4 w-full max-w-2xl px-4 pb-20">
          {data && data.leaderboard && data.leaderboard.length > 0 ? (
            data.leaderboard.map((game, index) => (
              <li key={`${game.playerId || index}-${index}`} className="w-full">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="default" className="text-xs md:text-sm">
                    {(() => {
                      if (index === 0) return <><Trophy className="w-4 h-4 mr-2 animate-pulse text-yellow-400" /> CHAMPION</>;
                      if (index === 1) return <><Medal className="w-4 h-4 mr-2 animate-pulse text-gray-300" /> CHALLENGER</>;
                      if (index === 2) return <><Star className="w-4 h-4 mr-2 animate-pulse text-orange-400" /> RUNNER-UP</>;
                      return `RANK #${index + 1}`;
                    })()}
                  </Badge>
                </div>
                <Card className="hover:scale-[1.02] transition-transform duration-300 border-primary/20 bg-background/50 backdrop-blur-sm">
                  <div className="flex items-center p-4 gap-4">
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="text-lg w-8 h-8 flex items-center justify-center rounded-full">
                        {index + 1}
                      </Badge>
                    </div>
                    <div className="flex-shrink-0">
                      <img
                        src={game.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${game.playerName || 'Guest'}`}
                        alt={game.playerName}
                        className="w-12 h-12 rounded-full border-2 border-primary/20 object-cover"
                        onError={(e) => { e.currentTarget.src = "https://nosrc.net/100x100"; }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-primary truncate">
                        {game.playerName || "GUEST"}
                      </h3>
                      <p className="text-xs text-primary/60 uppercase tracking-tighter">
                        {game.email || "GUEST ACCOUNT"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-primary font-mono tracking-tighter">
                        {game.score.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-primary/40 uppercase font-medium">
                        POINTS
                      </div>
                    </div>
                  </div>
                </Card>
              </li>
            ))
          ) : (
            <div className="text-center py-20 opacity-50 italic text-xl">
              No champions found yet. Be the first!
            </div>
          )}
        </ul>
      </div>
    </>
  );
};

export default Leaderboard;
