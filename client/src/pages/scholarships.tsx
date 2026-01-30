import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEO from "@/components/seo";
import ScholarshipCard from "@/components/scholarship-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Loader2, GraduationCap, Award } from "lucide-react";
import { Scholarship } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

export default function Scholarships() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
  });

  const { data: scholarships = [], isLoading } = useQuery<Scholarship[]>({
    queryKey: ["/api/scholarships", appliedFilters.search],
    retry: false,
  });

  const { data: suggestions = [], isLoading: isLoadingSuggestions } = useQuery<any[]>({
    queryKey: ["/api/search/autocomplete", searchQuery],
    queryFn: async () => {
      if (searchQuery.length < 1) return [];
      const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: searchQuery.length >= 1,
  });

  const { data: savedScholarships = [] } = useQuery<Scholarship[]>({
    queryKey: ["/api/saved-scholarships"],
    enabled: isAuthenticated,
    retry: false,
  });

  const handleApplyFilters = (query?: string) => {
    setAppliedFilters({
      search: (query ?? searchQuery).trim(),
    });
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.name);
    handleApplyFilters(suggestion.name);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  async function handleSaveScholarship(scholarshipId: string) {
    const isSaved = savedScholarships.some(s => s.id === scholarshipId);
    try {
      if (isSaved) {
        await apiRequest("DELETE", `/api/saved-scholarships/${scholarshipId}`);
        toast({ title: "Scholarship Removed", description: "Scholarship has been removed from your saved list." });
      } else {
        await apiRequest("POST", "/api/saved-scholarships", { scholarshipId });
        toast({ title: "Scholarship Saved", description: "Scholarship has been added to your saved list." });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/saved-scholarships"] });
    } catch (error: any) {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out. Logging in again...", variant: "destructive" });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Error", description: error.message || "Action failed", variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-background" data-testid="scholarships-page">
      <SEO 
        title="Scholarships for Ugandan Students | Local & International"
        description="Find scholarships for Ugandan students. Government scholarships, Mastercard Foundation, DAAD, and 20+ funding opportunities for higher education."
        canonical="/scholarships"
        keywords="scholarships Uganda, Mastercard Foundation Scholars, DAAD scholarship, government scholarships Uganda, study abroad scholarships"
      />
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 gradient-text" data-testid="scholarships-title">
            Scholarships for Ugandan Students
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
            Discover funding opportunities for Ugandan students, from government scholarships to international programs.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 animate-scale-in delay-300 overflow-visible" data-testid="filters-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Scholarships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4 relative">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(e.target.value.length >= 1);
                  }}
                  onFocus={() => searchQuery.length >= 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  data-testid="search-scholarships-input"
                />
                {isLoadingSuggestions && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}

                {/* Autocomplete suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <Card className="absolute z-50 w-full mt-1 py-2 shadow-lg max-h-[300px] overflow-y-auto left-0 top-full">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.type}-${suggestion.id}`}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-3 py-2 text-left hover:bg-muted flex items-center gap-3 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {suggestion.type === "university" ? (
                            <GraduationCap className="h-4 w-4 text-primary" />
                          ) : (
                            <Award className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {suggestion.name.split(new RegExp(`(${searchQuery})`, 'gi')).map((part: string, i: number) => 
                              part.toLowerCase() === searchQuery.toLowerCase() ? 
                                <span key={i} className="text-primary font-bold">{part}</span> : part
                            )}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px] uppercase">{suggestion.type}</Badge>
                      </button>
                    ))}
                  </Card>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => handleApplyFilters()} data-testid="apply-filters-button">
                  Search
                </Button>
                {appliedFilters.search && (
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setAppliedFilters({ search: "" });
                  }} data-testid="clear-filters-button">
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="loading-skeleton">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-4 bg-gradient-to-r from-accent to-primary" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-8 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : scholarships.length === 0 ? (
          <Card className="text-center py-12" data-testid="no-scholarships-found">
            <CardContent>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Scholarships Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters to find more results.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setAppliedFilters({ search: "" });
              }} data-testid="clear-filters-no-results">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground" data-testid="results-count">
                {scholarships.length} Scholarships Found
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="scholarships-grid">
              {scholarships.map((scholarship, index) => (
                <div key={scholarship.id} className="animate-fade-in-up" style={{ animationDelay: `${(index % 6) * 100}ms` }}>
                  <ScholarshipCard
                    scholarship={scholarship}
                    onSave={isAuthenticated ? (id) => handleSaveScholarship(id) : undefined}
                    isSaved={savedScholarships.some(s => s.id === scholarship.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
