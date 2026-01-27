import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dog,
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
} from "lucide-react";

// Mock blog post data
const post = {
  id: 1,
  slug: "reduce-no-shows-cancellations",
  title: "10 Ways to Reduce No-Shows and Last-Minute Cancellations",
  excerpt: "No-shows cost groomers thousands each year. Here are proven strategies to minimize cancellations and protect your revenue.",
  category: "Business Growth",
  author: {
    name: "Emily Chen",
    role: "Founder & CEO",
    bio: "Former veterinary technician with 15 years in pet care.",
    initials: "EC",
  },
  date: "January 20, 2025",
  readTime: "5 min read",
};

const relatedPosts = [
  {
    id: 2,
    slug: "pricing-guide",
    title: "The Ultimate Guide to Pricing Your Grooming Services",
    category: "Business Growth",
    readTime: "10 min read",
  },
  {
    id: 3,
    slug: "client-communication-templates",
    title: "5 Client Communication Templates That Save Hours",
    category: "Tips & Tricks",
    readTime: "4 min read",
  },
  {
    id: 4,
    slug: "mobile-groomer-success-story",
    title: "How Mobile Groomer Lisa Doubled Her Revenue in 6 Months",
    category: "Success Stories",
    readTime: "7 min read",
  },
];

export default function BlogPostPage() {
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

      {/* Article Header */}
      <header className="py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <Badge className="mb-4">{post.category}</Badge>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-medium text-primary">{post.author.initials}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{post.author.name}</p>
                <p>{post.author.role}</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12">
        <div className="container max-w-4xl">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3 prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                No-shows and last-minute cancellations are the bane of every groomer&apos;s existence.
                A single missed appointment can cost you $50-150 in lost revenue, and the ripple
                effects—wasted time, disrupted schedules, and the stress of trying to fill gaps—add up quickly.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                The good news? You can dramatically reduce no-shows with the right strategies.
                Here are 10 proven tactics that successful groomers use:
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">1. Send Automated Reminders</h2>
              <p className="text-muted-foreground leading-relaxed">
                This is the single most effective way to reduce no-shows. Send reminders at these key intervals:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4 text-muted-foreground">
                <li><strong>7 days before</strong>: Initial reminder via email</li>
                <li><strong>2 days before</strong>: SMS reminder with appointment details</li>
                <li><strong>Day of</strong>: Morning reminder with any prep instructions</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                Studies show that SMS reminders alone can reduce no-shows by up to 38%.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">2. Require Deposits for New Clients</h2>
              <p className="text-muted-foreground leading-relaxed">
                New clients are statistically more likely to no-show. A small deposit ($20-30)
                creates commitment without being prohibitive. Most booking software makes this easy to implement.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">3. Implement a Clear Cancellation Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your policy should include:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4 text-muted-foreground">
                <li>Minimum notice required (24-48 hours is standard)</li>
                <li>Consequences for no-shows (lost deposit, rebooking fees)</li>
                <li>How to properly cancel or reschedule</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">4. Make Rescheduling Easy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Sometimes cancellations happen because clients feel it&apos;s easier to just not show up
                than to call and reschedule. Offer multiple ways to change appointments:
              </p>
              <ul className="list-disc pl-6 space-y-2 my-4 text-muted-foreground">
                <li>Online self-service rescheduling</li>
                <li>Text-to-reschedule options</li>
                <li>Quick response to reschedule requests</li>
              </ul>

              <h2 className="text-2xl font-bold mt-8 mb-4">5. Build Personal Relationships</h2>
              <p className="text-muted-foreground leading-relaxed">
                Clients are less likely to ghost someone they know personally. Take time to remember
                pet names, follow up after appointments, and engage on social media.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">6. Offer Flexible Scheduling</h2>
              <p className="text-muted-foreground leading-relaxed">
                Rigid scheduling can lead to cancellations when life gets in the way. Consider early
                morning or evening slots, weekend availability, and express services for busy clients.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">7. Create a Waitlist System</h2>
              <p className="text-muted-foreground leading-relaxed">
                When clients know others are waiting for their slot, they&apos;re more likely to show up
                or give proper notice. Mention your waitlist when confirming appointments.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">8. Follow Up on Missed Appointments</h2>
              <p className="text-muted-foreground leading-relaxed">
                Don&apos;t just write off no-shows. A friendly follow-up call shows you care and often
                reveals the reason. Many no-shows are simply forgotten appointments.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">9. Track and Address Repeat Offenders</h2>
              <p className="text-muted-foreground leading-relaxed">
                Some clients are chronic no-shows. Track patterns and consider requiring full payment
                upfront or limiting booking to last-minute slots only.
              </p>

              <h2 className="text-2xl font-bold mt-8 mb-4">10. Use Calendar Integration</h2>
              <p className="text-muted-foreground leading-relaxed">
                Make it easy for clients to add appointments to their personal calendars. Include
                &quot;Add to Calendar&quot; links in all confirmation emails.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mt-8 mb-4">Implementing These Strategies</h2>
              <p className="text-muted-foreground leading-relaxed">
                You don&apos;t need to implement all 10 at once. Start with automated reminders and
                deposits for new clients—these two alone can cut your no-show rate in half.
              </p>

              <div className="bg-muted p-6 rounded-lg mt-8">
                <p className="italic text-muted-foreground">
                  Want to automate your appointment reminders and deposits?{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    Start your free WagAndWash trial
                  </Link>{" "}
                  and reduce no-shows starting today.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Share */}
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium mb-3">Share this article</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="pt-6">
                    <p className="font-semibold mb-2">Ready to reduce no-shows?</p>
                    <p className="text-sm opacity-90 mb-4">
                      Start your free 14-day trial of WagAndWash.
                    </p>
                    <Button variant="secondary" className="w-full" asChild>
                      <Link href="/register">Get Started Free</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Badge variant="outline" className="mb-3">
                    {relatedPost.category}
                  </Badge>
                  <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                    <Link href={`/blog/${relatedPost.slug}`}>
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-muted-foreground">{relatedPost.readTime}</p>
                </CardContent>
              </Card>
            ))}
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
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 WagAndWash. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
