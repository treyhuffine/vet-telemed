import { useState } from 'react';
import { RequestStatus } from '@/constants/requests';

export { RequestStatus };

export const useRequestStatus = <E = string>() => {
  const [requestStatus, setRequestStatus] = useState(RequestStatus.Idle);
  const [error, setError] = useState<E | null>(null);

  return {
    RequestStatus,
    requestStatus,
    setRequestStatus,
    error,
    isIdle: requestStatus === RequestStatus.Idle,
    isLoading: requestStatus === RequestStatus.InProgress,
    isComplete: requestStatus === RequestStatus.Success || requestStatus === RequestStatus.Error,
    isSuccess: requestStatus === RequestStatus.Success,
    isError: requestStatus === RequestStatus.Error,
    setSuccess: () => {
      setRequestStatus(RequestStatus.Success);
      if (error) {
        setError(null);
      }
    },
    setLoading: () => {
      setRequestStatus(RequestStatus.InProgress);
      if (error) {
        setError(null);
      }
    },
    setError: (errorValue: E) => {
      setRequestStatus(RequestStatus.Error);
      setError(errorValue);
    },
    reset: () => {
      setError(null);
      setRequestStatus(RequestStatus.Idle);
    },
  };
};
