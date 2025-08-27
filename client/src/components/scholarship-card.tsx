import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scholarship } from "@shared/schema";
import { Trophy, DollarSign, Calendar, User, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onSave?: (scholarshipId: string) => void;
  isSaved?: boolean;
}

export default function ScholarshipCard({ scholarship, onSave, isSaved }: ScholarshipCardProps) {
  const formatAmount = () => {
    if (scholarship.amount) {
      return `${scholarship.currency} ${parseFloat(scholarship.amount).toLocaleString()}`;
    }
    return "Full Coverage";
  };

  const getTypeColor = () => {
    switch (scholarship.type) {
      case "government":
        return "bg-accent/10 text-accent";
      case "international":
        return "bg-primary/10 text-primary";
      default:
        return "bg-secondary/10 text-secondary";
    }
  };

  const isDeadlineSoon = () => {
    const deadline = new Date(scholarship.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 30;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 service-hover" data-testid={`scholarship-card-${scholarship.id}`}>
      <div className={`h-4 bg-gradient-to-r ${
        scholarship.type === "government" ? "from-accent to-primary" :
        scholarship.type === "international" ? "from-primary to-secondary" :
        "from-secondary to-accent"
      }`} />
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <Trophy className="text-accent" />
          </div>
          <Badge className={getTypeColor()} data-testid={`scholarship-type-${scholarship.id}`}>
            {scholarship.type}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2" data-testid={`scholarship-title-${scholarship.id}`}>
          {scholarship.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3" data-testid={`scholarship-description-${scholarship.id}`}>
          {scholarship.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            <span data-testid={`scholarship-amount-${scholarship.id}`}>{formatAmount()}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span className={isDeadlineSoon() ? "text-destructive font-medium" : ""} data-testid={`scholarship-deadline-${scholarship.id}`}>
              Deadline: {format(new Date(scholarship.deadline), "MMMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="h-4 w-4 mr-2" />
            <span data-testid={`scholarship-level-${scholarship.id}`}>{scholarship.level}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onSave && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSave(scholarship.id)}
              data-testid={`save-scholarship-${scholarship.id}`}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
          )}
          {scholarship.applicationUrl && (
            <Button asChild size="sm" data-testid={`apply-scholarship-${scholarship.id}`}>
              <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                Apply Now <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
