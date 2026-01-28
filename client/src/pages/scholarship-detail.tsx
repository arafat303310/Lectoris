import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SEO, { generateScholarshipSchema, generateBreadcrumbSchema } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  DollarSign, 
  ExternalLink, 
  Heart, 
  GraduationCap,
  CheckCircle,
  Clock,
  Users,
  Award,
  FileText
} from "lucide-react";
import { Scholarship } from "@shared/schema";
import { format } from "date-fns";

export default function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: scholarship, isLoading } = useQuery<Scholarship>({
    queryKey: ["/api/scholarships", id],
    enabled: !!id,
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

  const isSaved = scholarship ? savedScholarships.some(s => s.id === scholarship.id) : false;

  const handleSaveScholarship = () => {
    if (!scholarship) return;
    
    if (isSaved) {
      unsaveScholarshipMutation.mutate(scholarship.id);
    } else {
      saveScholarshipMutation.mutate(scholarship.id);
    }
  };

  const isDeadlinePassed = scholarship?.deadline ? new Date(scholarship.deadline) < new Date() : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" data-testid="scholarship-detail-loading">
        <Navbar />
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="max-w-4xl mx-auto">
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

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-background" data-testid="scholarship-not-found">
        <Navbar />
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <Card className="text-center py-12 max-w-2xl mx-auto">
            <CardContent>
              <h1 className="text-2xl font-bold text-foreground mb-4">Scholarship Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The scholarship you're looking for doesn't exist or has been removed.
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

  const scholarshipSchema = generateScholarshipSchema({
    title: scholarship.title,
    description: scholarship.description || `${scholarship.title} scholarship for Ugandan students.`,
    provider: scholarship.provider,
    amount: scholarship.amount || undefined,
    currency: scholarship.currency || "UGX",
    deadline: scholarship.deadline,
    eligibility: scholarship.eligibility || "Ugandan students"
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Scholarships", url: "/scholarships" },
    { name: scholarship.title, url: `/scholarships/${scholarship.id}` }
  ]);

  return (
    <div className="min-h-screen bg-background" data-testid="scholarship-detail-page">
      <SEO 
        title={`${scholarship.title} - Scholarship for Ugandan Students`}
        description={scholarship.description?.substring(0, 160) || `Apply for ${scholarship.title} by ${scholarship.provider}. ${scholarship.type} scholarship opportunity for Ugandan students.`}
        canonical={`/scholarships/${scholarship.id}`}
        keywords={`${scholarship.title}, ${scholarship.provider} scholarship, scholarships Uganda, ${scholarship.type} scholarship`}
        structuredData={{ "@graph": [scholarshipSchema, breadcrumbSchema] }}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8 overflow-hidden" data-testid="scholarship-hero">
            <div className="h-4 bg-gradient-to-r from-accent to-primary" />
            
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    {scholarship.logoUrl && (
                      <img 
                        src={scholarship.logoUrl} 
                        alt={`${scholarship.provider} logo`}
                        className="w-16 h-16 object-contain rounded"
                        data-testid="scholarship-logo"
                      />
                    )}
                    <div>
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2" data-testid="scholarship-title">
                        {scholarship.title}
                      </h1>
                      <p className="text-muted-foreground" data-testid="scholarship-provider">
                        by {scholarship.provider}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={`${scholarship.type === "government" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`} data-testid="scholarship-type">
                      {scholarship.type.charAt(0).toUpperCase() + scholarship.type.slice(1)} Scholarship
                    </Badge>
                    {isDeadlinePassed ? (
                      <Badge className="bg-red-100 text-red-800">Deadline Passed</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-800">Applications Open</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  {isAuthenticated && (
                    <Button
                      variant={isSaved ? "default" : "outline"}
                      onClick={handleSaveScholarship}
                      className="flex items-center gap-2"
                      data-testid="save-scholarship-button"
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                      {isSaved ? "Saved" : "Save Scholarship"}
                    </Button>
                  )}
                  
                  {scholarship.applicationUrl && !isDeadlinePassed && (
                    <Button asChild className="bg-[#D4AF37] hover:bg-[#C9A432] text-[#0B1B32]" data-testid="apply-now-button">
                      <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                        Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {scholarship.description && (
                <Card data-testid="scholarship-description-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      About This Scholarship
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed" data-testid="scholarship-description">
                      {scholarship.description}
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {scholarship.eligibility && (
                <Card data-testid="scholarship-eligibility-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Eligibility Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed" data-testid="scholarship-eligibility">
                      {scholarship.eligibility}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card data-testid="application-steps-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    How to Apply
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                    <li>Review the eligibility requirements above</li>
                    <li>Prepare required documents (transcripts, recommendation letters, essays)</li>
                    <li>Create an account on the scholarship portal</li>
                    <li>Complete the online application form</li>
                    <li>Submit before the deadline: {format(new Date(scholarship.deadline), "MMMM d, yyyy")}</li>
                  </ol>
                  
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium text-foreground mb-2">Need help with your application?</p>
                    <Link href="/services">
                      <Button variant="outline" size="sm">
                        Get Application Assistance
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card data-testid="scholarship-key-info">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Key Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Award Amount
                    </h4>
                    <p className="text-muted-foreground" data-testid="scholarship-amount">
                      {scholarship.amount ? `${scholarship.currency || 'UGX'} ${parseFloat(scholarship.amount).toLocaleString()}` : "Varies by program"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Application Deadline
                    </h4>
                    <p className={`${isDeadlinePassed ? "text-red-600" : "text-muted-foreground"}`} data-testid="scholarship-deadline">
                      {format(new Date(scholarship.deadline), "MMMM d, yyyy")}
                      {isDeadlinePassed && " (Passed)"}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Provider
                    </h4>
                    <p className="text-muted-foreground" data-testid="scholarship-provider-info">
                      {scholarship.provider}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-1 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Scholarship Type
                    </h4>
                    <p className="text-muted-foreground capitalize" data-testid="scholarship-type-info">
                      {scholarship.type} Scholarship
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="scholarship-related-links">
                <CardHeader>
                  <CardTitle>Related Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/universities">
                    <Button variant="outline" className="w-full justify-start">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Browse Universities
                    </Button>
                  </Link>
                  <Link href="/scholarships">
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="mr-2 h-4 w-4" />
                      More Scholarships
                    </Button>
                  </Link>
                  <Link href="/services">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Application Services
                    </Button>
                  </Link>
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
