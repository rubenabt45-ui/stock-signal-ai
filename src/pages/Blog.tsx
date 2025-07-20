import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Blog = () => {
  const { t } = useTranslation();

  const blogPosts = [
    {
      title: "Getting Started with AI Trading",
      excerpt: "Learn the basics of using artificial intelligence to enhance your trading strategy.",
      date: "2024-01-15",
      readTime: "5 min read"
    },
    {
      title: "Market Analysis Techniques",
      excerpt: "Discover advanced techniques for analyzing market trends and patterns.",
      date: "2024-01-10",
      readTime: "7 min read"
    },
    {
      title: "Risk Management in Trading",
      excerpt: "Essential strategies for managing risk and protecting your portfolio.",
      date: "2024-01-05",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('common.goBack')}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('footer.blog')}
          </h1>
          <p className="text-muted-foreground">
            Latest insights and updates from the TradeIQ Pro team
          </p>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <article key={index} className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-foreground mb-2 hover:text-primary cursor-pointer">
                {post.title}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            More articles coming soon! Follow us for the latest updates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;