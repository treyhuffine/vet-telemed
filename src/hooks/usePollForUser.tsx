import { useCallback } from 'react';
import * as Sentry from '@sentry/nextjs';
import { User } from '@supabase/supabase-js';
import { GetViewerByIdQuery, useGetViewerByIdLazyQuery } from '@/types/generated/client/hooks';

const POLL_TIME_MS = 250;
const ONE_MINUTE = 60 * 1000;
const MAX_POLLS = ONE_MINUTE / POLL_TIME_MS;

export function usePollForUser() {
  const [getViewerById] = useGetViewerByIdLazyQuery();

  const pollForUser = useCallback(
    async (user: User | null) => {
      if (!user?.id) {
        return Promise.reject(new Error('Did not have a valid user ID'));
      }

      let requestMade = 0;
      let success = false;

      const makeQuery = async (
        resolve: (value: GetViewerByIdQuery['usersByPk']) => void,
        reject: (reason?: any) => void,
      ) => {
        requestMade = requestMade + 1;

        if (requestMade === MAX_POLLS) {
          return reject(new Error('User poll timed out'));
        }

        try {
          const { data, error } = await getViewerById({
            variables: { id: user.id },
            fetchPolicy: 'no-cache',
          });

          if (error) {
            Sentry.captureException(error);
            return reject(error);
          }

          if (data?.usersByPk) {
            success = true;
            resolve(data.usersByPk);
          } else if (!success) {
            setTimeout(() => makeQuery(resolve, reject), POLL_TIME_MS);
          }
        } catch (error) {
          reject(error);
        }
      };

      return new Promise(makeQuery);
    },
    [getViewerById],
  );

  return pollForUser;
}
