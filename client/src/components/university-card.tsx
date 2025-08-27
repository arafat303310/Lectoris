import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { University } from "@shared/schema";
import { MapPin, ArrowRight, University as UniversityIcon } from "lucide-react";
import { Link } from "wouter";

interface UniversityCardProps {
  university: University;
  onSave?: (universityId: string) => void;
  isSaved?: boolean;
}

export default function UniversityCard({ university, onSave, isSaved }: UniversityCardProps) {
  const formatTuition = () => {
    if (university.tuitionMin && university.tuitionMax) {
      return `UGX ${parseFloat(university.tuitionMin).toLocaleString()} - ${parseFloat(university.tuitionMax).toLocaleString()}`;
    }
    return "Contact for fees";
  };

  const getTypeColor = () => {
    return university.type === "public" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary";
  };

  const getUniversityInitials = () => {
    const words = university.name.split(' ');
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
  };

  const getUniversityColor = () => {
    // Generate a consistent color based on university name
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const index = university.name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 service-hover" data-testid={`university-card-${university.id}`}>
      {/* University logo */}
      <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
        {university.logoUrl ? (
          <img 
            src={university.logoUrl} 
            alt={`${university.name} logo`}
            className="w-24 h-24 object-contain rounded-lg shadow-md bg-white p-2"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-24 h-24 ${getUniversityColor()} rounded-full flex items-center justify-center text-white shadow-lg`}
          style={{ display: university.logoUrl ? 'none' : 'flex' }}
        >
          <span className="text-xl font-bold tracking-wide">
            {getUniversityInitials()}
          </span>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-foreground line-clamp-2" data-testid={`university-name-${university.id}`}>
            {university.name}
          </h3>
          <Badge className={getTypeColor()} data-testid={`university-type-${university.id}`}>
            {university.type}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-sm mb-3 flex items-center" data-testid={`university-location-${university.id}`}>
          <MapPin className="h-4 w-4 mr-1" />
          {university.location}
        </p>
        
        {university.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`university-description-${university.id}`}>
            {university.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground" data-testid={`university-tuition-${university.id}`}>
            {formatTuition()}
          </span>
          <div className="flex items-center space-x-2">
            {onSave && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave(university.id)}
                data-testid={`save-university-${university.id}`}
              >
                {isSaved ? "Saved" : "Save"}
              </Button>
            )}
            <Link href={`/universities/${university.id}`}>
              <Button variant="ghost" size="sm" data-testid={`view-university-${university.id}`}>
                View Details <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
