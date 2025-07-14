'use client';

import { MessageCircle, MessageSquarePlus } from 'lucide-react';
import { APP_NAME } from '@/constants/app';
import { ROOT_PAGE_URL } from '@/constants/pages';
import { useAuthDialog } from '@/context/AuthDialog';
import { useCurrentChat } from '@/context/Chat';
import { useAuth } from '@/hooks/useAuth';
import Link from '@/components/Link';
import { Button } from '@/components/ui/button';

const AUTH_DIALOG_OPTIONS = {
  loginTitle: 'Log In',
  loginDescription: 'Welcome to CHANGE_ME.',
  signupTitle: 'Create Your Account',
  signupDescription: 'Join CHANGE_ME to...',
};

export function TopNav() {
  const { isUser, isAnonymous, isReady } = useAuth();
  const { openSignup, openLogin } = useAuthDialog();
  const {
    chatModal: { openModal: openChat },
  } = useCurrentChat();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <Link href={ROOT_PAGE_URL} className="flex items-center gap-2 text-primary-foreground">
          <div className="text-2xl">
            <img src="/logo.png" className="h-10" />
          </div>
          <span className="font-semibold">{APP_NAME}</span>
        </Link>

        <div className="flex items-center gap-2">
          {!isReady ? null : isAnonymous ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground"
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
                variant="secondary"
                size="sm"
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
          ) : isUser ? (
            <>
              <Button variant="outline" onClick={openChat}>
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat with AI
              </Button>
              <Button variant="default" asChild>
                <Link href={ROOT_PAGE_URL} className="flex items-center gap-2">
                  <MessageSquarePlus size={18} />
                  Ask Question
                </Link>
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
