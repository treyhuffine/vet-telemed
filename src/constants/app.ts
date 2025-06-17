import {
  APP_CONFIG,
  FILE_UPLOAD_CONFIG,
  MOBILE_CONFIG,
  getDataSecurityDescription,
} from './config';

// Re-export from config for backward compatibility
export {
  APP_CONFIG,
  FILE_UPLOAD_CONFIG,
  MOBILE_CONFIG,
  generateBrandTitle,
  getDataSecurityDescription,
} from './config';

// Legacy exports - these map to the new config structure
export const APP_NAME = APP_CONFIG.name;
export const APP_TAGLINE = APP_CONFIG.tagline;
export const APP_TAGLINE_TITLE_CASE = APP_TAGLINE.split(' ')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
export const DATA_SECURITY_DESCRIPTION = getDataSecurityDescription();
export const MIN_THREADS_FOR_CALLOUT = 1;
export const getShouldCallOutDescription = (threads?: any[]) => {
  return !!threads?.length && threads.length >= MIN_THREADS_FOR_CALLOUT;
};

export const PUBLIC_EMAIL = APP_CONFIG.publicEmail;
export const SUPPORT_EMAIL = APP_CONFIG.supportEmail;
export const IOS_APP_STORE_LINK = APP_CONFIG.iosAppStoreLink;
export const ANDROID_PLAY_STORE_LINK = APP_CONFIG.androidPlayStoreLink;

export const APP_VIEWPORT = MOBILE_CONFIG.appViewport;
export const WEB_VIEWPORT = MOBILE_CONFIG.webViewport;

export const APP_DESCRIPTION = APP_CONFIG.description;

export const MAX_FILES = FILE_UPLOAD_CONFIG.maxFiles;
export const MAX_FILE_SIZE_MB = FILE_UPLOAD_CONFIG.maxFileSizeMB;
export const MAX_FILE_SIZE = FILE_UPLOAD_CONFIG.maxFileSize;
export const FILE_PATH = FILE_UPLOAD_CONFIG.filePath;
export const FILE_TYPES = FILE_UPLOAD_CONFIG.fileTypes;
export const FILE_TYPES_ACCEPT = FILE_UPLOAD_CONFIG.fileTypesAccept;
