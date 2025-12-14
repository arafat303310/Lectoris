import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scholarship } from "@shared/schema";
import * as Icons from "lucide-react";
import { DollarSign, Calendar, User, ExternalLink } from "lucide-react";
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

  const getScholarshipIcon = () => {
    const iconMap: Record<string, any> = {
      Briefcase: Icons.Briefcase,
      CreditCard: Icons.CreditCard,
      Flag: Icons.Flag,
      BookOpen: Icons.BookOpen,
      Users: Icons.Users,
      Globe: Icons.Globe,
      Award: Icons.Award,
      Star: Icons.Star,
      Zap: Icons.Zap,
      Banknote: Icons.Banknote,
      Building2: Icons.Building2,
      Stethoscope: Icons.Stethoscope,
      HandCoins: Icons.HandCoins,
      FlaskConical: Icons.FlaskConical,
      Circle: Icons.Circle,
      BookMarked: Icons.BookMarked,
    };

    const IconComponent = iconMap[scholarship.icon];
    return IconComponent ? <IconComponent className="text-accent h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" /> : null;
  };

  const isDeadlineSoon = () => {
    const deadline = new Date(scholarship.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDeadline <= 30;
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 service-hover card-hover group" data-testid={`scholarship-card-${scholarship.id}`}>
      <div className={`h-2 sm:h-4 bg-gradient-to-r transition-all duration-500 group-hover:h-3 sm:group-hover:h-5 ${
        scholarship.type === "government" ? "from-accent to-primary" :
        scholarship.type === "international" ? "from-primary to-secondary" :
        "from-secondary to-accent"
      }`} />
      
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <Badge className={`${getTypeColor()} text-xs`} data-testid={`scholarship-type-${scholarship.id}`}>
            {scholarship.type}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            {getScholarshipIcon()}
          </div>
          <h3 className="text-base sm:text-xl font-bold text-foreground line-clamp-2" data-testid={`scholarship-title-${scholarship.id}`}>
            {scholarship.title}
          </h3>
        </div>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3" data-testid={`scholarship-description-${scholarship.id}`}>
          {scholarship.description}
        </p>
        
        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
            <span data-testid={`scholarship-amount-${scholarship.id}`}>{formatAmount()}</span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
            <span className={isDeadlineSoon() ? "text-destructive font-medium" : ""} data-testid={`scholarship-deadline-${scholarship.id}`}>
              {format(new Date(scholarship.deadline), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
            <User className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0" />
            <span className="capitalize" data-testid={`scholarship-level-${scholarship.id}`}>{scholarship.level}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {onSave && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => onSave(scholarship.id)}
              data-testid={`save-scholarship-${scholarship.id}`}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
          )}
          {scholarship.applicationUrl && (
            <Button asChild size="sm" className="text-xs h-8 btn-animate hover:scale-105 transition-transform duration-300" data-testid={`apply-scholarship-${scholarship.id}`}>
              <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer">
                Apply <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
