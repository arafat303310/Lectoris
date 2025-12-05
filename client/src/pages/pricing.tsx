import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Zap, Crown } from "lucide-react";

const pricingTiers = [
  {
    name: "Free",
    description: "Perfect for getting started with your university search",
    price: "0",
    currency: "UGX",
    period: "forever",
    icon: Sparkles,
    popular: false,
    features: [
      { name: "Browse all 30+ universities", included: true },
      { name: "View scholarship listings", included: true },
      { name: "Basic search & filters", included: true },
      { name: "Save up to 5 universities", included: true },
      { name: "Save up to 3 scholarships", included: true },
      { name: "Email notifications", included: false },
      { name: "Application tracking", included: false },
      { name: "Document review", included: false },
      { name: "Priority support", included: false },
      { name: "1-on-1 consultation", included: false },
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Standard",
    description: "For students serious about their university applications",
    price: "50,000",
    currency: "UGX",
    period: "month",
    icon: Zap,
    popular: true,
    features: [
      { name: "Browse all 30+ universities", included: true },
      { name: "View scholarship listings", included: true },
      { name: "Advanced search & filters", included: true },
      { name: "Unlimited saved universities", included: true },
      { name: "Unlimited saved scholarships", included: true },
      { name: "Email notifications", included: true },
      { name: "Application tracking", included: true },
      { name: "Professional Resume Writing", included: true },
      { name: "Scholarship Essay Review", included: true },
      { name: "Document Verification Service", included: true },
      { name: "Priority support", included: false },
      { name: "1-on-1 consultation", included: false },
    ],
    cta: "Start Standard",
    ctaVariant: "default" as const,
  },
  {
    name: "Premium",
    description: "Complete support for your academic journey",
    price: "150,000",
    currency: "UGX",
    period: "month",
    icon: Crown,
    popular: false,
    features: [
      { name: "Browse all 30+ universities", included: true },
      { name: "View scholarship listings", included: true },
      { name: "Advanced search & filters", included: true },
      { name: "Unlimited saved universities", included: true },
      { name: "Unlimited saved scholarships", included: true },
      { name: "Email notifications", included: true },
      { name: "Application tracking", included: true },
      { name: "University Application Assistance", included: true },
      { name: "Career Counseling Sessions", included: true },
      { name: "Interview Preparation Coaching", included: true },
      { name: "Priority 24/7 support", included: true },
      { name: "Monthly 1-on-1 consultation", included: true },
    ],
    cta: "Go Premium",
    ctaVariant: "secondary" as const,
  },
];

const additionalServices = [
  {
    name: "University Application Package",
    description: "Complete assistance for applying to your dream university",
    price: "150,000",
    features: ["Application form assistance", "Document preparation", "Essay review", "Deadline tracking"],
  },
  {
    name: "Scholarship Application Package",
    description: "Expert guidance to maximize your scholarship chances",
    price: "200,000",
    features: ["Scholarship matching", "Application writing", "Interview prep", "Follow-up support"],
  },
  {
    name: "Professional Resume/CV",
    description: "Stand out with a professionally crafted resume",
    price: "75,000",
    features: ["Custom design", "ATS optimization", "Cover letter", "LinkedIn review"],
  },
  {
    name: "Statement of Purpose",
    description: "Compelling SOP that tells your unique story",
    price: "120,000",
    features: ["Personalized narrative", "Multiple revisions", "Expert editing", "University-specific versions"],
  },
];

export default function Pricing() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Pricing - ApplyHub Uganda | University Application Services";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Choose from Free, Standard, or Premium plans to get expert help with your Ugandan university applications. Start free and upgrade as you grow.");
    }
  }, []);

  const handleGetStarted = (tier: string) => {
    if (tier === "Free") {
      setLocation("/universities");
    } else {
      window.location.href = "/api/login";
    }
  };

  return (
    <div className="min-h-screen bg-background" data-testid="pricing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm" data-testid="pricing-badge">
            Simple, Transparent Pricing
          </Badge>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4" data-testid="pricing-title">
            Choose Your Path to Success
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-2" data-testid="pricing-description">
            Start free and upgrade as you grow. All plans include access to Uganda's most comprehensive university database.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative flex flex-col ${
                  tier.popular
                    ? "border-primary shadow-lg md:scale-105 z-10"
                    : "border-border"
                }`}
                data-testid={`pricing-tier-${tier.name.toLowerCase()}`}
              >
                {tier.popular && (
                  <Badge
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs"
                    data-testid="popular-badge"
                  >
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-2 sm:pb-4 pt-4 sm:pt-6">
                  <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 sm:mb-4">
                    <tier.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl" data-testid={`tier-name-${tier.name.toLowerCase()}`}>
                    {tier.name}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 px-4 sm:px-6">
                  <div className="text-center mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-4xl font-bold text-foreground" data-testid={`tier-price-${tier.name.toLowerCase()}`}>
                      {tier.price === "0" ? "Free" : `${tier.currency} ${tier.price}`}
                    </span>
                    {tier.price !== "0" && (
                      <span className="text-sm sm:text-base text-muted-foreground">/{tier.period}</span>
                    )}
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    {tier.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 sm:gap-3"
                        data-testid={`feature-${tier.name.toLowerCase()}-${index}`}
                      >
                        {feature.included ? (
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span
                          className={`text-xs sm:text-sm ${
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground/50"
                          }`}
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <Button
                    variant={tier.ctaVariant}
                    className="w-full text-sm sm:text-base"
                    onClick={() => handleGetStarted(tier.name)}
                    data-testid={`cta-${tier.name.toLowerCase()}`}
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-6 sm:mb-8" data-testid="faq-title">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3 sm:space-y-6">
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border" data-testid="faq-1">
                <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                  Can I switch plans anytime?
                </h3>
                <p className="text-muted-foreground text-xs sm:text-base">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any differences.
                </p>
              </div>
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border" data-testid="faq-2">
                <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                  What payment methods do you accept?
                </h3>
                <p className="text-muted-foreground text-xs sm:text-base">
                  We accept MTN Mobile Money, Airtel Money, Visa, Mastercard, and bank transfers. All payments are processed securely.
                </p>
              </div>
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border" data-testid="faq-3">
                <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                  Is there a student discount?
                </h3>
                <p className="text-muted-foreground text-xs sm:text-base">
                  Yes! Students with a valid student ID can get 20% off all paid plans. Contact our support team to apply the discount.
                </p>
              </div>
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border" data-testid="faq-4">
                <h3 className="font-semibold text-foreground mb-1 sm:mb-2 text-sm sm:text-base">
                  What's included in the free plan?
                </h3>
                <p className="text-muted-foreground text-xs sm:text-base">
                  The free plan gives you full access to browse universities and scholarships, basic search features, and the ability to save up to 5 universities and 3 scholarships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-primary">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4" data-testid="cta-title">
            Ready to Start Your Journey?
          </h2>
          <p className="text-base sm:text-xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of Ugandan students who have found their perfect university match with ApplyHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-sm sm:text-base"
              onClick={() => handleGetStarted("Free")}
              data-testid="cta-signup"
            >
              Start Free Today
            </Button>
            <Link href="/universities">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="cta-browse"
              >
                Browse Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
