#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setup() {
  console.log('\n🚀 Welcome to the Web Template Setup!\n');
  console.log('This script will help you configure your new project.\n');

  // Get project details
  const appName = await question('What is your app name? (e.g., MyApp): ');
  const appTagline = await question('What is your app tagline? ');
  const appDescription = await question('What is your app description (for SEO)? ');
  const publicEmail = await question('Public email address? (e.g., hello@example.com): ');
  const supportEmail = await question('Support email address? (e.g., support@example.com): ');
  
  // Update config.ts
  const configPath = path.join(__dirname, '../src/constants/config.ts');
  let configContent = fs.readFileSync(configPath, 'utf8');
  
  configContent = configContent
    .replace("name: 'YourApp'", `name: '${appName}'`)
    .replace("tagline: 'Your tagline here'", `tagline: '${appTagline}'`)
    .replace("description: 'Your app description for SEO'", `description: '${appDescription}'`)
    .replace("publicEmail: 'hello@example.com'", `publicEmail: '${publicEmail}'`)
    .replace("supportEmail: 'support@example.com'", `supportEmail: '${supportEmail}'`);
  
  fs.writeFileSync(configPath, configContent);
  
  // Update package.json
  const packagePath = path.join(__dirname, '../package.json');
  let packageContent = fs.readFileSync(packagePath, 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  const appNameSlug = appName.toLowerCase().replace(/\s+/g, '-');
  packageJson.name = appNameSlug;
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  // Create environment files if they don't exist
  const envExample = `# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_REF=your_supabase_ref
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Configuration
APP_URL=http://localhost:3000
APP_ENV=development
APP_STAGE=development
TARGET_PLATFORM=web

# Hasura
NEXT_PUBLIC_HASURA_GRAPHQL_API_URL=your_hasura_url
HASURA_GRAPHQL_ADMIN_SECRET=your_hasura_secret
HASURA_GRAPHQL_JWT_SECRET=your_jwt_secret

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Analytics (optional)
NEXT_PUBLIC_POSTHOG_API_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_API_HOST=https://app.posthog.com
GOOGLE_ANALYTICS_ID=your_ga_id

# Cloudflare R2 (optional)
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_PUBLIC_URL=your_public_url

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_token
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
`;

  if (!fs.existsSync('.env.local')) {
    fs.writeFileSync('.env.local', envExample);
  }
  if (!fs.existsSync('.env.dev')) {
    fs.writeFileSync('.env.dev', envExample);
  }
  if (!fs.existsSync('.env.prod')) {
    fs.writeFileSync('.env.prod', envExample);
  }

  console.log('\n✅ Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Update your environment variables in .env.local, .env.dev, and .env.prod');
  console.log('2. Update your theme colors in src/styles/globals.css');
  console.log('3. Add your logo files to public/logo.png and public/logo-full.png');
  console.log('4. Run "yarn dev" to start developing!\n');

  rl.close();
}

setup().catch(console.error);