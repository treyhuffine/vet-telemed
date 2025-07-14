import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  RefreshCw, 
  WifiOff, 
  XCircle,
  Info
} from 'lucide-react';
import { getErrorMessage } from '@/lib/error-handling';

interface ErrorDisplayProps {
  error: any;
  onRetry?: () => void;
  fullPage?: boolean;
  className?: string;
}

export default function ErrorDisplay({ 
  error, 
  onRetry, 
  fullPage = false,
  className 
}: ErrorDisplayProps) {
  const message = getErrorMessage(error);
  const isNetworkError = error?.code === 'NETWORK_ERROR';
  
  const ErrorIcon = isNetworkError ? WifiOff : AlertTriangle;
  
  const content = (
    <div className={`space-y-4 ${className || ''}`}>
      <Alert variant="destructive">
        <ErrorIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return content;
}

export function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-red-600">
      <XCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}

export function EmptyState({ 
  title, 
  description, 
  action 
}: { 
  title: string; 
  description?: string; 
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <Info className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}