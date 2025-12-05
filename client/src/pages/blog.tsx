import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
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

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

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

  return (
    <div className="min-h-screen bg-background" data-testid="blog-page">
      <Navbar />
      
      <div className="container mx-auto px-4 lg:px-6">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20 text-center">
          <Badge variant="secondary" className="mb-4 text-sm" data-testid="blog-badge">
            Insights & Guidance
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4" data-testid="blog-title">
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
              {filteredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
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

        {/* Newsletter CTA */}
        <section className="py-12 sm:py-16 text-center mb-12">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Get More Content Like This
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Subscribe to our newsletter for exclusive articles and insights delivered to your inbox weekly.
              </p>
              <Button size="lg" data-testid="blog-newsletter-cta">
                Subscribe to Newsletter
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  );
}
