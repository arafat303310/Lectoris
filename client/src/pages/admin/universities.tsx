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
  ExternalLink
} from "lucide-react";
import type { University, InsertUniversity } from "@shared/schema";

const emptyUniversity: Partial<InsertUniversity> = {
  name: "",
  location: "",
  type: "public",
  status: "chartered",
  description: "",
  websiteUrl: "",
  applicationPortalUrl: "",
  logoUrl: "",
  tuitionMin: "",
  tuitionMax: "",
  established: undefined,
  ranking: undefined,
  specialties: [],
};

export default function AdminUniversities() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [formData, setFormData] = useState<Partial<InsertUniversity>>(emptyUniversity);
  const [specialtiesInput, setSpecialtiesInput] = useState("");

  const { data: universities = [], isLoading } = useQuery<University[]>({
    queryKey: ["/api/universities"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertUniversity) => {
      return await apiRequest("POST", "/api/universities", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "University created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/universities"] });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create university", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertUniversity> }) => {
      return await apiRequest("PUT", `/api/universities/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "University updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/universities"] });
      handleCloseForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update university", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/universities/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "University deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/universities"] });
      setIsDeleteOpen(false);
      setSelectedUniversity(null);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete university", variant: "destructive" });
    },
  });

  const handleOpenCreate = () => {
    setFormData(emptyUniversity);
    setSpecialtiesInput("");
    setSelectedUniversity(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (university: University) => {
    setSelectedUniversity(university);
    setFormData({
      name: university.name,
      location: university.location,
      type: university.type,
      status: university.status,
      description: university.description || "",
      websiteUrl: university.websiteUrl || "",
      applicationPortalUrl: university.applicationPortalUrl || "",
      logoUrl: university.logoUrl || "",
      tuitionMin: university.tuitionMin || "",
      tuitionMax: university.tuitionMax || "",
      established: university.established || undefined,
      ranking: university.ranking || undefined,
      specialties: university.specialties || [],
    });
    setSpecialtiesInput((university.specialties || []).join(", "));
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedUniversity(null);
    setFormData(emptyUniversity);
    setSpecialtiesInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const specialties = specialtiesInput
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    const submitData = {
      ...formData,
      specialties,
      established: formData.established ? Number(formData.established) : null,
      ranking: formData.ranking ? Number(formData.ranking) : null,
    } as InsertUniversity;

    if (selectedUniversity) {
      updateMutation.mutate({ id: selectedUniversity.id, data: submitData });
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleOpenDelete = (university: University) => {
    setSelectedUniversity(university);
    setIsDeleteOpen(true);
  };

  const filteredUniversities = universities.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout title="Universities" description="Manage university listings">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>All Universities ({universities.length})</CardTitle>
          <Button onClick={handleOpenCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities..."
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
          ) : filteredUniversities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No universities found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Ranking</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUniversities.map((university) => (
                    <tr key={university.id} className="hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {university.logoUrl && (
                            <img 
                              src={university.logoUrl} 
                              alt="" 
                              className="h-8 w-8 object-contain rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{university.name}</p>
                            {university.websiteUrl && (
                              <a 
                                href={university.websiteUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                Website <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{university.location}</td>
                      <td className="py-3 px-4">
                        <Badge variant={university.type === "public" ? "default" : "secondary"}>
                          {university.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{university.status}</Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {university.ranking ? `#${university.ranking}` : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(university)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenDelete(university)}>
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
              {selectedUniversity ? "Edit University" : "Add New University"}
            </DialogTitle>
            <DialogDescription>
              {selectedUniversity ? "Update the university details below" : "Fill in the details to add a new university"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="University name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Kampala, Uganda"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status *</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chartered">Chartered (Active)</SelectItem>
                    <SelectItem value="provisional">Provisional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the university"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Website URL</label>
                <Input
                  type="url"
                  value={formData.websiteUrl || ""}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  placeholder="https://www.university.ac.ug"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Application Portal URL</label>
                <Input
                  type="url"
                  value={formData.applicationPortalUrl || ""}
                  onChange={(e) => setFormData({ ...formData, applicationPortalUrl: e.target.value })}
                  placeholder="https://apply.university.ac.ug"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Established Year</label>
                <Input
                  type="number"
                  value={formData.established || ""}
                  onChange={(e) => setFormData({ ...formData, established: parseInt(e.target.value) || undefined })}
                  placeholder="e.g., 1922"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">National Ranking</label>
                <Input
                  type="number"
                  value={formData.ranking || ""}
                  onChange={(e) => setFormData({ ...formData, ranking: parseInt(e.target.value) || undefined })}
                  placeholder="e.g., 1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tuition Min (UGX)</label>
                <Input
                  value={formData.tuitionMin || ""}
                  onChange={(e) => setFormData({ ...formData, tuitionMin: e.target.value })}
                  placeholder="e.g., 2000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Specialties (comma-separated)</label>
              <Input
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
                placeholder="e.g., Medicine, Engineering, Law, Business"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : selectedUniversity ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete University</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedUniversity?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUniversity && deleteMutation.mutate(selectedUniversity.id)}
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
