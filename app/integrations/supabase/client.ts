
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = 'https://tcmcetpfdgpujayjbzrs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbWNldHBmZGdwdWpheWpienJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDcyODgsImV4cCI6MjA3OTkyMzI4OH0.iKU8zDM9MCUdubUsaA5DY2Ns_y1SPKfKzbQDXh_cSG0';

// Lazy initialization to avoid "window is not defined" errors during build
let supabaseInstance: SupabaseClient | null = null;
let isInitializing = false;
let initializationPromise: Promise<SupabaseClient> | null = null;

function getSupabaseClient(): SupabaseClient {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // If initialization is in progress, throw an error
  if (isInitializing) {
    throw new Error('Supabase client is still initializing. Please wait.');
  }

  try {
    isInitializing = true;

    // Create the client with proper configuration
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        // Disable flow type for React Native
        flowType: 'implicit',
      },
    });

    console.log('Supabase client initialized successfully');
    return supabaseInstance;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

// Async initialization function for use in async contexts
async function initializeSupabaseAsync(): Promise<SupabaseClient> {
  // Return existing instance if available
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // If initialization is already in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start new initialization
  initializationPromise = new Promise((resolve, reject) => {
    try {
      const client = getSupabaseClient();
      resolve(client);
    } catch (error) {
      reject(error);
    } finally {
      initializationPromise = null;
    }
  });

  return initializationPromise;
}

// Export a proxy object that lazily initializes the client
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    // Special handling for common properties
    if (prop === 'then' || prop === 'catch' || prop === 'finally') {
      // Don't treat the proxy as a Promise
      return undefined;
    }

    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    
    // Bind methods to the client instance
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    return value;
  },
});

// Export a function to check if Supabase is ready
export function isSupabaseReady(): boolean {
  return supabaseInstance !== null;
}

// Export a function to manually initialize Supabase (useful for testing)
export function initializeSupabase(): SupabaseClient {
  return getSupabaseClient();
}

// Export async initialization
export { initializeSupabaseAsync };
