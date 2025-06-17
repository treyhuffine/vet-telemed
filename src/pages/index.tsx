import { useState } from 'react';
import { MessageCircle, Monitor, Moon, Sun, User } from 'lucide-react';
import { NextPage } from 'next';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { APP_CONFIG, FEATURES } from '@/constants/config';
import { LOGOUT_PAGE_URL } from '@/constants/pages';
import { getIsNativePlatform } from '@/lib/client/mobile';
import { useAuthDialog } from '@/context/AuthDialog';
import { useCurrentChat } from '@/context/Chat';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { MainLayout } from '@/layouts/MainLayout';
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
import { Page } from '@/components/utils/Page';

export default function HomePage() {
  const { isAnonymous, session } = useAuth();
  const { openSignup, openLogin } = useAuthDialog();
  const {
    chatModal: { openModal: openChat },
  } = useCurrentChat();
  const { theme, setTheme } = useTheme();
  const {
    isOpen: isSettingsOpen,
    openModal: openSettingsModal,
    setIsOpen: setSettingsOpen,
  } = useModal();
  const [isChatHistoryOpen, setChatHistoryOpen] = useState(false);

  return (
    <Page title={APP_CONFIG.tagline} description={APP_CONFIG.description}>
      <MainLayout>
        <div className="block lg:hidden">
          {isAnonymous ? (
            <div className="absolute right-4 top-4 flex items-center gap-2 pt-safe-top">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  openLogin({
                    loginTitle: 'Log In',
                    loginDescription: `Welcome to ${APP_CONFIG.name}.`,
                    useLinks: false,
                  })
                }
                className="font-semibold"
              >
                Log In
              </Button>
              <Button
                className="w-full"
                variant="outline-invert"
                size="sm"
                onClick={() =>
                  openSignup({
                    signupTitle: 'Create Your Account',
                    signupDescription: `Join ${APP_CONFIG.name} to get started.`,
                    useLinks: false,
                  })
                }
              >
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="absolute right-4 top-4 flex items-center gap-2 pt-safe-top">
              {FEATURES.chat && (
                <Button
                  variant="outline"
                  onClick={() => setChatHistoryOpen(true)}
                  aria-label="Chat History"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat History
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer transition-opacity hover:opacity-60">
                    <AvatarImage
                      src={session?.user?.user_metadata?.avatar_url}
                      alt={session?.user?.email}
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
                        <ToggleGroupItem
                          value="system"
                          aria-label="System theme"
                          className="flex-1"
                        >
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
              {FEATURES.chat && (
                <ChatHistorySheet open={isChatHistoryOpen} onOpenChange={setChatHistoryOpen} />
              )}
            </div>
          )}
        </div>
        <main className="flex h-full grow flex-col items-center justify-center p-4">
          <div className="w-full max-w-md space-y-8 text-center">
            <h1 className="flex flex-col items-center font-poppins text-4xl font-bold tracking-tight">
              <img src="/logo.png" className="mb-1 h-10" alt={APP_CONFIG.name} /> {APP_CONFIG.name}
            </h1>
            <p className="text-lg text-muted-foreground">{APP_CONFIG.tagline}</p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              {isAnonymous ? (
                <>
                  <Button
                    size="lg"
                    onClick={() =>
                      openSignup({
                        signupTitle: 'Create Your Account',
                        signupDescription: `Join ${APP_CONFIG.name} to get started.`,
                        useLinks: false,
                      })
                    }
                    className="w-full sm:w-auto"
                  >
                    Get Started
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() =>
                      openLogin({
                        loginTitle: 'Welcome Back',
                        loginDescription: `Log in to ${APP_CONFIG.name}.`,
                        useLinks: false,
                      })
                    }
                    className="w-full sm:w-auto"
                  >
                    Log In
                  </Button>
                </>
              ) : (
                <>
                  {FEATURES.chat && (
                    <Button size="lg" onClick={() => openChat()} className="w-full sm:w-auto">
                      <MessageCircle className="h-5 w-5" />
                      Start Chat
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => openSettingsModal()}
                    className="w-full sm:w-auto"
                  >
                    Settings
                  </Button>
                </>
              )}
            </div>
          </div>
        </main>
      </MainLayout>
      <Settings open={isSettingsOpen} onOpenChange={setSettingsOpen} />
    </Page>
  );
}
