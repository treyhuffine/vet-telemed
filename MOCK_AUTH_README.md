# Mock Authentication Guide

## Overview
The application is configured to run in mock mode using `IS_MOCK = true` in `/src/constants/config.ts`. This prevents all Supabase API calls and uses local mock authentication.

## Key Changes

### 1. Mock Mode Configuration
- **Location**: `/src/constants/config.ts`
- **Setting**: `export const IS_MOCK = true;`
- **Purpose**: Disables all external API calls to Supabase

### 2. Authentication Flow
When `IS_MOCK = true`:
- **VetAuth Context** (`/src/context/VetAuth.tsx`) handles all authentication
- **Auth Context** (`/src/context/Auth.tsx`) skips Supabase initialization
- **Supabase clients** return mock responses for all methods

### 3. Mock User Accounts
Available in `/src/constants/mockAuth.ts`:

| Role | Email | Password | Name |
|------|-------|----------|------|
| Vet Tech | sarah.tech@example.com | demo123 | Sarah Thompson |
| Veterinarian | dr.johnson@example.com | demo123 | Dr. Emily Johnson |
| Admin | dr.chen@example.com | demo123 | Dr. Michael Chen |

### 4. Quick Login
The login screen shows "Quick Access" buttons for each role - no need to type credentials.

## How It Works

### Client-Side
All Supabase client creation functions check `IS_MOCK`:
- `/src/services/client/supabase/index.ts`
- Returns mock client with all auth methods stubbed

### Server-Side
All server-side Supabase functions check `IS_MOCK`:
- `/src/services/server/supabase/serverless.ts`
- `/src/services/server/supabase/edge.ts`
- `/src/services/server/supabase/rsc.ts`
- `/src/services/server/supabase/middleware.ts`

### Mock Client Methods
The mock client implements:
- `auth.signInWithOtp()` - Returns success without sending email
- `auth.signInWithPassword()` - Returns success for mock users
- `auth.getSession()` - Returns null session
- `auth.onAuthStateChange()` - Returns mock subscription
- All other auth methods return appropriate mock responses

## Switching to Production

To use real Supabase authentication:

1. Set `IS_MOCK = false` in `/src/constants/config.ts`
2. Ensure Supabase environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. The application will automatically use real authentication

## Benefits

- **No Network Calls**: Zero Supabase API requests in mock mode
- **Offline Development**: Work without internet connection
- **Fast Testing**: No authentication delays
- **Demo Ready**: Perfect for sales demonstrations
- **Easy Switch**: One flag toggles between mock and real auth