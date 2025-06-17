# Template Guide

This document explains how to use this web template to quickly create new projects.

## What's Included

### Core Features
- **Authentication**: Supabase-based OTP authentication (no passwords)
- **Database**: Hasura GraphQL with auto-generated TypeScript types
- **UI Components**: Shadcn UI components pre-configured
- **Styling**: Tailwind CSS with custom theme system
- **Analytics**: PostHog integration
- **Payments**: Stripe integration ready
- **Mobile**: Capacitor for iOS/Android deployment
- **Chat**: Optional chat interface with file uploads

### Pre-configured Services
- Supabase for auth and realtime
- Hasura for GraphQL API
- Cloudflare R2 for file storage
- Sentry for error tracking
- PostHog for analytics

## Customization Steps

### 1. Initial Setup
Run the setup script to configure basic settings:
```bash
node scripts/setup.js
```

### 2. Update Configuration
Edit `src/constants/config.ts`:
- App name, tagline, description
- Email addresses
- Feature flags (enable/disable features)
- File upload settings

### 3. Theme Customization

#### Colors
Replace the template colors in `src/styles/globals.css` or use the provided `globals.template.css` as a starting point.

#### Fonts
Update font imports in `src/pages/_app.tsx`:
```typescript
const body = Inter({ ... })     // Your body font
const title = Poppins({ ... })   // Your title font
```

#### Logo
Replace these files in `public/`:
- `logo.png` - Square logo icon
- `logo-full.png` - Full horizontal logo
- `og.png` - Open Graph image (1200x630)
- `icons/*` - App icons for different sizes

### 4. Database Schema

#### Using Template Schema
The template includes a basic schema with:
- Users table
- Chat threads and messages (if using chat feature)
- File uploads tracking

#### Creating Custom Schema
1. Create new migrations in `hasura/migrations/default/`
2. Update metadata in `hasura/metadata/`
3. Run `yarn codegen` to generate TypeScript types

### 5. Environment Variables
Create `.env.local`, `.env.dev`, and `.env.prod` from `.env.example` and fill in your service credentials.

### 6. Feature Toggles
Enable/disable features in `src/constants/config.ts`:
```typescript
export const FEATURES = {
  auth: {
    enableSignup: true,
    enableLogin: true,
    enableOTP: true,
  },
  payments: {
    enabled: false,
    provider: 'stripe',
  },
  chat: false,
  blog: false,
  fileUpload: true,
};
```

## Removing Unused Features

### Chat Feature
If not using chat:
1. Set `FEATURES.chat = false` in config
2. Remove chat-related tables from migrations
3. Delete `src/context/Chat`
4. Remove `ChatModal` and `ChatHistorySheet` components

### Blog Feature
If not using blog:
1. Set `FEATURES.blog = false` in config
2. Delete `src/pages/blog/`
3. Remove Sanity configuration files

### Payments
If not using payments:
1. Set `FEATURES.payments.enabled = false` in config
2. Remove Stripe environment variables
3. Delete payment-related API routes

## Common Patterns

### Adding a New Page
```typescript
// src/pages/my-page.tsx
import { NextPage } from 'next';
import { Page } from '@/components/utils/Page';
import { MainLayout } from '@/layouts/MainLayout';

const MyPage: NextPage = () => {
  return (
    <Page title="My Page" description="Page description">
      <MainLayout>
        {/* Your content */}
      </MainLayout>
    </Page>
  );
};

export default MyPage;
```

### Adding API Routes
```typescript
// src/app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuthRequired } from '@/lib/server/edge/middleware/withAuthRequired';

export const POST = withAuthRequired(async (req: NextRequest, viewer) => {
  // Your logic here
  return NextResponse.json({ success: true });
});
```

### Adding Database Tables
1. Create migration:
```sql
-- hasura/migrations/default/[timestamp]_create_my_table/up.sql
CREATE TABLE public.my_table (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    -- your columns
    CONSTRAINT my_table_pkey PRIMARY KEY (id),
    CONSTRAINT my_table_user_id_fkey FOREIGN KEY (user_id) 
        REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
```

2. Add metadata and run `yarn codegen`

## Deployment Checklist

- [ ] Update all configuration in `src/constants/config.ts`
- [ ] Replace all logo and icon files
- [ ] Update theme colors
- [ ] Set up all required environment variables
- [ ] Configure Supabase authentication
- [ ] Set up Hasura permissions
- [ ] Update `public/site.webmanifest`
- [ ] Test authentication flow
- [ ] Configure custom domain
- [ ] Set up monitoring and analytics

## Tips

1. **Start Small**: Begin with core features and add complexity as needed
2. **Use Feature Flags**: Toggle features on/off during development
3. **Type Safety**: Always run `yarn codegen` after database changes
4. **Mobile First**: Design with mobile in mind if planning to deploy as app
5. **Keep Dependencies Updated**: Regularly update packages for security

## Need Help?

- Check the example implementations in the codebase
- Review the TypeScript types for available options
- Use the provided UI components from Shadcn
- Follow Next.js best practices for performance