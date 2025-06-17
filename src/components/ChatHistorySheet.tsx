import { useEffect } from 'react';
import { MessageCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { NEW_CHAT_TITLE } from '@/constants/chat';
import { getChatPageUrl } from '@/constants/pages';
import { useGetChatThreadsForUserLazyQuery } from '@/types/generated/client/hooks';
import { useCurrentChat } from '@/context/Chat';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ChatHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChatHistorySheet({ open, onOpenChange }: ChatHistorySheetProps) {
  const { userId } = useAuth();
  const [fetchThreads, { data, loading, error }] = useGetChatThreadsForUserLazyQuery();
  const {
    chatModal: { openModal: openChat },
  } = useCurrentChat();

  useEffect(() => {
    if (open && userId) {
      fetchThreads({ variables: { userId } });
    }
  }, [open, userId, fetchThreads]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-dvh w-full max-w-md flex-col overflow-hidden [&>button:first-child]:top-[calc(var(--sat)+1rem)]"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 pt-safe-top">
            <MessageCircle className="h-5 w-5" /> Chat History
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex h-full flex-col gap-4">
          <Button
            variant="default"
            className="flex w-full items-center justify-center font-bold"
            onClick={openChat}
          >
            <Plus className="h-4 w-4" /> Start New Chat
          </Button>
          {loading && <div className="text-muted-foreground">Loading...</div>}
          {error && <div className="text-destructive">Failed to load chat history.</div>}
          {!loading && !error && (
            <>
              {data?.chatThreads?.length ? (
                <div className="flex h-full flex-col pb-safe-bottom">
                  <ul className="flex grow flex-col overflow-y-auto pb-32">
                    {data.chatThreads.map((thread) => (
                      <li key={thread.id}>
                        <Link
                          href={getChatPageUrl(thread.id)}
                          className="block cursor-pointer truncate rounded px-3 py-2 text-foreground transition-colors hover:bg-secondary"
                          onClick={() => onOpenChange(false)}
                        >
                          {thread.title || NEW_CHAT_TITLE}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <div className="text-muted-foreground">No chat history found.</div>
                  <Button variant="secondary" className="mt-2 flex items-center" onClick={openChat}>
                    <Plus className="h-4 w-4" /> Start New Chat
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
