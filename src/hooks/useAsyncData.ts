import { useState, useEffect, useCallback, useRef } from 'react';
import { handleApiError, showErrorToast } from '@/lib/error-handling';
import { toast } from 'sonner';

interface UseAsyncDataOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  showErrorToast?: boolean;
  retryCount?: number;
  deps?: any[];
}

interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: any;
  retry: () => void;
  setData: (data: T | null) => void;
}

export function useAsyncData<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const mountedRef = useRef(true);
  const retryCountRef = useRef(0);

  const {
    onSuccess,
    onError,
    showErrorToast: shouldShowToast = true,
    retryCount = 0,
    deps = [],
  } = options;

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction();
      
      if (mountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const error = await handleApiError(err).catch(e => e);
        setError(error);
        
        if (shouldShowToast) {
          showErrorToast(error);
        }
        
        onError?.(error);
        
        // Auto-retry logic
        if (retryCountRef.current < retryCount) {
          retryCountRef.current += 1;
          setTimeout(() => {
            fetchData();
          }, 1000 * retryCountRef.current); // Exponential backoff
        }
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFunction, onSuccess, onError, shouldShowToast, retryCount]);

  useEffect(() => {
    mountedRef.current = true;
    retryCountRef.current = 0;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, deps);

  const retry = useCallback(() => {
    retryCountRef.current = 0;
    fetchData();
  }, [fetchData]);

  return { data, loading, error, retry, setData };
}

// Hook for mutations (POST, PUT, DELETE)
interface UseMutationOptions<T, V> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  showErrorToast?: boolean;
  showSuccessToast?: boolean;
  successMessage?: string;
}

interface UseMutationResult<T, V> {
  mutate: (variables: V) => Promise<T | undefined>;
  loading: boolean;
  error: any;
  data: T | null;
}

export function useMutation<T = any, V = any>(
  mutationFunction: (variables: V) => Promise<T>,
  options: UseMutationOptions<T, V> = {}
): UseMutationResult<T, V> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);

  const {
    onSuccess,
    onError,
    showErrorToast: shouldShowToast = true,
    showSuccessToast = false,
    successMessage = 'Operation completed successfully',
  } = options;

  const mutate = useCallback(async (variables: V): Promise<T | undefined> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await mutationFunction(variables);
      
      setData(result);
      onSuccess?.(result);
      
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      return result;
    } catch (err) {
      const error = await handleApiError(err).catch(e => e);
      setError(error);
      
      if (shouldShowToast) {
        showErrorToast(error);
      }
      
      onError?.(error);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [mutationFunction, onSuccess, onError, shouldShowToast, showSuccessToast, successMessage]);

  return { mutate, loading, error, data };
}

// Hook for form submission with validation
interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  validate?: () => boolean | Promise<boolean>;
  resetOnSuccess?: boolean;
}

export function useFormSubmit<T, V>(
  submitFunction: (values: V) => Promise<T>,
  options: UseFormSubmitOptions<T> = {}
) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<any>(null);

  const {
    onSuccess,
    onError,
    validate,
    resetOnSuccess = false,
  } = options;

  const handleSubmit = useCallback(async (
    values: V,
    formHelpers?: { resetForm?: () => void }
  ): Promise<T | undefined> => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      // Run validation if provided
      if (validate) {
        const isValid = await validate();
        if (!isValid) {
          return undefined;
        }
      }

      const result = await submitFunction(values);
      
      onSuccess?.(result);
      
      if (resetOnSuccess && formHelpers?.resetForm) {
        formHelpers.resetForm();
      }
      
      return result;
    } catch (err) {
      const error = await handleApiError(err).catch(e => e);
      setSubmitError(error);
      showErrorToast(error);
      onError?.(error);
      return undefined;
    } finally {
      setSubmitting(false);
    }
  }, [submitFunction, onSuccess, onError, validate, resetOnSuccess]);

  return {
    handleSubmit,
    submitting,
    submitError,
  };
}

