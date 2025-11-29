
// Supabase Integration for GoFriday
// 
// SETUP INSTRUCTIONS:
// 1. Enable Supabase by clicking the Supabase button in Natively
// 2. Connect to your Supabase project (create one at supabase.com if needed)
// 3. Run the SQL schema below in your Supabase SQL editor
// 4. The app will automatically connect once Supabase is enabled

/*
-- SQL SCHEMA FOR GOFRIDAY
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  moods JSONB DEFAULT '[]',
  impulses JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Impulses table
CREATE TABLE impulses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  baseline_score INTEGER DEFAULT 5,
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  impulse_id UUID REFERENCES impulses(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  intervention_id TEXT,
  rating INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers table
CREATE TABLE triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  impulse_id UUID REFERENCES impulses(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT NOT NULL,
  notes TEXT,
  mood INTEGER,
  environment TEXT
);

-- Commitments table
CREATE TABLE commitments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT DEFAULT 'light',
  accessibility JSONB DEFAULT '{}',
  soundscape BOOLEAN DEFAULT true,
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_impulses_user_id ON impulses(user_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_triggers_user_id ON triggers(user_id);
CREATE INDEX idx_triggers_timestamp ON triggers(timestamp);
CREATE INDEX idx_commitments_user_id ON commitments(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE impulses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for users to access their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own impulses" ON impulses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own impulses" ON impulses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own impulses" ON impulses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own impulses" ON impulses FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own triggers" ON triggers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own triggers" ON triggers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own triggers" ON triggers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own triggers" ON triggers FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own commitments" ON commitments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own commitments" ON commitments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own commitments" ON commitments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own commitments" ON commitments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON settings FOR UPDATE USING (auth.uid() = user_id);
*/

// Type definitions for database tables
export interface User {
  id: string;
  email: string;
  timezone: string;
  moods: string[];
  impulses: string[];
  created_at: string;
  updated_at: string;
}

export interface Impulse {
  id: string;
  user_id: string;
  name: string;
  baseline_score: number;
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  impulse_id: string | null;
  type: string;
  duration: number;
  intervention_id: string | null;
  rating: number | null;
  created_at: string;
}

export interface Trigger {
  id: string;
  user_id: string;
  impulse_id: string | null;
  timestamp: string;
  type: string;
  notes: string | null;
  mood: number | null;
  environment: string | null;
}

export interface Commitment {
  id: string;
  user_id: string;
  title: string;
  status: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  theme: string;
  accessibility: Record<string, any>;
  soundscape: boolean;
  notifications: boolean;
  created_at: string;
  updated_at: string;
}

// Database helper functions
// These will work once Supabase is enabled in Natively

export const supabaseHelpers = {
  // Log a session
  async logSession(data: {
    impulse_id?: string;
    type: string;
    duration: number;
    intervention_id?: string;
    rating?: number;
  }) {
    console.log('Logging session:', data);
    // Implementation will be added once Supabase is enabled
    // const { data: session, error } = await supabase
    //   .from('sessions')
    //   .insert([data])
    //   .select()
    //   .single();
    // return { session, error };
  },

  // Log a trigger
  async logTrigger(data: {
    impulse_id?: string;
    type: string;
    notes?: string;
    mood?: number;
    environment?: string;
  }) {
    console.log('Logging trigger:', data);
    // Implementation will be added once Supabase is enabled
  },

  // Update impulse progress
  async updateImpulseProgress(impulseId: string, progress: number) {
    console.log('Updating impulse progress:', impulseId, progress);
    // Implementation will be added once Supabase is enabled
  },

  // Get user sessions
  async getUserSessions(limit: number = 10) {
    console.log('Fetching user sessions');
    // Implementation will be added once Supabase is enabled
    return [];
  },

  // Get user triggers
  async getUserTriggers(limit: number = 10) {
    console.log('Fetching user triggers');
    // Implementation will be added once Supabase is enabled
    return [];
  },

  // Export user data (GDPR compliance)
  async exportUserData() {
    console.log('Exporting user data');
    // Implementation will be added once Supabase is enabled
    return {
      sessions: [],
      triggers: [],
      impulses: [],
      commitments: [],
      settings: {},
    };
  },

  // Delete user data (GDPR compliance)
  async deleteUserData() {
    console.log('Deleting user data');
    // Implementation will be added once Supabase is enabled
  },
};

export default supabaseHelpers;
