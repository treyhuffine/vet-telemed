export const ROOT_PAGE_URL = '/';
export const CHAT_PAGE_URL = '/chat';
export const BLOG_PAGE_URL = '/blog';
export const ABOUT_PAGE_URL = '/about';
export const PRICING_PAGE_URL = '/pricing';
export const LOGIN_PAGE_URL = '/login';
export const SIGNUP_PAGE_URL = '/signup';
export const ONBOARD_PAGE_URL = '/onboard';
export const ONBOARD_QUERY_PARAM = 'onboard';
export const LOGOUT_PAGE_URL = '/logout';
export const PRIVACY_PAGE_URL = '/privacy';

// Helper functions
export const getBlogPostPageUrl = (slug: string) => `${BLOG_PAGE_URL}/${slug}`;
export const getChatPageUrl = (uuid: string) => `${CHAT_PAGE_URL}/${uuid}`;
