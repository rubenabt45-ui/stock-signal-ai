import { MOCK_CONFIG } from '@/config/runtime';
import { getCurrentMockUser, mockUserProfiles, MockUserProfile } from '@/mocks/userProfile';
import { mockTickers } from '@/mocks/tickers';

const simulateLatency = () => 
  new Promise(resolve => setTimeout(resolve, MOCK_CONFIG.simulatedLatency));

const log = (...args: any[]) => {
  if (MOCK_CONFIG.enableDebugLogs) {
    console.log('[FakeClient]', ...args);
  }
};

// Chainable query builder
class MockQueryBuilder {
  private _table: string;
  private _data: any;
  
  constructor(table: string) {
    this._table = table;
  }
  
  select(_columns: string = '*') {
    return this;
  }
  
  insert(data: any) {
    this._data = data;
    return this;
  }
  
  update(data: any) {
    this._data = data;
    return this;
  }
  
  upsert(data: any, _options?: any) {
    this._data = data;
    return this;
  }
  
  delete() {
    return this;
  }
  
  eq(_column: string, _value: any) {
    return this;
  }
  
  single() {
    return this;
  }
  
  maybeSingle() {
    return this;
  }
  
  order(_column: string, _options?: any) {
    return this;
  }
  
  limit(_count: number) {
    return this;
  }
  
  async then(resolve: (value: any) => void) {
    await simulateLatency();
    
    const table = this._table;
    log('Query:', table);
    
    // Return appropriate data based on table
    if (table === 'user_profiles' || table === 'profiles') {
      resolve({ data: getCurrentMockUser(), error: null });
    } else if (table === 'watchlist_items' || table === 'user_favorites') {
      resolve({
        data: mockTickers.slice(0, 3).map((t, i) => ({
          id: `fav-${i}`,
          symbol: t.symbol,
          display_name: t.name,
          asset_type: 'stock',
          user_id: getCurrentMockUser().id,
        })),
        error: null
      });
    } else {
      resolve({ data: this._data || [], error: null });
    }
  }
}

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
    
    async getUser() {
      await simulateLatency();
      const isLoggedIn = localStorage.getItem('mock_logged_in') === 'true';
      if (!isLoggedIn) {
        return { data: { user: null }, error: null };
      }
      const user = getCurrentMockUser();
      return { data: { user: { id: user.id, email: user.email } }, error: null };
    },
    
    async signIn(email: string, _password: string) {
      await simulateLatency();
      log('Sign in:', email);
      
      const user = Object.values(mockUserProfiles).find(u => u.email === email) || mockUserProfiles['demo-user'];
      
      localStorage.setItem('mock_logged_in', 'true');
      localStorage.setItem('mock_user_id', user.id);
      
      return { error: null, data: { session: { user: { id: user.id, email: user.email } } } };
    },
    
    async signInWithPassword(credentials: { email: string; password: string }) {
      return this.signIn(credentials.email, credentials.password);
    },
    
    async signUp(emailOrOptions: string | { email: string; password: string; options?: any }, _password?: string, options?: any) {
      await simulateLatency();
      
      let email: string;
      let password: string;
      let opts: any;
      
      if (typeof emailOrOptions === 'object') {
        email = emailOrOptions.email;
        password = emailOrOptions.password;
        opts = emailOrOptions.options;
      } else {
        email = emailOrOptions;
        password = _password || '';
        opts = options;
      }
      
      log('Sign up:', email);
      
      localStorage.setItem('mock_logged_in', 'true');
      localStorage.setItem('mock_user_id', 'demo-user');
      
      const user = { id: 'demo-user', email, email_confirmed_at: null };
      return { error: null, data: { user, session: null } };
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
      return { error: null, data: {} };
    },
    
    async resetPasswordForEmail(_email: string, _options?: any) {
      await simulateLatency();
      log('Reset password for email');
      return { error: null, data: {} };
    },
    
    async updatePassword(_password: string) {
      await simulateLatency();
      log('Update password');
      return { error: null, data: { user: null } };
    },
    
    async updateUser(_data: any) {
      await simulateLatency();
      log('Update user');
      return { data: { user: getCurrentMockUser() }, error: null };
    },
    
    async setSession(tokenOrOptions: string | { access_token: string; refresh_token: string }, refresh_token?: string) {
      await simulateLatency();
      log('Set session (fake)');
      
      let access_token: string;
      let refresh: string | undefined;
      
      if (typeof tokenOrOptions === 'object') {
        access_token = tokenOrOptions.access_token;
        refresh = tokenOrOptions.refresh_token;
      } else {
        access_token = tokenOrOptions;
        refresh = refresh_token;
      }
      
      const session = { access_token, refresh_token: refresh, user: getCurrentMockUser() };
      return { data: { session, user: getCurrentMockUser() }, error: null };
    },
    
    async verifyOtp(_params: any) {
      await simulateLatency();
      log('Verify OTP (fake)');
      return { data: { session: null }, error: null };
    },
    
    async resend(_params: any) {
      await simulateLatency();
      log('Resend (fake)');
      return { error: null, data: {} };
    },
    
    async signInWithOAuth(_params: any) {
      await simulateLatency();
      log('Sign in with OAuth (fake)');
      return { error: null, data: {} };
    },

    onAuthStateChange(callback: (event: string, session: any) => void) {
      const checkAuth = () => {
        const isLoggedIn = localStorage.getItem('mock_logged_in') === 'true';
        const userId = localStorage.getItem('mock_user_id') || 'demo-user';
        const user = mockUserProfiles[userId];
        
        callback(
          isLoggedIn ? 'SIGNED_IN' : 'SIGNED_OUT',
          isLoggedIn ? { user: { id: user.id, email: user.email } } : null
        );
      };
      
      setTimeout(checkAuth, 0);
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
  
  // User profile methods
  user: {
    async getProfile() {
      await simulateLatency();
      log('Get profile');
      return { data: getCurrentMockUser(), error: null };
    },
    
    async updateProfile(updates: Partial<MockUserProfile>) {
      await simulateLatency();
      log('Update profile:', updates);
      
      const userId = localStorage.getItem('mock_user_id') || 'demo-user';
      const currentUser = mockUserProfiles[userId];
      
      if (currentUser) {
        Object.assign(currentUser, updates);
      }
      
      window.dispatchEvent(new Event('storage'));
      return { data: currentUser, error: null };
    },
  },
  
  // Mock database with chainable methods
  from(table: string) {
    return new MockQueryBuilder(table);
  },
  
  // Storage methods (no-op)
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
        case 'create-checkout-session':
          return {
            data: { url: 'https://checkout.stripe.com/mock', sessionId: 'mock_session_id' },
            error: null,
          };
        case 'customer-portal':
          return {
            data: { url: 'https://billing.stripe.com/mock' },
            error: null,
          };
        case 'get-checkout-session':
          return {
            data: { 
              id: 'mock_session_id',
              status: 'complete',
              amount_total: 2900,
              payment_status: 'paid'
            },
            error: null,
          };
        default:
          return { data: {}, error: null };
      }
    },
  },
  
  // Realtime (no-op)
  channel(_name: string) {
    return {
      on: () => ({ subscribe: () => ({ error: null }) }),
      subscribe: () => ({ error: null }),
    };
  },
  
  removeChannel: () => {},
};

// Export for backwards compatibility
export const supabase = fakeClient;
