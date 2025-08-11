
import { useToast } from '@/hooks/use-toast';
import { errorLogger } from '@/utils/errorLogging';

export const useAuthErrorHandling = () => {
  const { toast } = useToast();

  const handleAuthError = (error: any, context: string) => {
    const message = error?.message || 'An unexpected error occurred';
    
    // Log the error
    errorLogger.logError(
      error instanceof Error ? error : new Error(message),
      { action: context, metadata: { originalError: error } }
    );

    // User-friendly error messages
    const userMessage = getUserFriendlyMessage(message);
    
    toast({
      title: "Authentication Error",
      description: userMessage,
      variant: "destructive",
    });
  };

  const getUserFriendlyMessage = (errorMessage: string): string => {
    if (errorMessage.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    
    if (errorMessage.includes('User already registered')) {
      return 'An account with this email already exists. Please sign in instead.';
    }
    
    if (errorMessage.includes('Email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    
    if (errorMessage.includes('Password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
    
    if (errorMessage.includes('Unable to validate email address')) {
      return 'Please enter a valid email address.';
    }
    
    if (errorMessage.includes('Network')) {
      return 'Connection error. Please check your internet connection and try again.';
    }
    
    return 'Something went wrong. Please try again or contact support if the problem persists.';
  };

  return { handleAuthError };
};
