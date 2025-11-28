import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, GraduationCap, Award, Loader2 } from "lucide-react";

interface Suggestion {
  type: "university" | "scholarship";
  id: string;
  name: string;
  location?: string;
  provider?: string;
}

interface SearchAutocompleteProps {
  className?: string;
  placeholder?: string;
  onSelect?: (suggestion: Suggestion) => void;
}

export default function SearchAutocomplete({
  className = "",
  placeholder = "Search universities, scholarships...",
  onSelect,
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [], isLoading } = useQuery<Suggestion[]>({
    queryKey: ["/api/search/autocomplete", query],
    queryFn: async () => {
      if (query.length < 2) return [];
      const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(query)}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: query.length >= 2,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (suggestion: Suggestion) => {
    setQuery("");
    setIsOpen(false);
    
    if (onSelect) {
      onSelect(suggestion);
    } else {
      if (suggestion.type === "university") {
        setLocation(`/universities/${suggestion.id}`);
      } else {
        setLocation(`/scholarships/${suggestion.id}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(e.target.value.length >= 2);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-9 pr-4"
          data-testid="search-autocomplete-input"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 py-2 shadow-lg max-h-[300px] overflow-y-auto" data-testid="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <button
              key={`${suggestion.type}-${suggestion.id}`}
              onClick={() => handleSelect(suggestion)}
              className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-3 transition-colors"
              data-testid={`suggestion-${index}`}
            >
              <div className="flex-shrink-0">
                {suggestion.type === "university" ? (
                  <GraduationCap className="h-5 w-5 text-primary" />
                ) : (
                  <Award className="h-5 w-5 text-amber-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-foreground">{suggestion.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {suggestion.location || suggestion.provider}
                </p>
              </div>
              <Badge variant={suggestion.type === "university" ? "default" : "secondary"} className="flex-shrink-0 text-xs">
                {suggestion.type}
              </Badge>
            </button>
          ))}
        </Card>
      )}

      {isOpen && query.length >= 2 && !isLoading && suggestions.length === 0 && (
        <Card className="absolute z-50 w-full mt-1 py-4 px-3 shadow-lg text-center">
          <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
        </Card>
      )}
    </div>
  );
}
