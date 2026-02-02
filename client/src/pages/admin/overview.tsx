import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "./index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  University as UniversityIcon, 
  Trophy, 
  Briefcase,
  Users,
  FileText,
  TrendingUp
} from "lucide-react";
import type { University, Scholarship, Service, User } from "@shared/schema";

export default function AdminOverview() {
  const { data: universities = [], isLoading: loadingUniversities } = useQuery<University[]>({
    queryKey: ["/api/universities"],
  });

  const { data: scholarships = [], isLoading: loadingScholarships } = useQuery<Scholarship[]>({
    queryKey: ["/api/scholarships"],
  });

  const { data: services = [], isLoading: loadingServices } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const isLoading = loadingUniversities || loadingScholarships || loadingServices || loadingUsers;

  const stats = [
    { 
      icon: UniversityIcon, 
      label: "Universities", 
      value: universities.length,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    { 
      icon: Trophy, 
      label: "Scholarships", 
      value: scholarships.length,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    { 
      icon: Briefcase, 
      label: "Services", 
      value: services.length,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    { 
      icon: Users, 
      label: "Users", 
      value: users.length,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
  ];

  return (
    <AdminLayout title="Dashboard Overview" description="Welcome to your admin dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  )}
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Public Universities</span>
                <span className="font-medium">
                  {universities.filter(u => u.type === "public").length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Private Universities</span>
                <span className="font-medium">
                  {universities.filter(u => u.type === "private").length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Active Scholarships</span>
                <span className="font-medium">
                  {scholarships.filter(s => s.isActive).length}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Active Services</span>
                <span className="font-medium">
                  {services.filter(s => s.isActive).length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage your content using the sidebar navigation. You can add, edit, or remove universities, scholarships, and services.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Quick Actions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Click "Universities" to manage university listings</li>
                  <li>• Click "Scholarships" to manage scholarship opportunities</li>
                  <li>• Click "Services" to manage available services</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
