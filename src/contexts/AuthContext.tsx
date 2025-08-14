
// Direct re-export from the auth provider to maintain backward compatibility
// This ensures we're using the exact same context instance
export { AuthProvider, useAuth } from './auth/auth.provider';
export type { AuthState } from './auth/auth.state';
export type { AuthActions } from './auth/auth.actions';
