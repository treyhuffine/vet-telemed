import { User } from '@supabase/supabase-js';

/**
 * @note this is a heuristic to check if the user is new
 * @note we should use the database to check if the user is new
 */
export const getIsNewUserAuth = (user?: User | null) => {
  if (!user) {
    return false;
  }

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const userCreatedAt = new Date(user.created_at);

  return userCreatedAt && userCreatedAt >= fiveMinutesAgo;
};
