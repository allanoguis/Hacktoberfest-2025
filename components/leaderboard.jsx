"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Badge } from "./ui/badge";
import { Trophy } from "lucide-react";
import { getLeaderboard } from "@/lib/api-client";
import { LeaderboardSkeleton } from "./ui/skeleton";
import LeaderboardFilters from "./ui/leaderboard-filters";
import Pagination from "./ui/pagination";
import PlayerStats from "./ui/player-stats";

export const Leaderboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    timeFilter: 'all'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchLeaderboard = useCallback(async (page = 1, resetData = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: 10,
        ...filters
      };
      
      const result = await getLeaderboard(params);
      
      if (resetData) {
        setData(result);
      } else {
        setData(prev => ({
          ...result,
          leaderboard: result.leaderboard || []
        }));
      }
      
      setPagination({
        currentPage: result.pagination?.page || page,
        totalPages: Math.ceil((result.pagination?.total || 0) / (result.pagination?.limit || 10)),
        hasNext: result.pagination?.hasNext || false,
        hasPrev: page > 1
      });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setError(error.message || "Failed to load leaderboard data.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    fetchLeaderboard(1, true);
  }, [fetchLeaderboard]);

  // Handle page changes
  const handlePageChange = useCallback((page) => {
    fetchLeaderboard(page, false);
  }, [fetchLeaderboard]);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeaderboard(1, true);
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [filters, fetchLeaderboard]);

  // Memoize leaderboard data
  const leaderboardData = useMemo(() => {
    return data?.leaderboard || [];
  }, [data]);

  // Loading state
  if (loading && !data) {
    return <LeaderboardSkeleton />;
  }

  // Error state
  if (error && !data) {
    return (
      <div className="flex flex-col w-full min-h-screen items-center justify-center text-white pt-[calc(var(--nav-height)+4rem)] pb-20">
        <div className="text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-destructive/50" />
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => fetchLeaderboard(1, true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full min-h-screen items-center text-white pt-[calc(var(--nav-height)+4rem)] pb-20">
        {/* Header */}
        <div className="mb-8 text-center px-4">
          <Badge variant="default" className="text-xl md:text-2xl px-6 py-2 shadow-lg mb-4">
            <Trophy className="w-6 h-6 mr-2" />
            Top Ranking Players
          </Badge>
          <p className="text-primary/60 text-sm uppercase tracking-[0.2em] antialiased">
            Global Hall of Fame
          </p>
          {data?.pagination?.total > 0 && (
            <p className="text-muted-foreground text-sm mt-2">
              {data.pagination.total.toLocaleString()} total players
            </p>
          )}
        </div>

        {/* Filters */}
        <LeaderboardFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          loading={loading}
        />

        {/* Results Summary */}
        {leaderboardData.length > 0 && (
          <div className="w-full max-w-2xl px-4 mb-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Showing {((pagination.currentPage - 1) * 10) + 1}-{Math.min(pagination.currentPage * 10, data.pagination?.total || 0)} of {data.pagination?.total || 0} players
              </span>
              {filters.search && (
                <span>Filtered results</span>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <ul className="flex flex-col gap-4 w-full max-w-2xl px-4 pb-8">
          {leaderboardData.length > 0 ? (
            leaderboardData.map((player, index) => (
              <li key={`${player.playerId || index}-${index}`} className="w-full">
                <PlayerStats
                  player={player}
                  rank={(pagination.currentPage - 1) * 10 + index}
                  showDetailedStats={true}
                />
              </li>
            ))
          ) : (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                {filters.search ? 'No players found' : 'No champions found yet'}
              </h3>
              <p className="text-muted-foreground/60">
                {filters.search 
                  ? 'Try adjusting your search terms' 
                  : 'Be the first to claim the top spot!'
                }
              </p>
            </div>
          )}
        </ul>

        {/* Loading overlay for pagination */}
        {loading && data && (
          <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNext={pagination.hasNext}
            hasPrev={pagination.hasPrev}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </div>
    </>
  );
};

export default Leaderboard;
