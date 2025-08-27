import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
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
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    type: "",
    location: "",
  });

  const { data: universities = [], isLoading } = useQuery<University[]>({
    queryKey: ["/api/universities", appliedFilters.search, appliedFilters.type, appliedFilters.location],
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
      type: typeFilter,
      location: locationFilter,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setTypeFilter("");
    setLocationFilter("");
    setAppliedFilters({
      search: "",
      type: "",
      location: "",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  const isFiltered = appliedFilters.search || appliedFilters.type || appliedFilters.location;

  return (
    <div className="min-h-screen bg-background" data-testid="universities-page">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="universities-title">
            Uganda Universities Directory
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore 46+ universities across Uganda. Find the perfect institution for your academic journey.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8" data-testid="filters-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Universities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  data-testid="search-universities-input"
                />
              </div>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger data-testid="type-filter-select">
                  <SelectValue placeholder="University Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public" data-testid="type-public">Public</SelectItem>
                  <SelectItem value="private" data-testid="type-private">Private</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger data-testid="location-filter-select">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kampala" data-testid="location-kampala">Kampala</SelectItem>
                  <SelectItem value="Mbarara" data-testid="location-mbarara">Mbarara</SelectItem>
                  <SelectItem value="Gulu" data-testid="location-gulu">Gulu</SelectItem>
                  <SelectItem value="Mukono" data-testid="location-mukono">Mukono</SelectItem>
                  <SelectItem value="Mbale" data-testid="location-mbale">Mbale</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button onClick={handleApplyFilters} className="flex-1" data-testid="apply-filters-button">
                  Apply Filters
                </Button>
                {isFiltered && (
                  <Button variant="outline" onClick={handleClearFilters} data-testid="clear-filters-button">
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            {isFiltered && (
              <div className="text-sm text-muted-foreground">
                Showing results for: {appliedFilters.search && `"${appliedFilters.search}"`} 
                {appliedFilters.type && ` • ${appliedFilters.type} universities`}
                {appliedFilters.location && ` • ${appliedFilters.location}`}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="loading-skeleton">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : universities.length === 0 ? (
          <Card className="text-center py-12" data-testid="no-universities-found">
            <CardContent>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Universities Found</h3>
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
                {universities.length} Universities Found
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="universities-grid">
              {universities.map((university) => (
                <UniversityCard
                  key={university.id}
                  university={university}
                  onSave={isAuthenticated ? handleSaveUniversity : undefined}
                  isSaved={savedUniversities.some(u => u.id === university.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
