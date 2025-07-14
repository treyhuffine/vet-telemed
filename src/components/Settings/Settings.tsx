import { useState } from 'react';
import { ExternalLink, LogOut, Monitor, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { Drawer } from 'vaul';
import { ANDROID_PLAY_STORE_LINK, IOS_APP_STORE_LINK } from '@/constants/app';
import { LOGOUT_PAGE_URL, PRIVACY_PAGE_URL } from '@/constants/pages';
import { getPlatform } from '@/lib/client/mobile';
import { useApiGateway } from '@/hooks/useApi';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Link from '@/components/Link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const IS_APP_STORE_LINK_AVAILABLE = false;

interface SettingsContentProps {
  onClose: () => void;
}

function SettingsContent({ onClose }: SettingsContentProps) {
  const { theme, setTheme } = useTheme();
  const platform = getPlatform();
  const isWeb = platform === 'web';
  const isIOS = platform === 'ios';
  const isAndroid = platform === 'android';
  const { delete: deleteAccount, isLoading } = useApiGateway('/v1/users');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success('Account deletion in progress');
      setShowDeleteDialog(false);
      onClose();
      router.push(LOGOUT_PAGE_URL);
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to request account deletion');
    }
  };

  return (
    <div className="w-full overflow-auto p-6">
      <h2 className="mb-8 text-3xl font-bold">Settings</h2>

      {/* Appearance Section */}
      <div className="mb-12">
        <h3 className="mb-2 text-lg font-bold">Appearance</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Customize how CHANGE_ME looks on your device
        </p>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Theme</span>
          <ToggleGroup
            type="single"
            value={theme}
            onValueChange={(value) => value && setTheme(value)}
            className="justify-start gap-4"
          >
            <ToggleGroupItem
              value="light"
              aria-label="Light theme"
              className="flex-1 px-2 md:min-w-24"
            >
              <Sun className="h-4 w-4" />
              <span className="hidden md:inline-block">Light</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="dark"
              aria-label="Dark theme"
              className="flex-1 px-2 md:min-w-24"
            >
              <Moon className="h-4 w-4" />
              <span className="hidden md:inline-block">Dark</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="system"
              aria-label="System theme"
              className="flex-1 px-2 md:min-w-24"
            >
              <Monitor className="h-4 w-4" />
              <span className="hidden md:inline-block">System</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {IS_APP_STORE_LINK_AVAILABLE && (
        <div className="mb-12">
          <h3 className="mb-2 text-lg font-bold">Download the App</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Get the best CHANGE_ME experience on your device
          </p>
          <div className="flex gap-3">
            {(isWeb || isIOS) && (
              <a href={IOS_APP_STORE_LINK} target="_blank" rel="noopener noreferrer">
                <img src="/app-store/ios.svg" alt="Download on iOS" className="h-10" />
              </a>
            )}

            {(isWeb || isAndroid) && (
              <a href={ANDROID_PLAY_STORE_LINK} target="_blank" rel="noopener noreferrer">
                <img src="/app-store/android.png" alt="Download on Android" className="h-10" />
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mb-12">
        <h3 className="mb-2 text-lg font-bold">About CHANGE_ME</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          CHANGE_ME is your parenting companion. Our AI chat is available 24/7 to answer your
          questions and support your parenting journey.
        </p>
        <Link
          href={PRIVACY_PAGE_URL}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          View Privacy Policy
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
      <div>
        <h3 className="mb-2 text-lg font-bold">Account</h3>
        <div className="flex flex-col gap-3">
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="-mx-3 flex w-full items-center justify-start"
          >
            <Link href={LOGOUT_PAGE_URL}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Link>
          </Button>

          {isIOS && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="-mx-3 flex w-full items-center justify-start text-muted-foreground hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete account
              </Button>

              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      This action is irreversible. Your account and all your data will be
                      permanently deleted within 48 hours. You will be logged out immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteDialog(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
      <div className="h-safe-bottom"></div>
    </div>
  );
}

interface SettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Settings({ open, onOpenChange }: SettingsProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // For desktop: use Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl gap-0 p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <SettingsContent onClose={() => onOpenChange(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  // For mobile: use Drawer
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} shouldScaleBackground>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[94dvh] flex-col rounded-t-[10px] bg-background focus-within:outline-none focus:outline-none">
          <button className="absolute right-2 top-2" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col overflow-auto rounded-t-[10px]">
            <Drawer.Handle className="mx-auto my-3 h-1.5 w-12 rounded-full bg-gray-300" />
            <div className="sr-only">
              <Drawer.Title>Settings</Drawer.Title>
            </div>
            <SettingsContent onClose={() => onOpenChange(false)} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
