"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { searchSubreddits, SubredditInfo } from "@/lib/reddit/getSearchSubs";
import { addSub } from "@/lib/supabase/addSub";

export function SubredditSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SubredditInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubreddit, setSelectedSubreddit] =
    useState<SubredditInfo | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.trim().length > 2) {
      setIsLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(value);
      }, 500);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const performSearch = async (term: string) => {
    try {
      const subreddits = await searchSubreddits(term);
      setResults(subreddits);
      setShowResults(true);
    } catch (error) {
      console.error("Error searching subreddits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length > 2) {
      setIsLoading(true);
      performSearch(searchTerm);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
    setShowResults(false);
    setSelectedSubreddit(null);
  };

  const handleSelectSubreddit = (subreddit: SubredditInfo) => {
    setSelectedSubreddit(subreddit);
    setShowDialog(true);
  };

  const confirmSelection = async () => {
    if (selectedSubreddit) {
      await addSub(selectedSubreddit);
      setShowDialog(false);
      clearSearch();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search subreddits to add..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-10 w-full"
            aria-label="Search subreddits to add..."
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </form>

      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg max-h-60 overflow-y-auto"
        >
          <ul className="py-1">
            {results.map((subreddit) => (
              <li key={subreddit.id}>
                <button
                  type="button"
                  className="flex w-full items-center px-4 py-2 text-left hover:bg-muted"
                  onClick={() => handleSelectSubreddit(subreddit)}
                >
                  {subreddit.icon ? (
                    <Image
                      src={subreddit.icon.split("?")[0]}
                      alt={`r/${subreddit.name} icon`}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full mr-2"
                      unoptimized
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-muted mr-2 flex items-center justify-center">
                      r/
                    </div>
                  )}
                  <span>r/{subreddit.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showResults && results.length === 0 && !isLoading && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-background p-4 shadow-lg text-center">
          No subreddits found
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-sm sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Confirm Subreddit Follow</DialogTitle>
            <DialogDescription>
              Are you sure you want to follow r/{selectedSubreddit?.name}?
            </DialogDescription>
          </DialogHeader>

          {selectedSubreddit && (
            <div className="flex items-center gap-4 py-4">
              {selectedSubreddit.icon ? (
                <Image
                  src={selectedSubreddit.icon.split("?")[0]}
                  alt={`r/${selectedSubreddit.name} icon`}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                  unoptimized
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  r/
                </div>
              )}
              <div>
                <h4 className="font-medium">r/{selectedSubreddit.name}</h4>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSelection}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
