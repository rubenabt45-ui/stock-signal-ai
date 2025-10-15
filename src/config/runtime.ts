// Frontend-only mode flag - Set to true to use mock data instead of real backend
export const FRONTEND_ONLY = false; // Default: use real Supabase backend

// Mock configuration (only used when FRONTEND_ONLY = true)
export const MOCK_CONFIG = {
  simulatedLatency: 500, // ms
  enableDebugLogs: true,
};
