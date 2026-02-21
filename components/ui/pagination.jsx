"use client";
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  hasNext, 
  hasPrev, 
  onPageChange, 
  loading = false,
  showPageNumbers = true,
  maxVisiblePages = 5
}) => {
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && !loading) {
      onPageChange(page);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    const adjustedStart = Math.max(1, end - maxVisiblePages + 1);
    
    for (let i = adjustedStart; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!hasPrev || loading}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      {/* Page Numbers */}
      {showPageNumbers && totalPages > 0 && (
        <div className="flex items-center gap-1">
          {/* First page */}
          {currentPage > Math.floor(maxVisiblePages / 2) + 1 && (
            <>
              <Button
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={loading}
                className="w-8 h-8"
              >
                1
              </Button>
              {currentPage > Math.floor(maxVisiblePages / 2) + 2 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
            </>
          )}

          {/* Visible page numbers */}
          {generatePageNumbers().map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
              disabled={loading}
              className="w-8 h-8"
            >
              {page}
            </Button>
          ))}

          {/* Last page */}
          {currentPage < totalPages - Math.floor(maxVisiblePages / 2) && (
            <>
              {currentPage < totalPages - Math.floor(maxVisiblePages / 2) - 1 && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
              <Button
                variant={currentPage === totalPages ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={loading}
                className="w-8 h-8"
              >
                {totalPages}
              </Button>
            </>
          )}
        </div>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!hasNext || loading}
        className="flex items-center gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default Pagination;
