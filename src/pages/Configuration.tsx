import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth/auth.provider';
import { useSubscription } from '@/hooks/useSubscription';
import { PageWrapper } from '@/components/PageWrapper';
import { 
  Settings, 
  Shield, 
  Bell, 
  Palette, 
  Globe,
  CreditCard,
  User,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslationWithFallback } from '@/hooks/useTranslationWithFallback';

const Configuration = () => {
  const { user } = useAuth();
  const { isPro } = useSubscription();
  const { t } = useTranslationWithFallback();

  const settingsOptions = [
    {
      title: t('settings.security.title'),
      description: t('settings.security.description'),
      icon: Shield,
      link: "/app/settings/security"
    },
    {
      title: t('settings.notifications.title'),
      description: t('settings.notifications.description'),
      icon: Bell,
      link: "/app/settings/notifications"
    },
    {
      title: t('settings.appearance.title'),
      description: t('settings.appearance.description'),
      icon: Palette,
      link: "/app/settings/appearance"
    },
    {
      title: t('settings.language.title'),
      description: t('settings.language.description'),
      icon: Globe,
      link: "/app/settings/language"
    },
    {
      title: t('settings.subscription.title'),
      description: t('settings.subscription.description'),
      icon: CreditCard,
      link: "/app/settings/subscription"
    },
    {
      title: t('settings.profile.title'),
      description: t('settings.profile.description'),
      icon: User,
      link: "/app/settings/profile"
    }
  ];

  return (
    <PageWrapper pageName="Configuration">
      <div className="min-h-screen bg-tradeiq-navy p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="tradeiq-card">
            <CardHeader>
              <CardTitle className="text-white">{t('settings.title')}</CardTitle>
              <CardDescription className="text-gray-400">{t('settings.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {settingsOptions.map((option, index) => (
                <Link to={option.link} key={index}>
                  <Button variant="ghost" className="w-full justify-start px-4 py-3 hover:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center space-x-3 w-full">
                      <option.icon className="h-5 w-5 text-gray-400" />
                      <div className="flex-1 text-left">
                        <h3 className="text-sm font-medium text-white">{option.title}</h3>
                        <p className="text-xs text-gray-400">{option.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Configuration;
