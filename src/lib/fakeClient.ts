import { MOCK_CONFIG } from '@/config/runtime';
import { getCurrentMockUser, mockUserProfiles, MockUserProfile } from '@/mocks/userProfile';
import { mockTickers, getMockTickerBySymbol } from '@/mocks/tickers';
import { getMockChartData } from '@/mocks/chartSeries';
import { mockSignals, getMockSignalsForSymbol } from '@/mocks/signals';
import { mockPlans, getMockPlanById } from '@/mocks/plans';

const simulateLatency = () => 
  new Promise(resolve => setTimeout(resolve, MOCK_CONFIG.simulatedLatency));

const log = (...args: any[]) => {
  if (MOCK_CONFIG.enableDebugLogs) {
    console.log('[FakeClient]', ...args);
  }
};

export const fakeClient = {
  // Auth methods
  auth: {
    async getSession() {
      await simulateLatency();
      const isLoggedIn = localStorage.getItem('mock_logged_in') === 'true';
      const userId = localStorage.getItem('mock_user_id') || 'demo-user';
      
      if (!isLoggedIn) {
        return { data: { session: null }, error: null };
      }
      
      const user = mockUserProfiles[userId] || mockUserProfiles['demo-user'];
      const session = { user: { id: user.id, email: user.email }, access_token: 'mock-token' };
      return {
        data: { session },
        error: null,
      };
    },
    
    async signIn(email: string, _password: string) {
      await simulateLatency();
      log('Sign in:', email);
      
      // Find user by email or use demo
      const user = Object.values(mockUserProfiles).find(u => u.email === email) || mockUserProfiles['demo-user'];
      
      localStorage.setItem('mock_logged_in', 'true');
      localStorage.setItem('mock_user_id', user.id);
      
      return { error: null, session: { user: { id: user.id, email: user.email } } };
    },
    
    async signUp(email: string, _password: string, _fullName?: string) {
      await simulateLatency();
      log('Sign up:', email);
      
      localStorage.setItem('mock_logged_in', 'true');
      localStorage.setItem('mock_user_id', 'demo-user');
      
      return { error: null };
    },
    
    async signOut() {
      await simulateLatency();
      log('Sign out');
      
      localStorage.removeItem('mock_logged_in');
      localStorage.removeItem('mock_user_id');
      
      return { error: null };
    },
    
    async resetPassword(_email: string) {
      await simulateLatency();
      log('Reset password');
      return { error: null };
    },
    
    async updatePassword(_password: string) {
      await simulateLatency();
      log('Update password');
      return { error: null };
    },
    
    async updateUser(_data: any) {
      await simulateLatency();
      log('Update user');
      return { data: { user: null }, error: null };
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      // Simulate auth state listener
      const checkAuth = () => {
        const isLoggedIn = localStorage.getItem('mock_logged_in') === 'true';
        const userId = localStorage.getItem('mock_user_id') || 'demo-user';
        const user = mockUserProfiles[userId];
        
        callback(
          isLoggedIn ? 'SIGNED_IN' : 'SIGNED_OUT',
          isLoggedIn ? { user: { id: user.id, email: user.email } } : null
        );
      };
      
      // Check immediately
      setTimeout(checkAuth, 0);
      
      // Listen for storage changes
      window.addEventListener('storage', checkAuth);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => window.removeEventListener('storage', checkAuth),
          },
        },
      };
    },
  },
  
  // Database methods with full chainability
  from(table: string) {
    const builder = {
      _table: table,
      _filters: {} as Record<string, any>,
      
      async select(columns: string = '*') {
        await simulateLatency();
        log('Select from', table, columns);
        
        switch (table) {
          case 'user_profiles':
          case 'profiles':
            return { data: [getCurrentMockUser()], error: null };
          case 'watchlist_items':
          case 'user_favorites':
            return { data: mockTickers.slice(0, 3).map((t, i) => ({
              id: `fav-${i}`,
              symbol: t.symbol,
              display_name: t.name,
              asset_type: 'stock',
            })), error: null };
          case 'user_alerts':
            return { data: [], error: null };
          case 'user_settings':
            return { data: [{ id: '1', user_id: getCurrentMockUser().id }], error: null };
          default:
            return { data: [], error: null };
        }
      },
      
      insert(data: any) {
        const chain = {
          async select() {
            await simulateLatency();
            log('Insert into', table, data);
            return { data, error: null };
          },
        };
        return chain;
      },
      
      update(data: any) {
        const self = this;
        return {
          ...self,
          async eq(column: string, value: any) {
            await simulateLatency();
            log('Update', table, data, 'where', column, '=', value);
            return { data, error: null };
          },
        };
      },
      
      upsert(data: any) {
        const chain = {
          async eq(_column: string, _value: any) {
            await simulateLatency();
            log('Upsert into', table, data);
            return { data, error: null };
          },
        };
        return chain;
      },
      
      async delete() {
        await simulateLatency();
        log('Delete from', table);
        return { error: null };
      },
      
      eq(column: string, value: any) {
        this._filters[column] = value;
        return this;
      },
      
      single() {
        return this.select().then(result => ({ ...result, data: result.data?.[0] || null }));
      },
      
      order(_column: string, _options?: any) {
        return this;
      },
      
      limit(_count: number) {
        return this;
      },
      
      range(_from: number, _to: number) {
        return this;
      },
      
      in(_column: string, _values: any[]) {
        return this;
      },
      
      gte(_column: string, _value: any) {
        return this;
      },
      
      lte(_column: string, _value: any) {
        return this;
      },
    };
    
    return builder;
  },
  
  // Functions
  functions: {
    async invoke(name: string, options?: any) {
      await simulateLatency();
      log('Invoke function:', name, options);
      
      switch (name) {
        case 'check-subscription':
          const user = getCurrentMockUser();
          return {
            data: {
              subscribed: user.is_pro,
              subscription_tier: user.subscription_tier,
              subscription_status: user.subscription_status,
              subscription_end: user.subscription_expires_at,
            },
            error: null,
          };
        default:
          return { data: {}, error: null };
      }
    },
  },
  
  // Storage methods
  storage: {
    from(_bucket: string) {
      return {
        async upload(_path: string, _file: File, _options?: any) {
          await simulateLatency();
          log('Storage upload (fake)');
          return { data: { path: _path }, error: null };
        },
        async remove(_paths: string[]) {
          await simulateLatency();
          log('Storage remove (fake)');
          return { data: null, error: null };
        },
        getPublicUrl(_path: string) {
          return { data: { publicUrl: `https://fake-storage.com/${_path}` } };
        },
      };
    },
  },
  
  // Realtime (no-op)
  channel(_name: string) {
    return {
      on: () => this,
      subscribe: () => ({ error: null }),
    };
  },
  
  removeChannel: () => {},
};

// Market data methods
export const fakeMarketClient = {
  async getTickers() {
    await simulateLatency();
    log('Get tickers');
    return mockTickers;
  },
  
  async getTickerPrice(symbol: string) {
    await simulateLatency();
    log('Get ticker price:', symbol);
    return getMockTickerBySymbol(symbol);
  },
  
  async getChartData(symbol: string) {
    await simulateLatency();
    log('Get chart data:', symbol);
    return getMockChartData(symbol);
  },
  
  async getSignals(symbol?: string) {
    await simulateLatency();
    log('Get signals:', symbol);
    return symbol ? getMockSignalsForSymbol(symbol) : mockSignals;
  },
  
  async getPlans() {
    await simulateLatency();
    log('Get plans');
    return mockPlans;
  },
  
  async upgradeToPro() {
    await simulateLatency();
    log('Upgrade to PRO');
    
    const userId = localStorage.getItem('mock_user_id') || 'demo-user';
    const user = mockUserProfiles[userId];
    
    // Update user plan in memory (for this session)
    if (user) {
      user.subscription_tier = 'pro';
      user.is_pro = true;
      user.subscription_status = 'active';
      user.daily_message_limit = 1000;
    }
    
    // Trigger storage event to update UI
    window.dispatchEvent(new Event('storage'));
    
    return { success: true };
  },
};
