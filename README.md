# Web Template

A modern, production-ready web application template built with Next.js, TypeScript, Tailwind CSS, Supabase, and Hasura.

## 🚀 Features

- **Next.js 15** with App Router support (prepared for migration)
- **TypeScript** for type safety
- **Tailwind CSS v3** for styling
- **Supabase** for authentication (OTP-based)
- **Hasura** for GraphQL API and database migrations
- **Stripe** integration ready for payments
- **Shadcn UI** components
- **PostHog** analytics
- **Sentry** error tracking
- **Capacitor** for mobile app deployment
- **Dark mode** support
- **SEO optimized**

## 📋 Prerequisites

- Node.js 18+
- Yarn package manager
- Supabase account
- Hasura Cloud account (or self-hosted)
- Stripe account (optional)
- PostHog account (optional)

## 🛠️ Quick Start

1. **Clone the template**
   ```bash
   git clone https://github.com/yourusername/web-template.git my-app
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Run the setup script**
   ```bash
   node scripts/setup.js
   ```
   This will guide you through configuring your app name, tagline, and other settings.

4. **Set up environment variables**
   Copy the appropriate `.env` files and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

5. **Configure your services**
   - Set up Supabase project and add credentials
   - Set up Hasura project and add credentials
   - (Optional) Configure Stripe, PostHog, Sentry

6. **Run database migrations**
   ```bash
   yarn supabase:migrate:dev
   ```

7. **Start the development server**
   ```bash
   yarn dev
   ```

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router (future migration)
├── pages/            # Next.js Pages Router (current)
├── components/       # Reusable components
│   └── ui/          # Shadcn UI components
├── constants/        # App constants and configuration
│   └── config.ts    # Main configuration file
├── context/         # React context providers
├── gql/             # GraphQL queries and mutations
├── hooks/           # Custom React hooks
├── layouts/         # Page layouts
├── lib/             # Utility functions
├── services/        # External service integrations
│   ├── client/      # Client-side services
│   └── server/      # Server-side services
├── styles/          # Global styles
└── types/           # TypeScript types
```

## ⚙️ Configuration

### Main Configuration File

Edit `src/constants/config.ts` to customize:
- App name and branding
- Feature flags
- Theme settings
- File upload limits
- API configuration

### Theme Customization

1. **Colors**: Update CSS variables in `src/styles/globals.css`
2. **Fonts**: Update font imports in `src/pages/_app.tsx`
3. **Logo**: Replace files in `public/` directory

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Hasura
NEXT_PUBLIC_HASURA_GRAPHQL_API_URL=
HASURA_GRAPHQL_ADMIN_SECRET=

# Stripe (optional)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_API_KEY=
GOOGLE_ANALYTICS_ID=
```

## 🔧 Development

### Commands

```bash
# Development
yarn dev              # Start dev server
yarn build           # Build for production
yarn start           # Start production server

# Code Quality
yarn lint            # Run ESLint
yarn ts              # Type check
yarn prettier        # Format code

# Database
yarn codegen         # Generate GraphQL types
yarn supabase:migrate:dev    # Run migrations (dev)
yarn supabase:migrate:prod   # Run migrations (prod)

# Mobile
yarn build:mobile:dev   # Build for mobile (dev)
yarn build:mobile:prod  # Build for mobile (prod)
```

### Adding New Features

1. **Pages**: Add new files to `src/pages/`
2. **Components**: Create in `src/components/`
3. **API Routes**: Add to `src/app/api/`
4. **Database Tables**: 
   - Create migration in `hasura/migrations/`
   - Update metadata in `hasura/metadata/`
   - Run `yarn codegen` to generate types

## 📱 Mobile App

This template includes Capacitor for deploying as iOS/Android apps:

```bash
# Build for mobile
yarn build:mobile:prod

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio
npx cap open android
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted

## 📝 Customization Checklist

- [ ] Update `src/constants/config.ts` with your app details
- [ ] Replace logo files in `public/`
- [ ] Update theme colors in `src/styles/globals.css`
- [ ] Configure environment variables
- [ ] Set up authentication providers in Supabase
- [ ] Create your database schema
- [ ] Update `public/site.webmanifest`
- [ ] Update SEO meta tags
- [ ] Configure analytics and monitoring

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this template for any project.

## 🆘 Support

- [Documentation](https://github.com/yourusername/web-template/wiki)
- [Issues](https://github.com/yourusername/web-template/issues)
- [Discussions](https://github.com/yourusername/web-template/discussions)
