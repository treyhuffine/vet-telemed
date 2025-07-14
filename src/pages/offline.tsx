import { GetStaticProps } from 'next';
import { Page } from '@/components/utils/Page';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Page title="Offline" description="You're currently offline">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <WifiOff className="h-24 w-24 text-gray-400 mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            You're Offline
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            It looks like you've lost your internet connection. Don't worry - any data you've entered has been saved locally and will sync automatically when you're back online.
          </p>

          <div className="space-y-4">
            <Button 
              onClick={handleRefresh}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>You can still:</p>
              <ul className="mt-2 space-y-1 text-left list-disc list-inside">
                <li>View cached patient data</li>
                <li>Enter vitals and notes</li>
                <li>Create new patient profiles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};