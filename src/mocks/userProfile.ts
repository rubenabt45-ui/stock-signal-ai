export interface MockUserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  subscription_tier: 'free' | 'pro';
  subscription_status: 'active' | 'inactive' | 'trialing';
  is_pro: boolean;
  daily_message_count: number;
  daily_message_limit: number;
  subscription_expires_at?: string;
  created_at: string;
}

export const mockUserProfiles: Record<string, MockUserProfile> = {
  'founder': {
    id: '570ebb74-74dd-424e-8191-3c7689c38ed2',
    email: 'ruben_abt@hotmail.com',
    full_name: 'Rubén Abt',
    subscription_tier: 'pro',
    subscription_status: 'active',
    is_pro: true,
    daily_message_count: 5,
    daily_message_limit: 1000,
    subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  },
  'demo-user': {
    id: 'demo-user-123',
    email: 'demo@example.com',
    full_name: 'Demo User',
    subscription_tier: 'free',
    subscription_status: 'inactive',
    is_pro: false,
    daily_message_count: 10,
    daily_message_limit: 50,
    created_at: new Date().toISOString(),
  },
};

export const getCurrentMockUser = (): MockUserProfile => {
  const userId = localStorage.getItem('mock_user_id') || 'demo-user';
  return mockUserProfiles[userId] || mockUserProfiles['demo-user'];
};
