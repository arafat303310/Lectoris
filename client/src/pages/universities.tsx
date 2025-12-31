import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEO from "@/components/seo";
import UniversityCard from "@/components/university-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter } from "lucide-react";
import { University } from "@shared/schema";

export default function Universities() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
  });

  const { data: universities = [], isLoading } = useQuery<University[]>({
    queryKey: ["/api/universities", appliedFilters.search],
    retry: false,
  });

  const { data: savedUniversities = [] } = useQuery<University[]>({
    queryKey: ["/api/saved-universities"],
    enabled: isAuthenticated,
    retry: false,
  });

  const saveUniversityMutation = useMutation({
    mutationFn: async (universityId: string) => {
      return await apiRequest("POST", "/api/saved-universities", { universityId });
    },
    onSuccess: () => {
      toast({
        title: "University Saved",
        description: "University has been added to your saved list.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-universities"] });
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
        description: error.message || "Failed to save university",
        variant: "destructive",
      });
    },
  });

  const unsaveUniversityMutation = useMutation({
    mutationFn: async (universityId: string) => {
      return await apiRequest("DELETE", `/api/saved-universities/${universityId}`);
    },
    onSuccess: () => {
      toast({
        title: "University Removed",
        description: "University has been removed from your saved list.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/saved-universities"] });
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
        description: error.message || "Failed to remove university",
        variant: "destructive",
      });
    },
  });

  const handleSaveUniversity = (universityId: string) => {
    const isSaved = savedUniversities.some(u => u.id === universityId);
    if (isSaved) {
      unsaveUniversityMutation.mutate(universityId);
    } else {
      saveUniversityMutation.mutate(universityId);
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
    <div className="min-h-screen bg-background" data-testid="universities-page">
      <SEO 
        title="Universities in Uganda | Public & Private Institutions"
        description="Explore 46+ public and private universities in Uganda. Find Makerere, Kyambogo, UCU, and more with application guides, courses, and tuition information."
        canonical="/universities"
        keywords="universities in Uganda, Makerere University, Kyambogo University, UCU, private universities Uganda, public universities Uganda"
      />
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in-down">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4 gradient-text" data-testid="universities-title">
            Universities in Uganda
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2 animate-fade-in-up delay-200">
            Explore 46+ universities across Uganda. Find the perfect institution for your academic journey.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6 sm:mb-8 animate-scale-in delay-300" data-testid="filters-card">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="flex gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 text-sm"
                  data-testid="search-universities-input"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleApplyFilters} className="text-sm" data-testid="apply-filters-button">
                  Search
                </Button>
                {isFiltered && (
                  <Button variant="outline" onClick={handleClearFilters} className="text-sm" data-testid="clear-filters-button">
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" data-testid="loading-skeleton">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-36 sm:h-48 w-full" />
                <CardContent className="p-4 sm:p-6">
                  <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-1/2 mb-3 sm:mb-4" />
                  <Skeleton className="h-12 sm:h-16 w-full mb-3 sm:mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : universities.length === 0 ? (
          <Card className="text-center py-8 sm:py-12" data-testid="no-universities-found">
            <CardContent>
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No Universities Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try adjusting your search criteria or filters.
              </p>
              <Button onClick={handleClearFilters} className="text-sm" data-testid="clear-filters-no-results">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-xl font-semibold text-foreground" data-testid="results-count">
                {universities.length} Universities Found
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8" data-testid="universities-grid">
              {universities.map((university, index) => (
                <div key={university.id} className={`animate-fade-in-up`} style={{ animationDelay: `${(index % 6) * 100}ms` }}>
                  <UniversityCard
                    university={university}
                    onSave={isAuthenticated ? handleSaveUniversity : undefined}
                    isSaved={savedUniversities.some(u => u.id === university.id)}
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
