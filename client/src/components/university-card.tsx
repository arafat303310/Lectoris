import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { University } from "@shared/schema";
import { MapPin, ArrowRight, GraduationCap, Building2, BookOpen, Landmark, Trophy, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface UniversityCardProps {
  university: University;
  onSave?: (universityId: string) => void;
  isSaved?: boolean;
}

// Official brand colors for Ugandan universities
const universityBrands: Record<string, { primary: string; secondary: string; initials: string }> = {
  "Makerere University": { primary: "#FFD700", secondary: "#000080", initials: "MAK" },
  "Kyambogo University": { primary: "#006400", secondary: "#FFD700", initials: "KYU" },
  "Gulu University": { primary: "#800000", secondary: "#FFFFFF", initials: "GU" },
  "Busitema University": { primary: "#2E8B57", secondary: "#FFD700", initials: "BU" },
  "Mbarara University of Science and Technology": { primary: "#4169E1", secondary: "#FFD700", initials: "MUST" },
  "Muni University": { primary: "#8B0000", secondary: "#FFD700", initials: "MU" },
  "Kabale University": { primary: "#006400", secondary: "#FFFFFF", initials: "KAB" },
  "Soroti University": { primary: "#4B0082", secondary: "#FFD700", initials: "SU" },
  "Lira University": { primary: "#DC143C", secondary: "#000080", initials: "LU" },
  "Mountains of the Moon University": { primary: "#228B22", secondary: "#FFFFFF", initials: "MMU" },
  "Uganda Christian University": { primary: "#800020", secondary: "#FFD700", initials: "UCU" },
  "Uganda Martyrs University": { primary: "#8B4513", secondary: "#FFD700", initials: "UMU" },
  "Islamic University in Uganda": { primary: "#006400", secondary: "#FFFFFF", initials: "IUIU" },
  "Ndejje University": { primary: "#4169E1", secondary: "#FFD700", initials: "NU" },
  "Nkumba University": { primary: "#800000", secondary: "#FFD700", initials: "NKU" },
  "Kampala International University": { primary: "#DC143C", secondary: "#000080", initials: "KIU" },
  "Kampala University": { primary: "#4B0082", secondary: "#FFD700", initials: "KU" },
  "Bugema University": { primary: "#006400", secondary: "#8B4513", initials: "BUG" },
  "Busoga University": { primary: "#DAA520", secondary: "#000080", initials: "BSU" },
  "Bishop Stuart University": { primary: "#800080", secondary: "#FFD700", initials: "BSU" },
  "Clarke International University": { primary: "#000080", secondary: "#FFD700", initials: "CIU" },
  "Victoria University": { primary: "#8B0000", secondary: "#FFFFFF", initials: "VU" },
  "International University of East Africa": { primary: "#006400", secondary: "#DC143C", initials: "IUEA" },
  "Cavendish University Uganda": { primary: "#4169E1", secondary: "#FFD700", initials: "CU" },
  "St. Lawrence University": { primary: "#DC143C", secondary: "#FFFFFF", initials: "SLAU" },
  "African Bible University": { primary: "#8B4513", secondary: "#FFD700", initials: "ABU" },
  "Uganda Pentecostal University": { primary: "#800080", secondary: "#FFFFFF", initials: "UPU" },
  "Team University": { primary: "#FF4500", secondary: "#FFFFFF", initials: "TU" },
  "Kayiwa International University": { primary: "#4B0082", secondary: "#FFD700", initials: "KAYU" },
  "Kisubi University": { primary: "#000080", secondary: "#FFFFFF", initials: "KBU" },
};

const iconComponents = [GraduationCap, Building2, BookOpen, Landmark];

export default function UniversityCard({ university, onSave, isSaved }: UniversityCardProps) {
  const [imageError, setImageError] = useState(false);

  const getTypeColor = () => {
    return university.type === "public" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary";
  };

  const getBrandColors = () => {
    return universityBrands[university.name] || { 
      primary: university.type === "public" ? "#1E40AF" : "#7C3AED", 
      secondary: "#FFD700",
      initials: university.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    };
  };

  const getIcon = () => {
    const index = university.name.charCodeAt(0) % iconComponents.length;
    return iconComponents[index];
  };

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-500 service-hover card-hover group" data-testid={`university-card-${university.id}`}>
      {/* University logo with brand colors */}
      <div 
        className="flex flex-col items-center justify-center p-4 sm:p-6 relative"
        style={{ 
          background: `linear-gradient(135deg, ${getBrandColors().primary}20 0%, ${getBrandColors().secondary}20 100%)`
        }}
      >
        {/* Ranking Badge */}
        {university.ranking && (
          <div 
            className="absolute top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg badge-bounce"
            data-testid={`university-ranking-${university.id}`}
          >
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-bold">#{university.ranking}</span>
          </div>
        )}
        
        {/* Logo */}
        {university.logoUrl && !imageError ? (
          <img 
            src={university.logoUrl} 
            alt={`${university.name} logo`}
            className="w-28 h-28 sm:w-40 sm:h-40 object-contain rounded-lg shadow-md bg-white p-3 sm:p-4 mb-4 group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div 
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center shadow-lg border-2 sm:border-4 mb-4"
            style={{ 
              backgroundColor: getBrandColors().primary,
              borderColor: getBrandColors().secondary
            }}
          >
            {(() => {
              const IconComponent = getIcon();
              return <IconComponent className="w-7 h-7 sm:w-10 sm:h-10 mb-1" style={{ color: getBrandColors().secondary }} />;
            })()}
            <span 
              className="text-sm sm:text-lg font-bold tracking-wide"
              style={{ color: getBrandColors().secondary }}
            >
              {getBrandColors().initials}
            </span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-2 w-full">
          {(university.applicationPortalUrl || university.websiteUrl) && (
            <a 
              href={university.applicationPortalUrl || university.websiteUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1"
              data-testid={`apply-button-${university.id}`}
            >
              <Button size="sm" className="w-full text-sm bg-green-600 hover:bg-green-700 btn-animate hover:scale-105 transition-transform duration-300">
                <ExternalLink className="w-3 h-3 mr-1" />
                Apply
              </Button>
            </a>
          )}
          <Link href={`/universities/${university.id}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full text-sm btn-animate hover:scale-105 transition-transform duration-300" data-testid={`learn-more-button-${university.id}`}>
              Learn More
            </Button>
          </Link>
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
          <h3 className="text-base sm:text-xl font-bold text-foreground line-clamp-2" data-testid={`university-name-${university.id}`}>
            {university.name}
          </h3>
          <Badge className={`${getTypeColor()} text-xs shrink-0`} data-testid={`university-type-${university.id}`}>
            {university.type}
          </Badge>
        </div>
        
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 flex items-center" data-testid={`university-location-${university.id}`}>
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 shrink-0" />
          {university.location}
        </p>
        
        {university.description && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3" data-testid={`university-description-${university.id}`}>
            {university.description}
          </p>
        )}
        
        <div className="flex items-center space-x-2">
          {onSave && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={() => onSave(university.id)}
              data-testid={`save-university-${university.id}`}
            >
              {isSaved ? "Saved" : "Save"}
            </Button>
          )}
          <Link href={`/universities/${university.id}`}>
            <Button variant="ghost" size="sm" className="text-xs h-8" data-testid={`view-university-${university.id}`}>
              View <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
