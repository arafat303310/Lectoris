import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UniversityCard from "@/components/university-card";
import ScholarshipCard from "@/components/scholarship-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookMarked, 
  Trophy, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Heart
} from "lucide-react";
import { University, Scholarship, ServiceRequest } from "@shared/schema";
import { format } from "date-fns";

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: savedUniversities = [], isLoading: loadingSavedUniversities } = useQuery<University[]>({
    queryKey: ["/api/saved-universities"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: savedScholarships = [], isLoading: loadingSavedScholarships } = useQuery<Scholarship[]>({
    queryKey: ["/api/saved-scholarships"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: serviceRequests = [], isLoading: loadingServiceRequests } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/service-requests"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="dashboard-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in_progress":
        return Clock;
      case "pending":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="dashboard-page">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2" data-testid="dashboard-title">
            Welcome back{user?.firstName && `, ${user.firstName}`}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your applications, saved items, and educational progress.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="quick-stats">
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="saved-universities-count">
                {savedUniversities.length}
              </div>
              <div className="text-sm text-muted-foreground">Saved Universities</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="saved-scholarships-count">
                {savedScholarships.length}
              </div>
              <div className="text-sm text-muted-foreground">Saved Scholarships</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="service-requests-count">
                {serviceRequests.length}
              </div>
              <div className="text-sm text-muted-foreground">Service Requests</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="completed-requests-count">
                {serviceRequests.filter(r => r.status === "completed").length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="saved" className="space-y-6" data-testid="dashboard-tabs">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="saved" data-testid="saved-tab">Saved Items</TabsTrigger>
            <TabsTrigger value="requests" data-testid="requests-tab">Service Requests</TabsTrigger>
            <TabsTrigger value="profile" data-testid="profile-tab">Profile</TabsTrigger>
          </TabsList>
          
          {/* Saved Items Tab */}
          <TabsContent value="saved" className="space-y-6">
            {/* Saved Universities */}
            <Card data-testid="saved-universities-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5" />
                  Saved Universities ({savedUniversities.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSavedUniversities ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : savedUniversities.length === 0 ? (
                  <div className="text-center py-12">
                    <BookMarked className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Saved Universities</h3>
                    <p className="text-muted-foreground mb-4">Start exploring universities and save your favorites.</p>
                    <Button asChild data-testid="browse-universities-button">
                      <a href="/universities">Browse Universities</a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="saved-universities-grid">
                    {savedUniversities.map((university) => (
                      <UniversityCard key={university.id} university={university} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Scholarships */}
            <Card data-testid="saved-scholarships-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Saved Scholarships ({savedScholarships.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSavedScholarships ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    ))}
                  </div>
                ) : savedScholarships.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Saved Scholarships</h3>
                    <p className="text-muted-foreground mb-4">Discover funding opportunities for your education.</p>
                    <Button asChild data-testid="browse-scholarships-button">
                      <a href="/scholarships">Browse Scholarships</a>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="saved-scholarships-grid">
                    {savedScholarships.map((scholarship) => (
                      <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Service Requests Tab */}
          <TabsContent value="requests">
            <Card data-testid="service-requests-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Service Requests ({serviceRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingServiceRequests ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                        </div>
                        <Skeleton className="h-16 w-full mb-4" />
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-6 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : serviceRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Service Requests</h3>
                    <p className="text-muted-foreground mb-4">Request professional assistance for your educational goals.</p>
                    <Button asChild data-testid="browse-services-button">
                      <a href="/services">Browse Services</a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="service-requests-list">
                    {serviceRequests.map((request) => {
                      const StatusIcon = getStatusIcon(request.status || "pending");
                      return (
                        <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`service-request-${request.id}`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1" data-testid={`request-service-name-${request.id}`}>
                                Service Request #{(request.id || "").slice(-8)}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-2" data-testid={`request-date-${request.id}`}>
                                <Calendar className="h-4 w-4" />
                                {request.createdAt ? format(new Date(request.createdAt), "MMMM d, yyyy") : "N/A"}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getStatusColor(request.status || "pending")} data-testid={`request-status-${request.id}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {(request.status || "pending").replace("_", " ")}
                              </Badge>
                              <Badge className={getPaymentStatusColor(request.paymentStatus || "pending")} data-testid={`request-payment-status-${request.id}`}>
                                <DollarSign className="h-3 w-3 mr-1" />
                                {request.paymentStatus || "pending"}
                              </Badge>
                            </div>
                          </div>
                          
                          {request.notes && (
                            <p className="text-sm text-muted-foreground mb-4" data-testid={`request-notes-${request.id}`}>
                              {request.notes}
                            </p>
                          )}
                          
                          {request.adminNotes && (
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <h4 className="font-medium text-foreground mb-1">Admin Notes:</h4>
                              <p className="text-sm text-muted-foreground" data-testid={`request-admin-notes-${request.id}`}>
                                {request.adminNotes}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-sm text-muted-foreground">
                              Payment: {request.paymentMethod?.replace("_", " ") || "Not specified"}
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              Last updated: {request.updatedAt ? format(new Date(request.updatedAt), "MMM d, yyyy") : "N/A"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card data-testid="profile-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full object-cover"
                      data-testid="profile-image"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-primary" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-foreground" data-testid="profile-name">
                      {user?.firstName || user?.lastName 
                        ? `${user?.firstName || ""} ${user?.lastName || ""}`.trim()
                        : "User"
                      }
                    </h3>
                    <p className="text-muted-foreground" data-testid="profile-email">
                      {user?.email || "No email provided"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Account Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saved Universities:</span>
                        <span className="font-medium">{savedUniversities.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Saved Scholarships:</span>
                        <span className="font-medium">{savedScholarships.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service Requests:</span>
                        <span className="font-medium">{serviceRequests.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member Since:</span>
                        <span className="font-medium">
                          {user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "Recently"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" asChild data-testid="update-profile-button">
                        <a href="/profile/edit">Update Profile</a>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" data-testid="logout-button" onClick={() => window.location.href = "/api/logout"}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}
