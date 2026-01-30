import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UniversityCard from "@/components/university-card";
import ScholarshipCard from "@/components/scholarship-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Trophy, Zap, TrendingUp, Star, MessageSquare } from "lucide-react";
import { University as UniversityType, Scholarship } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const isNewSignup = localStorage.getItem("justSignedUp") === "true";

  // Clear the flag after showing welcome message
  if (isNewSignup) {
    localStorage.removeItem("justSignedUp");
  }

  const { data: universities = [] } = useQuery<UniversityType[]>({
    queryKey: ["/api/universities"],
    retry: false,
  });

  const { data: scholarships = [] } = useQuery<Scholarship[]>({
    queryKey: ["/api/scholarships"],
    retry: false,
  });

  const featuredUniversities = universities.slice(0, 3);
  const topScholarships = scholarships.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="home-page">
      <Navbar />

      {/* Welcome Section */}
      <section className="hero-gradient py-12 sm:py-16 lg:py-24 relative" data-testid="welcome-section">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 animate-fade-in-down" data-testid="welcome-title">
              {isNewSignup ? "Welcome to ApplyHub" : `Welcome back, ${user?.firstName || "Student"}!`}
            </h1>
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 animate-fade-in-up delay-200" data-testid="welcome-subtitle">
              Continue your journey towards <span className="text-emerald-500 font-semibold">higher education</span> in Uganda
            </p>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <Link href="/universities">
                <Card className="bg-white/10 border-white/20 cursor-pointer hover:bg-white/20 transition-all animate-scale-in delay-300" data-testid="quick-action-universities">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-white">Universities</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/scholarships">
                <Card className="bg-white/10 border-white/20 cursor-pointer hover:bg-white/20 transition-all animate-scale-in delay-400" data-testid="quick-action-scholarships">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-secondary mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-white">Scholarships</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/services">
                <Card className="bg-white/10 border-white/20 cursor-pointer hover:bg-white/20 transition-all animate-scale-in delay-500" data-testid="quick-action-services">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-white">Services</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/dashboard">
                <Card className="bg-white/10 border-white/20 cursor-pointer hover:bg-white/20 transition-all animate-scale-in delay-600" data-testid="quick-action-dashboard">
                  <CardContent className="p-3 sm:p-4 text-center">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-xs sm:text-sm font-semibold text-white">Dashboard</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1">
        {/* Featured Universities */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background" data-testid="featured-universities-section">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2" data-testid="featured-universities-title">
                  Recommended Universities
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Handpicked institutions matching your profile
                </p>
              </div>
              <Link href="/universities">
                <Button variant="outline" className="text-xs sm:text-sm" data-testid="view-all-universities">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-testid="universities-grid">
              {featuredUniversities.map((university, index) => (
                <div key={university.id} className={`animate-fade-in-up delay-${(index + 1) * 100}`}>
                  <UniversityCard university={university} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats & Insights */}
        <section className="py-12 sm:py-16 lg:py-20 bg-card" data-testid="insights-section">
          <div className="container mx-auto px-4 lg:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 sm:mb-12" data-testid="insights-title">
              Your Learning Path
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6" data-testid="insights-grid">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border-blue-200 dark:border-blue-800" data-testid="insight-card-universities">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Universities Explored</p>
                      <p className="text-3xl font-bold text-foreground">30</p>
                      <p className="text-xs text-muted-foreground mt-2">Start exploring to track your journey</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800" data-testid="insight-card-scholarships">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Scholarships Found</p>
                      <p className="text-3xl font-bold text-foreground">0</p>
                      <p className="text-xs text-muted-foreground mt-2">Check out {scholarships.length}+ opportunities</p>
                    </div>
                    <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border-purple-200 dark:border-purple-800" data-testid="insight-card-services">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Premium Services</p>
                      <p className="text-3xl font-bold text-foreground">2</p>
                      <p className="text-xs text-muted-foreground mt-2">Tier upgrades available</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Top Scholarships */}
        <section className="py-12 sm:py-16 lg:py-20 bg-background" data-testid="top-scholarships-section">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between mb-8 sm:mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2" data-testid="top-scholarships-title">
                  Top Scholarship Opportunities
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Latest funding opportunities for Ugandan students
                </p>
              </div>
              <Link href="/scholarships">
                <Button variant="outline" className="text-xs sm:text-sm" data-testid="view-all-scholarships">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-testid="scholarships-grid">
              {topScholarships.map((scholarship, index) => (
                <div key={scholarship.id} className={`animate-fade-in-up delay-${(index + 1) * 100}`}>
                  <ScholarshipCard scholarship={scholarship} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-card" data-testid="cta-section">
          <div className="container mx-auto px-4 lg:px-6">
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 overflow-hidden" data-testid="cta-card">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 flex items-center gap-2" data-testid="cta-title">
                      <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                      Need Help Choosing?
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Our AI course advisor can help you find the perfect university and program based on your interests and grades.
                    </p>
                  </div>
                  <Link href="/chat">
                    <Button size="lg" className="whitespace-nowrap text-sm sm:text-base btn-animate" data-testid="chat-button">
                      Start Chat
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
