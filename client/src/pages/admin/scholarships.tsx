import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  ExternalLink,
  Calendar
} from "lucide-react";
import type { Scholarship, InsertScholarship } from "@shared/schema";
import { format } from "date-fns";

const emptyScholarship: Partial<InsertScholarship> = {
  title: "",
  description: "",
  provider: "",
  amount: "",
  currency: "UGX",
  eligibility: "",
  level: "undergraduate",
  type: "private",
  deadline: new Date(),
  applicationUrl: "",
  logoUrl: "",
  isActive: true,
};

export default function AdminScholarships() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [formData, setFormData] = useState<Partial<InsertScholarship>>(emptyScholarship);

  const { data: scholarships = [], isLoading } = useQuery<Scholarship[]>({
    queryKey: ["/api/scholarships"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertScholarship) => {
      return await apiRequest("POST", "/api/scholarships", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Scholarship created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/scholarships"] });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create scholarship", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertScholarship> }) => {
      return await apiRequest("PUT", `/api/scholarships/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Scholarship updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/scholarships"] });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update scholarship", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/scholarships/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Scholarship deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/scholarships"] });
      setIsDeleteOpen(false);
      setSelectedScholarship(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete scholarship", variant: "destructive" });
    },
  });

  const handleOpenCreate = () => {
    setFormData(emptyScholarship);
    setSelectedScholarship(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setFormData({
      title: scholarship.title,
      description: scholarship.description,
      provider: scholarship.provider,
      amount: scholarship.amount || "",
      currency: scholarship.currency || "UGX",
      eligibility: scholarship.eligibility,
      level: scholarship.level,
      type: scholarship.type,
      deadline: scholarship.deadline ? new Date(scholarship.deadline) : new Date(),
      applicationUrl: scholarship.applicationUrl || "",
      logoUrl: scholarship.logoUrl || "",
      isActive: scholarship.isActive ?? true,
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedScholarship(null);
    setFormData(emptyScholarship);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline) : new Date(),
    } as InsertScholarship;

    if (selectedScholarship) {
      updateMutation.mutate({ id: selectedScholarship.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleOpenDelete = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
    setIsDeleteOpen(true);
  };

  const filteredScholarships = scholarships.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  const formatAmount = (amount: string | null) => {
    if (!amount) return "-";
    const num = parseInt(amount);
    if (num >= 1000000) {
      return `UGX ${(num / 1000000).toFixed(1)}M`;
    }
    return `UGX ${num.toLocaleString()}`;
  };

  return (
    <AdminLayout title="Scholarships" description="Manage scholarship opportunities">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All Scholarships ({scholarships.length})</CardTitle>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Scholarship
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : filteredScholarships.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No scholarships found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Provider</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Level</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Deadline</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredScholarships.map((scholarship) => (
                    <tr key={scholarship.id} className="hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {scholarship.logoUrl && (
                            <img 
                              src={scholarship.logoUrl} 
                              alt="" 
                              className="h-8 w-8 object-contain rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{scholarship.title}</p>
                            {scholarship.applicationUrl && (
                              <a 
                                href={scholarship.applicationUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                Apply <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{scholarship.provider}</td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{scholarship.level}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {formatAmount(scholarship.amount)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {scholarship.deadline ? format(new Date(scholarship.deadline), "MMM d, yyyy") : "-"}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={scholarship.isActive ? "default" : "secondary"}>
                          {scholarship.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(scholarship)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDelete(scholarship)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedScholarship ? "Edit Scholarship" : "Add New Scholarship"}
            </DialogTitle>
            <DialogDescription>
              {selectedScholarship ? "Update the scholarship details below" : "Fill in the details to add a new scholarship"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Scholarship title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Provider *</label>
                <Input
                  required
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  placeholder="e.g., Government of Uganda"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the scholarship opportunity"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Eligibility *</label>
              <Textarea
                required
                value={formData.eligibility}
                onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                placeholder="Who is eligible for this scholarship?"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Level *</label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="postgraduate">Postgraduate</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type *</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Deadline *</label>
                <Input
                  type="date"
                  required
                  value={formData.deadline ? format(new Date(formData.deadline), "yyyy-MM-dd") : ""}
                  onChange={(e) => setFormData({ ...formData, deadline: new Date(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (UGX)</label>
                <Input
                  value={formData.amount || ""}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g., 5000000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Application URL</label>
                <Input
                  type="url"
                  value={formData.applicationUrl || ""}
                  onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })}
                  placeholder="https://www.apply.org"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Logo URL</label>
              <Input
                type="url"
                value={formData.logoUrl || ""}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.isActive ?? true}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <label className="text-sm font-medium">Active (visible on public pages)</label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : selectedScholarship ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scholarship</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedScholarship?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedScholarship && deleteMutation.mutate(selectedScholarship.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
