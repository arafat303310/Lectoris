import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Mail, Zap, Users, TrendingUp } from "lucide-react";
import { useEffect } from "react";

export default function Newsletter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Newsletter - ApplyHub Uganda | University Insights & Scholarship Updates";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Subscribe to ApplyHub Uganda's weekly newsletter for exclusive scholarship opportunities, university application tips, and educational insights delivered to your inbox.");
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate subscription
    setTimeout(() => {
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter. Check your inbox for a welcome email!",
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  const benefits = [
    {
      icon: Zap,
      title: "Weekly Updates",
      description: "Get the latest university deadlines and scholarship opportunities every week."
    },
    {
      icon: Users,
      title: "Success Stories",
      description: "Learn from students who successfully secured their spots at top universities."
    },
    {
      icon: TrendingUp,
      title: "Expert Tips",
      description: "Receive application advice and career guidance from education professionals."
    },
    {
      icon: Mail,
      title: "Exclusive Offers",
      description: "Access special promotions on our premium services for subscribers only."
    }
  ];

  const recentTopics = [
    "How to Write a Compelling University Application Essay",
    "Top 10 Scholarships for Ugandan Students in 2025",
    "University Ranking Trends: What You Should Know",
    "Preparing for University Interviews: A Complete Guide",
    "Financial Planning for Higher Education",
    "Career Paths After University: Expert Insights"
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="newsletter-page">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 text-center">
          <Badge variant="secondary" className="mb-4 text-sm" data-testid="newsletter-badge">
            Stay Informed
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="newsletter-title">
            Subscribe to Our Newsletter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="newsletter-description">
            Get exclusive scholarship opportunities, university application tips, and success stories delivered to your inbox every week.
          </p>
          
          {/* Subscription Form */}
          <Card className="max-w-md mx-auto mb-12" data-testid="newsletter-form-card">
            <CardHeader className="text-center">
              <CardTitle>Join 5,000+ Students</CardTitle>
              <CardDescription>Subscribe and get started in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubscribe} className="space-y-4" data-testid="newsletter-form">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                  data-testid="newsletter-email-input"
                  disabled={isSubmitting}
                />
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="newsletter-subscribe-button"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                We'll never share your email. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8" data-testid="benefits-title">
            Why Subscribe?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center" data-testid={`benefit-card-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Recent Topics */}
        <section className="py-12 sm:py-16 mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-8" data-testid="recent-topics-title">
            Recent Newsletter Topics
          </h2>
          <Card data-testid="topics-card">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentTopics.map((topic, index) => (
                  <div key={index} className="flex items-start gap-3" data-testid={`topic-${index}`}>
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{topic}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 text-center mb-12">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Don't Miss Out on Opportunities
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of Ugandan students who are using ApplyHub to find their dream universities and scholarships.
              </p>
              <Button size="lg" data-testid="cta-subscribe-button">
                Subscribe Today
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
}
