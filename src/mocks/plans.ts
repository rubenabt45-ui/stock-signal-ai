export interface MockPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  highlighted?: boolean;
}

export const mockPlans: MockPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '50 messages per day',
      'Basic market data',
      'Standard support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    interval: 'month',
    features: [
      'Unlimited messages',
      'Real-time market data',
      'Advanced AI analysis',
      'Priority support',
      'Custom alerts',
      'Export data',
    ],
    highlighted: true,
  },
];

export const getMockPlanById = (id: string): MockPlan | undefined => {
  return mockPlans.find(p => p.id === id);
};
