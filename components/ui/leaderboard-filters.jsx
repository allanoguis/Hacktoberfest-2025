"use client";
import React, { useState } from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';

const LeaderboardFilters = ({ 
  filters = {}, 
  onFiltersChange, 
  loading = false 
}) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const timeFilterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFiltersChange({ ...filters, search: searchInput.trim() });
  };

  const handleSearchClear = () => {
    setSearchInput('');
    onFiltersChange({ ...filters, search: '' });
  };

  const handleTimeFilterChange = (timeFilter) => {
    onFiltersChange({ ...filters, timeFilter });
  };

  const handleClearAll = () => {
    setSearchInput('');
    onFiltersChange({ search: '', timeFilter: 'all' });
  };

  const hasActiveFilters = filters.search || filters.timeFilter !== 'all';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary w-4 h-4" />
          <input
            type="text"
            placeholder="Search players by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-background/50 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder:text-tertiary"
            disabled={loading}
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleSearchClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
              disabled={loading}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                {Object.values(filters).filter(Boolean).length}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-tertiary hover:text-foreground transition-colors"
              disabled={loading}
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: &quot;{filters.search}&quot;
                <button
                  onClick={() => {
                    setSearchInput('');
                    onFiltersChange({ ...filters, search: '' });
                  }}
                  className="ml-1 hover:text-destructive"
                  disabled={loading}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.timeFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {timeFilterOptions.find(opt => opt.value === filters.timeFilter)?.label}
                <button
                  onClick={() => onFiltersChange({ ...filters, timeFilter: 'all' })}
                  className="ml-1 hover:text-destructive"
                  disabled={loading}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-background/30 border border-primary/20 rounded-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-tertiary">
                Time Period
              </label>
              <div className="flex flex-wrap gap-2">
                {timeFilterOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filters.timeFilter === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTimeFilterChange(option.value)}
                    disabled={loading}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardFilters;
