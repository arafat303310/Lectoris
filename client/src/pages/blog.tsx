import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight, Mail, Zap, Users, TrendingUp } from "lucide-react";
import { useEffect } from "react";

const blogPosts = [
  {
    id: 1,
    title: "How to Write a Compelling University Application Essay",
    excerpt: "Learn the essential tips and strategies for writing an essay that stands out to university admissions committees.",
    category: "Application Tips",
    author: "Dr. Sarah Kamuntu",
    date: "Dec 3, 2025",
    readTime: "8 min read",
    image: "📝"
  },
  {
    id: 2,
    title: "Top 10 Scholarships for Ugandan Students in 2025",
    excerpt: "Discover the most accessible and generous scholarship opportunities available to Ugandan students this year.",
    category: "Scholarships",
    author: "James Okello",
    date: "Dec 1, 2025",
    readTime: "6 min read",
    image: "💰"
  },
  {
    id: 3,
    title: "University Ranking Trends: What You Should Know",
    excerpt: "Understanding how university rankings work and what they mean for your academic journey and career prospects.",
    category: "University Guide",
    author: "Prof. Grace Muhwezi",
    date: "Nov 28, 2025",
    readTime: "7 min read",
    image: "🎓"
  },
  {
    id: 4,
    title: "Preparing for University Interviews: A Complete Guide",
    excerpt: "Master the art of university interviews with our comprehensive guide covering preparation, common questions, and tips.",
    category: "Interview Prep",
    author: "Dr. David Ochieng",
    date: "Nov 25, 2025",
    readTime: "10 min read",
    image: "🎤"
  },
  {
    id: 5,
    title: "Financial Planning for Higher Education",
    excerpt: "Explore different ways to finance your university education and make informed financial decisions for your future.",
    category: "Financial Aid",
    author: "Monica Ssekubaddde",
    date: "Nov 22, 2025",
    readTime: "9 min read",
    image: "💳"
  },
  {
    id: 6,
    title: "Career Paths After University: Expert Insights",
    excerpt: "Get valuable insights from professionals about career progression and opportunities available to university graduates.",
    category: "Career",
    author: "Mr. Peter Lwanga",
    date: "Nov 19, 2025",
    readTime: "8 min read",
    image: "🚀"
  }
];

const categories = ["All", "Application Tips", "Scholarships", "University Guide", "Interview Prep", "Financial Aid", "Career"];

const newsletterBenefits = [
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

export default function Blog() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Blog - ApplyHub Uganda | University Application Insights & Tips";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Read expert articles and guides on university applications, scholarships, and higher education in Uganda. Get tips from education professionals.");
    }
  }, []);

  useEffect(() => {
    let filtered = blogPosts;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory]);

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

  return (
    <div className="min-h-screen bg-background" data-testid="blog-page">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6">
        {/* Newsletter Section */}
        <section className="py-12 sm:py-16 lg:py-20 text-center mb-12 animate-fade-in">
          <Badge variant="secondary" className="mb-4 text-sm badge-bounce" data-testid="newsletter-badge">
            Stay Informed
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 gradient-text animate-fade-in-down" data-testid="newsletter-title">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="newsletter-description">
            Get exclusive scholarship opportunities, university application tips, and success stories delivered to your inbox every week.
          </p>
          
          {/* Subscription Form */}
          <Card className="max-w-md mx-auto mb-12 animate-scale-in delay-300 shadow-glow" data-testid="newsletter-form-card">
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

          {/* Newsletter Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {newsletterBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card key={index} className="text-center card-hover animate-fade-in-up" style={{ animationDelay: `${(index + 1) * 150}ms` }} data-testid={`newsletter-benefit-${index}`}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
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

        {/* Blog Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 text-center animate-fade-in">
          <Badge variant="secondary" className="mb-4 text-sm" data-testid="blog-badge">
            Insights & Guidance
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 gradient-text" data-testid="blog-title">
            ApplyHub Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8" data-testid="blog-description">
            Expert articles, guides, and success stories to help you navigate your university journey with confidence.
          </p>
        </section>

        {/* Search and Filter Section */}
        <section className="mb-12">
          <Card data-testid="search-filter-card">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    data-testid="blog-search-input"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    data-testid={`category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Blog Posts Grid */}
        <section className="mb-12">
          {filteredPosts.length === 0 ? (
            <Card className="text-center py-12" data-testid="no-posts-found">
              <CardContent>
                <h3 className="text-lg font-semibold text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className="flex flex-col hover:shadow-lg transition-all duration-500 cursor-pointer card-hover animate-fade-in-up"
                  style={{ animationDelay: `${(index % 4) * 100}ms` }}
                  data-testid={`blog-post-${post.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary" className="text-xs" data-testid={`post-category-${post.id}`}>
                        {post.category}
                      </Badge>
                      <span className="text-2xl">{post.image}</span>
                    </div>
                    <CardTitle className="line-clamp-2" data-testid={`post-title-${post.id}`}>
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2" data-testid={`post-excerpt-${post.id}`}>
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex flex-col justify-between h-full">
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span data-testid={`post-date-${post.id}`}>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span data-testid={`post-author-${post.id}`}>{post.author}</span>
                        </div>
                        <span data-testid={`post-readtime-${post.id}`}>{post.readTime}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="justify-start px-0 text-primary hover:text-primary hover:bg-transparent"
                        data-testid={`read-more-${post.id}`}
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

      </div>

      <Footer />
    </div>
  );
}
