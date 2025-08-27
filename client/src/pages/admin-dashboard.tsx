import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Users, 
  University as UniversityIcon, 
  Trophy, 
  FileText, 
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  DollarSign,
  Calendar
} from "lucide-react";
import { ServiceRequest, University, Scholarship } from "@shared/schema";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  // Redirect if not authenticated or not admin
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
    
    if (!isLoading && isAuthenticated && !user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: serviceRequests = [], isLoading: loadingRequests } = useQuery<ServiceRequest[]>({
    queryKey: ["/api/service-requests"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const { data: universities = [] } = useQuery<University[]>({
    queryKey: ["/api/universities"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const { data: scholarships = [] } = useQuery<Scholarship[]>({
    queryKey: ["/api/scholarships"],
    enabled: isAuthenticated && user?.isAdmin,
    retry: false,
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServiceRequest> }) => {
      return await apiRequest("PUT", `/api/service-requests/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Request Updated",
        description: "Service request has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests"] });
      setSelectedRequest(null);
      setNewStatus("");
      setAdminNotes("");
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
        description: error.message || "Failed to update request",
        variant: "destructive",
      });
    },
  });

  const handleUpdateRequest = () => {
    if (!selectedRequest || !newStatus) return;
    
    updateRequestMutation.mutate({
      id: selectedRequest.id,
      data: {
        status: newStatus,
        adminNotes: adminNotes || selectedRequest.adminNotes,
      },
    });
  };

  const handleViewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setAdminNotes(request.adminNotes || "");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="admin-dashboard-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
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

  const pendingRequests = serviceRequests.filter(r => r.status === "pending");
  const inProgressRequests = serviceRequests.filter(r => r.status === "in_progress");
  const completedRequests = serviceRequests.filter(r => r.status === "completed");

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard-page">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2 flex items-center gap-3" data-testid="admin-dashboard-title">
            <Shield className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage service requests, universities, scholarships, and platform settings.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="admin-stats">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="total-requests-count">
                {serviceRequests.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="pending-requests-count">
                {pendingRequests.length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <UniversityIcon className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="universities-count">
                {universities.length}
              </div>
              <div className="text-sm text-muted-foreground">Universities</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground" data-testid="scholarships-count">
                {scholarships.length}
              </div>
              <div className="text-sm text-muted-foreground">Scholarships</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="space-y-6" data-testid="admin-tabs">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests" data-testid="requests-tab">Service Requests</TabsTrigger>
            <TabsTrigger value="content" data-testid="content-tab">Content Management</TabsTrigger>
            <TabsTrigger value="settings" data-testid="settings-tab">Settings</TabsTrigger>
          </TabsList>
          
          {/* Service Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card data-testid="service-requests-management">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Service Requests Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRequests ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                          </div>
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-16 w-full mb-4" />
                        <div className="flex justify-end">
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : serviceRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Service Requests</h3>
                    <p className="text-muted-foreground">No service requests have been submitted yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="service-requests-list">
                    {serviceRequests.map((request) => {
                      const StatusIcon = getStatusIcon(request.status);
                      return (
                        <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow" data-testid={`admin-request-${request.id}`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                Request #{request.id.slice(-8)}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {format(new Date(request.createdAt), "MMMM d, yyyy")}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                User ID: {request.userId.slice(-8)}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getStatusColor(request.status)} data-testid={`admin-request-status-${request.id}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {request.status.replace("_", " ")}
                              </Badge>
                              <Badge className={getPaymentStatusColor(request.paymentStatus)} data-testid={`admin-request-payment-${request.id}`}>
                                <DollarSign className="h-3 w-3 mr-1" />
                                {request.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                          
                          {request.notes && (
                            <div className="bg-muted/50 p-3 rounded-lg mb-4">
                              <h4 className="font-medium text-foreground mb-1">Client Notes:</h4>
                              <p className="text-sm text-muted-foreground">
                                {request.notes}
                              </p>
                            </div>
                          )}
                          
                          {request.adminNotes && (
                            <div className="bg-primary/5 border-l-4 border-primary p-3 rounded mb-4">
                              <h4 className="font-medium text-foreground mb-1">Admin Notes:</h4>
                              <p className="text-sm text-muted-foreground">
                                {request.adminNotes}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Payment: {request.paymentMethod?.replace("_", " ") || "Not specified"}
                            </span>
                            <Button 
                              size="sm" 
                              onClick={() => handleViewRequest(request)}
                              data-testid={`view-request-${request.id}`}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Manage
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Request Management Modal */}
            {selectedRequest && (
              <Card className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" data-testid="request-management-modal">
                <div className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Manage Request #{selectedRequest.id.slice(-8)}</h3>
                    <Button variant="ghost" onClick={() => setSelectedRequest(null)} data-testid="close-modal-button">
                      ×
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger data-testid="status-select">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending" data-testid="status-pending">Pending</SelectItem>
                          <SelectItem value="in_progress" data-testid="status-in-progress">In Progress</SelectItem>
                          <SelectItem value="completed" data-testid="status-completed">Completed</SelectItem>
                          <SelectItem value="cancelled" data-testid="status-cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Admin Notes</label>
                      <Textarea
                        placeholder="Add notes about this request..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="min-h-[100px]"
                        data-testid="admin-notes-textarea"
                      />
                    </div>
                    
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">Client Request Details:</h4>
                      <p className="text-sm text-muted-foreground">{selectedRequest.notes}</p>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-3">
                      <Button variant="outline" onClick={() => setSelectedRequest(null)} data-testid="cancel-update-button">
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleUpdateRequest} 
                        disabled={updateRequestMutation.isPending}
                        data-testid="save-changes-button"
                      >
                        {updateRequestMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
          
          {/* Content Management Tab */}
          <TabsContent value="content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card data-testid="universities-management">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UniversityIcon className="h-5 w-5" />
                    Universities ({universities.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Manage university listings and information.
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full" data-testid="add-university-button">
                      <UniversityIcon className="h-4 w-4 mr-2" />
                      Add New University
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="manage-universities-button">
                      <Edit className="h-4 w-4 mr-2" />
                      Manage Existing
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card data-testid="scholarships-management">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Scholarships ({scholarships.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Manage scholarship opportunities and details.
                  </p>
                  <div className="space-y-2">
                    <Button className="w-full" data-testid="add-scholarship-button">
                      <Trophy className="h-4 w-4 mr-2" />
                      Add New Scholarship
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="manage-scholarships-button">
                      <Edit className="h-4 w-4 mr-2" />
                      Manage Existing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card data-testid="admin-settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Platform Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">System Information</h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Users:</span>
                        <span className="font-medium">-</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Services:</span>
                        <span className="font-medium">4</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Status:</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" data-testid="backup-data-button">
                        Backup Data
                      </Button>
                      <Button variant="outline" data-testid="system-logs-button">
                        View System Logs
                      </Button>
                      <Button variant="outline" data-testid="user-analytics-button">
                        User Analytics
                      </Button>
                      <Button variant="outline" data-testid="maintenance-mode-button">
                        Maintenance Mode
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
