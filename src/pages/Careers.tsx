import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Careers = () => {
  const { t } = useTranslation();

  const openings = [
    {
      title: "Senior Frontend Developer",
      location: "Remote",
      type: "Full-time",
      description: "Join our team to build cutting-edge trading interfaces using React and TypeScript."
    },
    {
      title: "AI/ML Engineer",
      location: "Remote",
      type: "Full-time", 
      description: "Help develop and improve our AI-powered trading analysis algorithms."
    },
    {
      title: "Product Designer",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive user experiences for our trading platform and mobile apps."
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
            {t('footer.careers')}
          </h1>
          <p className="text-muted-foreground">
            Join our team and help shape the future of AI-powered trading
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Why Work With Us?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Innovation First</h3>
              <p className="text-muted-foreground">
                Work on cutting-edge AI technology that's revolutionizing financial markets.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Remote Flexibility</h3>
              <p className="text-muted-foreground">
                Work from anywhere with flexible hours and a results-focused culture.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Growth Opportunities</h3>
              <p className="text-muted-foreground">
                Continuous learning and development with opportunities to advance your career.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Competitive Benefits</h3>
              <p className="text-muted-foreground">
                Comprehensive health coverage, equity participation, and performance bonuses.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">Open Positions</h2>
          <div className="space-y-6">
            {openings.map((job, index) => (
              <div key={index} className="border border-border rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground mb-2 md:mb-0">
                    {job.title}
                  </h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.type}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  {job.description}
                </p>
                <Button variant="outline" size="sm">
                  Apply Now
                </Button>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-foreground mb-2">Don't see a perfect fit?</h3>
          <p className="text-muted-foreground mb-4">
            We're always looking for talented individuals. Send us your resume at careers@tradeiqpro.com
          </p>
          <Button variant="outline">
            Send Resume
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Careers;