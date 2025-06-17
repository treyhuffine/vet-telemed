import { useState } from 'react';
import { MessageCircle, Monitor, Moon, Plus, Sun, User } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LOGOUT_PAGE_URL, ROOT_PAGE_URL } from '@/constants/pages';
import { APP_CONFIG } from '@/constants/config';
import { cn } from '@/lib/utils';
import { useAuthDialog } from '@/context/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import ChatHistorySheet from '@/components/ChatHistorySheet';
import { Settings } from '@/components/Settings/Settings';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const AUTH_DIALOG_OPTIONS = {
  loginTitle: 'Log In',
  loginDescription: `Welcome to ${APP_CONFIG.name}.`,
  signupTitle: 'Create Your Account',
  signupDescription: `Join ${APP_CONFIG.name} to get started.`,
};

// Define your navigation items here
const navItems = [
  { href: ROOT_PAGE_URL, label: 'Home' },
  // Add more navigation items as needed
  // { href: '/about', label: 'About' },
  // { href: '/features', label: 'Features' },
];

export function TopNavigation({
  openSettingsModal,
  setChatHistoryOpen,
}: {
  openSettingsModal: () => void;
  setChatHistoryOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const { session, isAnonymous } = useAuth();
  const { openSignup, openLogin } = useAuthDialog();
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center justify-between px-4">
      {/* Logo */}
      <Link href={ROOT_PAGE_URL} className="mr-6 flex items-center space-x-2 text-xl font-bold">
        <img src="/logo.png" className="mr-1.5 h-6" alt={APP_CONFIG.name} /> {APP_CONFIG.name}
      </Link>

      {/* Desktop Navigation */}
      <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-safe-top">
        <ul className="flex gap-6">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  router.pathname === item.href ? 'text-foreground' : 'text-foreground/60',
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Desktop Actions */}
      <div className="flex items-center gap-2">
        {isAnonymous ? (
          <>
            <Button
              variant="ghost"
              className="inline-flex"
              onClick={() =>
                openLogin({
                  ...AUTH_DIALOG_OPTIONS,
                  useLinks: false,
                })
              }
            >
              Log In
            </Button>
            <Button
              variant="outline-invert"
              onClick={() =>
                openSignup({
                  ...AUTH_DIALOG_OPTIONS,
                  useLinks: false,
                })
              }
            >
              Sign Up
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setChatHistoryOpen(true)}
                aria-label="Chat History"
              >
                <MessageCircle className="h-4 w-4" />
                Chat History
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-60">
                  <AvatarImage
                    src={session.user?.user_metadata?.avatar_url}
                    alt={session.user?.email}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <div className="flex w-full flex-col gap-2 p-2">
                    <span className="text-sm font-medium">Theme</span>
                    <ToggleGroup
                      type="single"
                      value={theme}
                      onValueChange={(value) => value && setTheme(value)}
                    >
                      <ToggleGroupItem value="light" aria-label="Light theme" className="flex-1">
                        <Sun className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="dark" aria-label="Dark theme" className="flex-1">
                        <Moon className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="system" aria-label="System theme" className="flex-1">
                        <Monitor className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => openSettingsModal()}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link href={LOGOUT_PAGE_URL}>Log Out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
}

export function Navigation() {
  const router = useRouter();
  const {
    isOpen: isSettingsOpen,
    openModal: openSettingsModal,
    setIsOpen: setSettingsOpen,
  } = useModal();
  const [isChatHistoryOpen, setChatHistoryOpen] = useState(false);

  return (
    <>
      {/* Desktop Header - Hidden on Mobile */}
      <header className="fixed top-0 z-50 hidden w-full border-b bg-background/95 pt-safe-top backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block">
        <TopNavigation
          openSettingsModal={openSettingsModal}
          setChatHistoryOpen={setChatHistoryOpen}
        />
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-safe-bottom lg:hidden">
        <nav className="mx-auto grid h-16 w-full grid-cols-3 items-center justify-between px-4">
          {/* Add mobile navigation items here */}
          <Link
            href={ROOT_PAGE_URL}
            className={cn(
              'flex flex-col items-center justify-center',
              router.pathname === ROOT_PAGE_URL
                ? 'font-semibold text-primary'
                : 'text-muted-foreground',
            )}
          >
            <span className="text-sm">Home</span>
          </Link>
          
          <div className="flex items-center justify-center">
            <Button variant="default" size="icon" asChild className="h-10 w-10 rounded-full">
              <Link href={ROOT_PAGE_URL}>
                <Plus className={cn('h-7 w-7')} />
                <span className="sr-only">New</span>
              </Link>
            </Button>
          </div>
          
          <button
            onClick={() => setChatHistoryOpen(true)}
            className={cn(
              'flex flex-col items-center justify-center',
              'text-muted-foreground',
            )}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm">Chat</span>
          </button>
        </nav>
      </div>

      <Settings open={isSettingsOpen} onOpenChange={setSettingsOpen} />
      <ChatHistorySheet open={isChatHistoryOpen} onOpenChange={setChatHistoryOpen} />
    </>
  );
}
