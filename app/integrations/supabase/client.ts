
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tcmcetpfdgpujayjbzrs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjbWNldHBmZGdwdWpheWpienJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDcyODgsImV4cCI6MjA3OTkyMzI4OH0.iKU8zDM9MCUdubUsaA5DY2Ns_y1SPKfKzbQDXh_cSG0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
