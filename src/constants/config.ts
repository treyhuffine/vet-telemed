/**
 * Main configuration file for the project.
 * Update these values to customize your application.
 */

export const IS_MOCK = true;

// =======================
// App Information
// =======================
export const APP_CONFIG = {
  // Basic app information
  name: 'YourApp',
  tagline: 'Your tagline here',
  description: 'Your app description for SEO',

  // Email addresses
  publicEmail: 'hello@example.com',
  supportEmail: 'support@example.com',

  // App store links (leave empty if not applicable)
  iosAppStoreLink: '',
  androidPlayStoreLink: '',

  // Social media links (optional)
  social: {
    twitter: '',
    github: '',
    linkedin: '',
  },
};

// =======================
// Theme Configuration
// =======================
export const THEME_CONFIG = {
  // Font configuration
  fonts: {
    // Update font imports in _app.tsx if you change these
    body: 'Inter',
    title: 'Poppins',
  },

  // Brand colors (update CSS variables in globals.css)
  colors: {
    // Primary brand color
    primary: '#3b82f6', // Blue as default
    // Add more brand colors as needed
  },

  // Logo paths
  logo: {
    main: '/logo.png',
    full: '/logo-full.png',
  },

  // Default border radius
  borderRadius: '0.5rem',
};

// =======================
// SEO & Meta Tags
// =======================
export const SEO_CONFIG = {
  // Default meta tags
  defaultTitle: APP_CONFIG.name,
  titleTemplate: `%s | ${APP_CONFIG.name}`,
  defaultDescription: APP_CONFIG.description,

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    site_name: APP_CONFIG.name,
    defaultImage: '/og.png',
  },

  // Twitter
  twitter: {
    handle: '@yourhandle',
    site: '@yoursite',
    cardType: 'summary_large_image',
  },
};

// =======================
// Feature Flags
// =======================
export const FEATURES = {
  // Authentication features
  auth: {
    enableSignup: true,
    enableLogin: true,
    enableOTP: true,
    enableEmailPassword: false,
    enableSocialLogin: false,
  },

  // Payment features
  payments: {
    enabled: false,
    provider: 'stripe' as 'stripe' | 'paddle' | 'lemonsqueezy',
  },

  // Analytics
  analytics: {
    posthog: true,
    googleAnalytics: true,
  },

  // Other features
  blog: false,
  chat: false,
  fileUpload: true,
};

// =======================
// File Upload Configuration
// =======================
export const FILE_UPLOAD_CONFIG = {
  maxFiles: 5,
  maxFileSizeMB: 15,
  maxFileSize: 15 * 1024 * 1024, // 15MB in bytes
  filePath: 'users',
  fileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  get fileTypesAccept() {
    return this.fileTypes.join(',');
  },
};

// =======================
// API Configuration
// =======================
export const API_CONFIG = {
  // API timeouts
  timeout: 30000, // 30 seconds

  // Rate limiting
  rateLimiting: {
    enabled: true,
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  },
};

// =======================
// Mobile App Configuration
// =======================
export const MOBILE_CONFIG = {
  // Viewports
  appViewport: 'viewport-fit=cover, width=device-width, initial-scale=1, maximum-scale=1',
  webViewport: 'width=device-width, initial-scale=1',

  // Deep linking
  deepLinkScheme: 'yourapp://',
  universalLinkDomain: 'yourapp.com',
};

// =======================
// Third-party Services
// =======================
export const SERVICES_CONFIG = {
  // Add your service-specific configurations here
  supabase: {
    // Configured via environment variables
  },
  stripe: {
    // Configured via environment variables
  },
  hasura: {
    // Configured via environment variables
  },
};

// =======================
// Helper Functions
// =======================
export const generateBrandTitle = (title?: string) =>
  title ? `${title} | ${APP_CONFIG.name}` : APP_CONFIG.name;

export const getDataSecurityDescription = () => '🔒 All data is protected by bank-level security.';
