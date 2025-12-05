import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ScholarshipCard from "@/components/scholarship-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";
import { Scholarship } from "@shared/schema";

export default function Scholarships() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
  });

  const { data: scholarships = [], isLoading } = useQuery<Scholarship[]>({
    queryKey: ["/api/scholarships", appliedFilters.search],
    retry: false,
  });

  const { data: savedScholarships = [] } = useQuery<Scholarship[]>({
    queryKey: ["/api/saved-scholarships"],
    enabled: isAuthenticated,
    retry: false,
  });

  const saveScholarshipMutation = useMutation({
    mutationFn: async (scholarshipId: string) => {
      return await apiRequest("POST", "/api/saved-scholarships", { scholarshipId });
    },
    onSuccess: () => {
      toast({
        title: "Scholarship Saved",
        description: "Scholarship has been added to your saved list.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-scholarships"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to save scholarship",
        variant: "destructive",
      });
    },
  });

  const unsaveScholarshipMutation = useMutation({
    mutationFn: async (scholarshipId: string) => {
      return await apiRequest("DELETE", `/api/saved-scholarships/${scholarshipId}`);
    },
    onSuccess: () => {
      toast({
        title: "Scholarship Removed",
        description: "Scholarship has been removed from your saved list.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-scholarships"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to remove scholarship",
        variant: "destructive",
      });
    },
  });

  const handleSaveScholarship = (scholarshipId: string) => {
    const isSaved = savedScholarships.some(s => s.id === scholarshipId);
    if (isSaved) {
      unsaveScholarshipMutation.mutate(scholarshipId);
    } else {
      saveScholarshipMutation.mutate(scholarshipId);
    }
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchQuery.trim(),
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setAppliedFilters({
      search: "",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  const isFiltered = appliedFilters.search;

  return (
    <div className="min-h-screen bg-background" data-testid="scholarships-page">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 gradient-text" data-testid="scholarships-title">
            Scholarship Opportunities
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up delay-200">
            Discover funding opportunities for Ugandan students, from government scholarships to international programs.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 animate-scale-in delay-300" data-testid="filters-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Scholarships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search scholarships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  data-testid="search-scholarships-input"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleApplyFilters} data-testid="apply-filters-button">
                  Search
                </Button>
                {isFiltered && (
                  <Button variant="outline" onClick={handleClearFilters} data-testid="clear-filters-button">
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
              <Button onClick={handleClearFilters} data-testid="clear-filters-no-results">
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
                    onSave={isAuthenticated ? handleSaveScholarship : undefined}
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
