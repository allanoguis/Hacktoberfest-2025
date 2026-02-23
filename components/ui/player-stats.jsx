"use client";
import React from 'react';
import { Trophy, Clock, Gamepad2, TrendingUp, Award } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './badge';

const PlayerStats = ({ 
  player, 
  rank, 
  showDetailedStats = false,
  compact = false 
}) => {
  const getRankBadge = (rank) => {
    if (rank === 0) {
      return (
        <Badge variant="default" className="text-xs md:text-sm bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-yellow-400">
          <Trophy className="w-4 h-4 mr-2 animate-pulse" />
          CHAMPION
        </Badge>
      );
    } else if (rank === 1) {
      return (
        <Badge variant="default" className="text-xs md:text-sm bg-gradient-to-r from-gray-400 to-gray-500 text-white border-gray-300">
          <Award className="w-4 h-4 mr-2 animate-pulse" />
          CHALLENGER
        </Badge>
      );
    } else if (rank === 2) {
      return (
        <Badge variant="default" className="text-xs md:text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-400">
          <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
          RUNNER-UP
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="text-xs md:text-sm">
          RANK #{rank + 1}
        </Badge>
      );
    }
  };

  const formatTime = (time) => {
    if (!time) return '--';
    if (time < 60) return `${time.toFixed(1)}s`;
    const minutes = Math.floor(time / 60);
    const seconds = (time % 60).toFixed(1);
    return `${minutes}m ${seconds}s`;
  };

  const formatScore = (score) => {
    return score ? score.toLocaleString() : '0';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-primary/20">
        <div className="flex-shrink-0">
          <Badge variant="outline" className="text-sm w-6 h-6 flex items-center justify-center rounded-full">
            {rank + 1}
          </Badge>
        </div>
        
        <div className="flex-shrink-0 relative w-10 h-10">
          <Image
            src={player.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.player_name || 'Guest'}`}
            alt={player.player_name}
            width={40}
            height={40}
            className="w-full h-full rounded-full border-2 border-primary/20 object-cover"
            onError={(e) => {
              console.log('Avatar load error for player:', player.player_name, 'URL:', player.profile_image_url);
              e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.player_name || 'Guest'}`;
            }}
            onLoad={() => {
              console.log('Avatar loaded successfully for player:', player.player_name, 'URL:', player.profile_image_url);
            }}
            unoptimized
          />
        </div>
        
        <div className="flex-grow min-w-0">
          <h4 className="font-semibold text-sm text-primary truncate">
            {player.playerName || "GUEST"}
          </h4>
          <p className="text-xs text-tertiary truncate">
            {formatScore(player.score)} pts
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-primary font-mono">
            {formatScore(player.score)}
          </div>
          {player.bestTime && (
            <div className="text-xs text-tertiary flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTime(player.bestTime)}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <div className="flex items-center gap-2 mb-2">
        {getRankBadge(rank)}
        {player.games_played && (
          <Badge variant="outline" className="text-xs">
            <Gamepad2 className="w-3 h-3 mr-1" />
            {player.games_played} games
          </Badge>
        )}
      </div>
      
      <div className="bg-card-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-primary/20 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Rank Number */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/30">
                <span className="text-sm font-bold text-primary">
                  {rank + 1}
                </span>
              </div>
            </div>

            {/* Player Avatar */}
            <div className="flex-shrink-0 relative w-14 h-14">
              <Image
                src={player.profile_image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.player_name || 'Guest'}`}
                alt={player.player_name}
                width={56}
                height={56}
                className="w-full h-full rounded-full border-2 border-primary/20 object-cover ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all"
                onError={(e) => {
                  console.log('Avatar load error for player:', player.player_name, 'URL:', player.profile_image_url);
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.player_name || 'Guest'}`;
                }}
                onLoad={() => {
                  console.log('Avatar loaded successfully for player:', player.player_name, 'URL:', player.profile_image_url);
                }}
                unoptimized
              />
              {rank < 3 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse border-2 border-background" />
              )}
            </div>

            {/* Player Info */}
            <div className="flex-grow min-w-0">
              <h3 className="font-bold text-lg text-primary truncate mb-1">
                {player.playerName || "GUEST"}
              </h3>
              <p className="text-xs text-inactive uppercase tracking-tighter truncate mb-2">
                {player.email || "GUEST ACCOUNT"}
              </p>
              
              {/* Additional Stats */}
              {showDetailedStats && (
                <div className="flex items-center gap-4 text-xs text-tertiary">
                  {player.games_played && (
                    <div className="flex items-center gap-1">
                      <Gamepad2 className="w-3 h-3" />
                      <span>{player.games_played} games</span>
                    </div>
                  )}
                  {player.bestTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Best: {formatTime(player.bestTime)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Score Display */}
            <div className="text-right">
              <div className="text-2xl font-black text-primary font-mono tracking-tighter">
                {formatScore(player.score)}
              </div>
              <div className="text-[10px] text-inactive uppercase font-medium mb-1">
                POINTS
              </div>
              {player.time && (
                <div className="text-xs text-tertiary flex items-center gap-1 justify-end">
                  <Clock className="w-3 h-3" />
                  {formatTime(player.time)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress Bar (visual representation of score relative to max) */}
        {showDetailedStats && (
          <div className="h-1 bg-gradient-to-r from-primary/20 to-primary/60" />
        )}
      </div>
    </div>
  );
};

export default PlayerStats;
