
# GoFriday - Supabase Backend Setup Guide

## Overview
GoFriday uses Supabase as its backend for storing user data, sessions, triggers, and settings. This guide will help you set up the database.

## Prerequisites
1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created
3. Natively app with Supabase integration enabled

## Setup Steps

### 1. Enable Supabase in Natively
- Click the **Supabase** button in Natively
- Connect to your Supabase project
- Enter your project URL and anon key

### 2. Run the Database Schema
Open your Supabase project dashboard and navigate to the SQL Editor. Copy and paste the schema from `lib/supabase.ts` (the commented SQL section) and execute it.

The schema creates the following tables:
- **users**: User profiles with email, timezone, moods, and impulses
- **impulses**: User-specific impulse tracking with baseline scores and progress
- **sessions**: Completed intervention sessions with duration and ratings
- **triggers**: Logged trigger events with mood, environment, and notes
- **commitments**: User commitments with status and due dates
- **settings**: User preferences for theme, accessibility, and notifications

### 3. Data Model

#### Users
- `id`: UUID (primary key)
- `email`: Text (unique)
- `timezone`: Text (default: 'UTC')
- `moods`: JSONB array
- `impulses`: JSONB array
- `created_at`, `updated_at`: Timestamps

#### Impulses
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to users)
- `name`: Text (e.g., 'smoking', 'gym', 'overeating')
- `baseline_score`: Integer (1-10)
- `progress`: Integer (0-100)
- `created_at`, `updated_at`: Timestamps

#### Sessions
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to users)
- `impulse_id`: UUID (foreign key to impulses, nullable)
- `type`: Text (e.g., 'micro', 'short', 'plan')
- `duration`: Integer (seconds)
- `intervention_id`: Text (nullable)
- `rating`: Integer (1-5, nullable)
- `created_at`: Timestamp

#### Triggers
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to users)
- `impulse_id`: UUID (foreign key to impulses, nullable)
- `timestamp`: Timestamp
- `type`: Text (trigger type)
- `notes`: Text (nullable)
- `mood`: Integer (1-10, nullable)
- `environment`: Text (nullable)

#### Commitments
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to users)
- `title`: Text
- `status`: Text (default: 'active')
- `due_date`: Date (nullable)
- `created_at`, `updated_at`: Timestamps

#### Settings
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to users, unique)
- `theme`: Text (default: 'light')
- `accessibility`: JSONB object
- `soundscape`: Boolean (default: true)
- `notifications`: Boolean (default: true)
- `created_at`, `updated_at`: Timestamps

### 4. Security & Privacy

#### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only access their own data.

#### GDPR Compliance
- **Data Export**: Use `supabaseHelpers.exportUserData()` to export all user data
- **Data Deletion**: Use `supabaseHelpers.deleteUserData()` to delete all user data
- **Encryption**: Sensitive notes are encrypted at rest by Supabase

#### Local-First Cache
The app uses local storage for offline functionality and syncs with Supabase when online.

### 5. Push Notifications
To enable push notifications:
1. Set up Expo Push Notifications in your app
2. Store push tokens in the users table
3. Use Supabase Edge Functions to send notifications

Example notification triggers:
- "Friday Calm Reminder" (daily at user's preferred time)
- Streak milestones (3, 7, 14, 30 days)
- Commitment due date reminders

### 6. Integrations

#### Step Counter (for Gym Activation)
- Use device health APIs to read step count
- Log steps in sessions table when gym intervention is completed

#### Screen Time (for Scrolling Impulse)
- Use device screen time APIs (iOS: Screen Time API, Android: UsageStatsManager)
- Track app usage and correlate with scrolling impulse triggers

### 7. Testing
Test the following scenarios:
- User registration and profile creation
- Logging sessions and triggers
- Offline mode (local cache)
- Data export and deletion
- Push notifications

### 8. Deployment Checklist
- [ ] Database schema executed
- [ ] RLS policies verified
- [ ] Authentication configured
- [ ] Push notifications set up
- [ ] Privacy policy updated
- [ ] GDPR compliance verified
- [ ] Offline mode tested
- [ ] Data export/delete tested

## Support
For issues or questions:
- Check Supabase documentation: https://supabase.com/docs
- Review the code in `lib/supabase.ts`
- Contact support through Natively

## Privacy Policy Template
A privacy policy template is included in the app that covers:
- Data collection and usage
- User rights (access, export, deletion)
- Data security measures
- Third-party services (Supabase)
- Contact information

Update the template with your specific details before publishing.
