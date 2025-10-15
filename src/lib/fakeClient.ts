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
      
      const user = Object.values(mockUserProfiles).find(u => u.email === email) || mockUserProfiles['demo-user'];
      
      localStorage.setItem('mock_logged_in', 'true');
      localStorage.setItem('mock_user_id', user.id);
      
      return { error: null, data: { session: { user: { id: user.id, email: user.email } } } };
    },
    
    async signUp(email: string, _password: string, _fullName?: string) {
      await simulateLatency();
      log('Sign up:', email);
      
      localStorage.setItem('mock_logged_in', 'true');
      localStorage.setItem('mock_user_id', 'demo-user');
      
      return { error: null, data: { user: { id: 'demo-user', email } } };
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
  
  // Mock database methods  
  from(_table: string) {
    return {
      async select(_columns: string = '*') {
        await simulateLatency();
        log('Select from', _table);
        
        if (_table === 'user_profiles' || _table === 'profiles') {
          return { data: [getCurrentMockUser()], error: null };
        }
        if (_table === 'watchlist_items' || _table === 'user_favorites') {
          return { 
            data: mockTickers.slice(0, 3).map((t, i) => ({
              id: `fav-${i}`,
              symbol: t.symbol,
              display_name: t.name,
              asset_type: 'stock',
              user_id: getCurrentMockUser().id,
            })), 
            error: null 
          };
        }
        return { data: [], error: null };
      },
      
      insert(_data: any) {
        return {
          async select() {
            await simulateLatency();
            log('Insert into', _table, _data);
            return { data: _data, error: null };
          },
        };
      },
      
      update(_data: any) {
        return {
          eq: (_column: string, _value: any) => ({
            async select() {
              await simulateLatency();
              log('Update', _table, _data);
              return { data: _data, error: null };
            },
          }),
        };
      },
      
      upsert(_data: any) {
        return {
          async select() {
            await simulateLatency();
            log('Upsert into', _table, _data);
            return { data: _data, error: null };
          },
        };
      },
      
      delete() {
        return {
          eq: (_column: string, _value: any) => ({
            async select() {
              await simulateLatency();
              log('Delete from', _table);
              return { error: null };
            },
          }),
        };
      },
      
      eq: (_column: string, _value: any) => ({
        async select() {
          await simulateLatency();
          return { data: [], error: null };
        },
        single: async () => {
          await simulateLatency();
          return { data: null, error: null };
        },
      }),
      
      async single() {
        await simulateLatency();
        return { data: getCurrentMockUser(), error: null };
      },
    };
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
  
  // Functions (no-op)
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
