
import { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  session: null,
  loading: true,
};

export type AuthAction =
  | { type: 'SET_SESSION'; session: Session | null }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'RESET' };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_SESSION':
      return {
        ...state,
        session: action.session,
        user: action.session?.user ?? null,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      };
    case 'RESET':
      return initialAuthState;
    default:
      return state;
  }
}
