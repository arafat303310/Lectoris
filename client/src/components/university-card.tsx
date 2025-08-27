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

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 service-hover" data-testid={`university-card-${university.id}`}>
      {/* University logo placeholder */}
      <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
        {university.logoUrl ? (
          <img 
            src={university.logoUrl} 
            alt={`${university.name} logo`}
            className="w-20 h-20 object-contain"
          />
        ) : (
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <UniversityIcon className="text-2xl text-primary-foreground" />
          </div>
        )}
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
