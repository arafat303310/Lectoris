import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEO, { generateUniversitySchema, generateBreadcrumbSchema } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Globe, 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  Heart, 
  University as UniversityIcon,
  BookOpen,
  Users,
  Award
} from "lucide-react";
import { University } from "@shared/schema";
import { format } from "date-fns";

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: university, isLoading } = useQuery<University>({
    queryKey: ["/api/universities", id],
    enabled: !!id,
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

  const isSaved = university ? savedUniversities.some(u => u.id === university.id) : false;

  const handleSaveUniversity = () => {
    if (!university) return;
    
    if (isSaved) {
      unsaveUniversityMutation.mutate(university.id);
    } else {
      saveUniversityMutation.mutate(university.id);
    }
  };

  const formatTuition = () => {
    if (!university) return "";
    if (university.tuitionMin && university.tuitionMax) {
      return `UGX ${parseFloat(university.tuitionMin).toLocaleString()} - ${parseFloat(university.tuitionMax).toLocaleString()}`;
    }
    return "Contact for fees";
  };

  const getTypeColor = () => {
    if (!university) return "";
    return university.type === "public" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary";
  };

  const getStatusColor = () => {
    if (!university) return "";
    return university.status === "chartered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="university-detail-loading">
        <Navbar />
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-64 w-full mb-8" />
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-background" data-testid="university-not-found">
        <Navbar />
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <Card className="text-center py-12 max-w-2xl mx-auto">
            <CardContent>
              <h1 className="text-2xl font-bold text-foreground mb-4">University Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The university you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const universitySchema = generateUniversitySchema({
    name: university.name,
    description: university.description || `${university.name} is a ${university.type} university in ${university.location}, Uganda.`,
    location: university.location,
    websiteUrl: university.websiteUrl || undefined,
    logoUrl: university.logoUrl || undefined
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Universities", url: "/universities" },
    { name: university.name, url: `/universities/${university.id}` }
  ]);

  return (
    <div className="min-h-screen bg-background" data-testid="university-detail-page">
      <SEO 
        title={`${university.name} - Application Guide`}
        description={university.description?.substring(0, 160) || `Apply to ${university.name} in ${university.location}. Find courses, tuition fees, and application requirements for this ${university.type} university.`}
        canonical={`/universities/${university.id}`}
        keywords={`${university.name}, ${university.location} university, apply ${university.name}, ${university.type} university Uganda`}
        structuredData={{ "@graph": [universitySchema, breadcrumbSchema] }}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <Card className="mb-8" data-testid="university-hero">
            <div className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              {university.logoUrl ? (
                <img 
                  src={university.logoUrl} 
                  alt={`${university.name} logo`}
                  className="w-32 h-32 object-contain"
                  data-testid="university-logo"
                />
              ) : (
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center">
                  <UniversityIcon className="text-4xl text-primary-foreground" />
                </div>
              )}
            </div>
            
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="university-name">
                    {university.name}
                  </h1>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={getTypeColor()} data-testid="university-type">
                      {university.type}
                    </Badge>
                    <Badge className={getStatusColor()} data-testid="university-status">
                      {university.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span data-testid="university-location">{university.location}</span>
                  </div>
                  
                  {university.established && (
                    <div className="flex items-center text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span data-testid="university-established">Established {university.established}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-3">
                  {isAuthenticated && (
                    <Button
                      variant={isSaved ? "default" : "outline"}
                      onClick={handleSaveUniversity}
                      className="flex items-center gap-2"
                      data-testid="save-university-button"
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                      {isSaved ? "Saved" : "Save University"}
                    </Button>
                  )}
                  
                  {university.websiteUrl && (
                    <Button asChild className="bg-[#D4AF37] hover:bg-[#C9A432] text-[#0B1B32]" data-testid="visit-website-button">
                      <a href={university.websiteUrl} target="_blank" rel="noopener noreferrer">
                        Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {university.description && (
                <Card data-testid="university-description-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      About the University
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed" data-testid="university-description">
                      {university.description}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* Specialties */}
              {university.specialties && university.specialties.length > 0 && (
                <Card data-testid="university-specialties-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Areas of Specialization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {university.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" data-testid={`specialty-${index}`}>
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Key Information */}
              <Card data-testid="university-key-info">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Key Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Tuition Fees</h4>
                    <p className="text-muted-foreground" data-testid="university-tuition">
                      {formatTuition()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">University Type</h4>
                    <p className="text-muted-foreground capitalize" data-testid="university-type-info">
                      {university.type} University
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Accreditation Status</h4>
                    <p className="text-muted-foreground capitalize" data-testid="university-status-info">
                      {university.status}
                    </p>
                  </div>
                  
                  {university.applicationDeadline && (
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Application Deadline</h4>
                      <p className="text-muted-foreground" data-testid="university-deadline">
                        {format(new Date(university.applicationDeadline), "MMMM d, yyyy")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card data-testid="university-quick-actions">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" data-testid="request-application-help">
                    Request Application Help
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="get-expert-guidance">
                    Get Expert Guidance
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="find-scholarships">
                    Find Relevant Scholarships
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
