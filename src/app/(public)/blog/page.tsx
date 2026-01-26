import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dog,
  Search,
  Calendar,
  Clock,
  ArrowRight,
  User,
} from "lucide-react";

const categories = [
  "All",
  "Tips & Tricks",
  "Business Growth",
  "Industry News",
  "Product Updates",
  "Success Stories",
];

const posts = [
  {
    id: 1,
    slug: "reduce-no-shows-cancellations",
    title: "10 Ways to Reduce No-Shows and Last-Minute Cancellations",
    excerpt: "No-shows cost groomers thousands each year. Here are proven strategies to minimize cancellations and protect your revenue.",
    category: "Business Growth",
    author: "Emily Chen",
    date: "Jan 20, 2025",
    readTime: "5 min read",
    featured: true,
  },
  {
    id: 2,
    slug: "ai-powered-smart-scheduling",
    title: "Introducing AI-Powered Smart Scheduling",
    excerpt: "Our new AI feature automatically suggests optimal appointment times based on your history, location, and preferences.",
    category: "Product Updates",
    author: "Marcus Johnson",
    date: "Jan 15, 2025",
    readTime: "3 min read",
    featured: true,
  },
  {
    id: 3,
    slug: "mobile-groomer-success-story",
    title: "How Mobile Groomer Lisa Doubled Her Revenue in 6 Months",
    excerpt: "Lisa shares her journey from struggling solo groomer to thriving business owner with a waitlist of eager clients.",
    category: "Success Stories",
    author: "Sarah Williams",
    date: "Jan 10, 2025",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 4,
    slug: "pricing-guide",
    title: "The Ultimate Guide to Pricing Your Grooming Services",
    excerpt: "Stop undercharging! Learn how to calculate your true costs and set prices that reflect your value.",
    category: "Business Growth",
    author: "Emily Chen",
    date: "Jan 5, 2025",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: 5,
    slug: "2025-industry-trends",
    title: "2025 Pet Grooming Industry Trends to Watch",
    excerpt: "From eco-friendly products to mobile-first booking, here are the trends shaping the future of pet grooming.",
    category: "Industry News",
    author: "David Park",
    date: "Dec 28, 2024",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 6,
    slug: "client-communication-templates",
    title: "5 Client Communication Templates That Save Hours",
    excerpt: "Copy-paste these proven templates for booking confirmations, reminders, and follow-ups.",
    category: "Tips & Tricks",
    author: "Sarah Williams",
    date: "Dec 20, 2024",
    readTime: "4 min read",
    featured: false,
  },
];

export default function BlogPage() {
  const featuredPosts = posts.filter((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Dog className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">WagAndWash</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">The WagAndWash Blog</h1>
            <p className="text-xl text-muted-foreground">
              Tips, insights, and stories to help you grow your grooming business
            </p>
          </div>
        </div>
      </section>

      {/* Search and Categories */}
      <section className="border-b py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Featured</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20" />
                <CardContent className="p-6">
                  <Badge className="mb-3">{post.category}</Badge>
                  <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <Badge variant="outline" className="w-fit">{post.category}</Badge>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Get grooming tips in your inbox</h2>
            <p className="text-muted-foreground mb-6">
              Join 5,000+ groomers who get our weekly newsletter with business tips,
              industry news, and exclusive offers.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" />
              <Button>Subscribe</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Dog className="h-6 w-6 text-primary" />
            <span className="font-bold">WagAndWash</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © 2025 WagAndWash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
