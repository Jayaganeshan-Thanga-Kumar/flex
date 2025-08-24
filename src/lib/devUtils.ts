// Development configuration to suppress known warnings
// This file helps improve the development experience

// You can safely ignore these browser extension warnings:
// - ContentDispatcherService warnings (from browser extensions)
// - React DevTools suggestions (install browser extension for better debugging)

// If you see any new hydration warnings, check:
// 1. No Math.random() or Date.now() in render
// 2. No window/document access during SSR  
// 3. Consistent date formatting between server/client
// 4. No dynamic content that differs between renders

export const isDevelopment = process.env.NODE_ENV === 'development';

// Utility to suppress hydration warnings for known safe cases
export function suppressHydrationWarning(condition: boolean = true) {
  return condition ? { suppressHydrationWarning: true } : {};
}
