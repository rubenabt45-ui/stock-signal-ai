
// Production-safe logging utility
const createLogger = () => {
  const isProduction = import.meta.env.PROD;
  
  return {
    log: (...args: any[]) => {
      if (!isProduction) console.log(...args);
    },
    debug: (...args: any[]) => {
      if (!isProduction) console.debug(...args);
    },
    warn: (...args: any[]) => {
      if (!isProduction) console.warn(...args);
    },
    error: (...args: any[]) => {
      // Always log errors, even in production
      console.error(...args);
    },
    info: (...args: any[]) => {
      if (!isProduction) console.log(...args);
    }
  };
};

export const logger = createLogger();
