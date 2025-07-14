'use client';

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { type Message, useChat } from '@ai-sdk/react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@/constants/ai';
import { API_URL } from '@/constants/api';
import {
  FILE_PATH,
  FILE_TYPES,
  FILE_TYPES_ACCEPT,
  MAX_FILES,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
} from '@/constants/app';
import { NEW_CHAT_TITLE } from '@/constants/chat';
import { getChatPageUrl } from '@/constants/pages';
import { PostRequestPayload as PostRequestPayloadChat } from '@/constants/payloads/chat';
import {
  GetChatThreadByIdQuery,
  useGetChatThreadByIdLazyQuery,
  useGetChatThreadsForUserLazyQuery,
} from '@/types/generated/client/hooks';
import { getViewerToken } from '@/services/client/supabase';
import { useAuthDialog } from '@/context/AuthDialog';
import { useAuth } from '@/hooks/useAuth';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useModal } from '@/hooks/useModal';

const CHAT_API_PATH = '/chat';
const CHAT_API_URL = API_URL + CHAT_API_PATH;
const FILE_TYPE_ERROR = 'Only image files are allowed';
const MAX_FILE_SIZE_ERROR = `Files larger than ${MAX_FILE_SIZE_MB}MB are not allowed`;
const MAX_FILES_ERROR = `You can only upload a maximum of ${MAX_FILES} files`;

type ChatOptions = {
  isNewChat?: boolean;
};

interface ChatContextType {
  threadId?: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  input: string;
  isLoading: boolean;
  data: any;
  title: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: { preventDefault?: () => void }, options: ChatOptions) => Promise<void>;
  startNewChat: () => void;
  thread?: GetChatThreadByIdQuery['chatThreadsByPk'];
  isLoadingThread: boolean;
  error: Error | undefined;
  errorMessage: string | undefined;
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
  // handlePaste: (event: React.ClipboardEvent) => void;
  handleUploadClick: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  uploadProgress: Record<string, number>;
  uploadedFiles: {
    originalName: string;
    fileName: string;
    fileUrl: string;
  }[];
  handleRemoveUploadedFile: (fileName: string) => void;
  checkAuthBeforeUpload: () => boolean;
  chatModal: ReturnType<typeof useModal>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

const getIsValidFile = (file: File): boolean => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return false;
  }

  // Check for image types
  if (file.type.startsWith('image/')) {
    return FILE_TYPES.some((type: string) => type.startsWith('image/'));
  }

  // Check for text types
  if (file.type.startsWith('text/')) {
    return FILE_TYPES.includes('text/*');
  }

  // Check for PDF
  // if (file.type === 'application/pdf') {
  //   return FILE_TYPES.includes('application/pdf');
  // }

  return false;
};

const isFileTooLarge = (file: File): boolean => {
  return file.size > MAX_FILE_SIZE;
};

export const ChatProvider = ({ children }: Props) => {
  const {
    messages,
    setMessages,
    handleInputChange,
    handleSubmit: handleApiRequestSubmit,
    input,
    isLoading,
    data,
    setData,
    error,
  } = useChat({
    api: CHAT_API_URL,
    sendExtraMessageFields: true,
    generateId: () => uuidv4(),
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Reference for the hidden file input
  const { userId, isAnonymous } = useAuth();
  const { openSignup, close } = useAuthDialog();
  const router = useRouter();
  const routeThreadId = router.isReady ? router.query?.chatId : undefined;
  const chatModal = useModal();
  const [getChatThreadById, { data: threadData, loading: isLoadingThread, called: isCalled }] =
    useGetChatThreadByIdLazyQuery({
      fetchPolicy: 'network-only',
    });
  const [getChatThreadsForUser] = useGetChatThreadsForUserLazyQuery({
    variables: {
      userId: userId,
    },
  });

  const {
    uploadFiles,
    isUploading,
    uploadProgress,
    uploadedFiles,
    resetUploadState,
    removeUploadedFile,
  } = useFileUpload({
    path: FILE_PATH,
  });

  // @ts-expect-error data is not typed
  const generatedTitle = data?.find((d) => d?.type === 'title')?.title || NEW_CHAT_TITLE;
  const title = threadData?.chatThreadsByPk?.title || generatedTitle;

  useEffect(() => {
    if (!routeThreadId) return;

    getChatThreadById({ variables: { id: routeThreadId } }).then((result) => {
      if (result.data?.chatThreadsByPk?.messages) {
        setMessages(
          result.data.chatThreadsByPk.messages.map((message) => ({
            id: message.id,
            content: message.content,
            role: message.role as Role,
            experimental_attachments: message.files.map((file) => ({
              name: file.fileName,
              url: file.filePath,
              contentType: file.mimeType,
            })),
          })),
        );
      }
    });
  }, [routeThreadId, getChatThreadById, setMessages]);

  useEffect(() => {
    if (userId) {
      getChatThreadsForUser({ variables: { userId }, fetchPolicy: 'cache-and-network' });
    }
  }, [userId, getChatThreadsForUser, title]);

  const checkAuthBeforeUpload = () => {
    if (isAnonymous) {
      openSignup({
        loginTitle: 'Log In Required',
        loginDescription: 'You need an account to upload files.',
        signupTitle: 'Create Your Account',
        signupDescription: 'Join CHANGE_ME to start getting personalized CHANGE_ME advice.',
        useLinks: false,
        onSignupSuccess: async () => {
          close();
        },
        onLoginSuccess: async () => {
          close();
        },
      });
      return false;
    }
    return true;
  };

  const startNewChat = useCallback(() => {
    setMessages([]);
    setData(undefined);
  }, [setMessages, setData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkAuthBeforeUpload()) {
      event.target.value = '';
      return;
    }

    const selectedFiles = event.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      // Create a DataTransfer to combine existing and new files
      const dataTransfer = new DataTransfer();

      // Add existing files first
      if (files) {
        Array.from(files).forEach((file) => dataTransfer.items.add(file));
      }

      // Check for files that are too large
      const newFiles = Array.from(selectedFiles);
      const oversizedFiles = newFiles.filter(isFileTooLarge);
      if (oversizedFiles.length > 0) {
        toast.error(MAX_FILE_SIZE_ERROR);
      }

      // Filter valid new files (correct type and size)
      const validNewFiles = newFiles.filter(getIsValidFile);

      if (validNewFiles.length !== newFiles.length - oversizedFiles.length) {
        toast.error(FILE_TYPE_ERROR);
      }

      // Check if adding these files would exceed the limit
      const totalFiles = (files?.length || 0) + validNewFiles.length;

      if (totalFiles > MAX_FILES) {
        toast.error(MAX_FILES_ERROR);

        // Add as many new files as possible without exceeding the limit
        const remainingSlots = MAX_FILES - (files?.length || 0);
        if (remainingSlots > 0) {
          validNewFiles.slice(0, remainingSlots).forEach((file) => dataTransfer.items.add(file));
        }
      } else {
        // Add all valid new files
        validNewFiles.forEach((file) => dataTransfer.items.add(file));
      }

      // Update files if we have any
      if (dataTransfer.files.length > 0) {
        setFiles(dataTransfer.files);

        // Upload the files immediately
        uploadFiles(Array.from(dataTransfer.files));
      }

      // Reset the file input so the same file can be selected again
      event.target.value = '';
    }
  };

  const handleUploadClick = useCallback(() => {
    if (isAnonymous) {
      toast.error('Please log in to upload files');
      return;
    }
    fileInputRef.current?.click();
  }, [isAnonymous]);

  const handleRemoveUploadedFile = (fileName: string) => {
    // Use the removeUploadedFile function from the hook
    removeUploadedFile(fileName);
  };

  let errorString;
  if (error) {
    try {
      errorString = JSON.parse(error?.message).message;
    } catch {
      errorString = error.message;
    }
  }

  const handleSubmit = async (
    e: {
      preventDefault?: () => void;
    },
    { isNewChat }: ChatOptions,
  ) => {
    e?.preventDefault?.();

    const hasInputMessage = input.trim();
    const isGeneratingNewMessage = isLoading;
    const isWaitingForInitialization = isLoadingThread || (!!routeThreadId && !isCalled);

    if (!hasInputMessage || isGeneratingNewMessage || isWaitingForInitialization || isUploading) {
      return;
    }

    let submitThreadId = uuidv4();
    if (isNewChat) {
      startNewChat();
    } else if (routeThreadId) {
      submitThreadId = routeThreadId as string;
    }

    if (!routeThreadId || isNewChat) {
      router.push(getChatPageUrl(submitThreadId));
    }

    let token = await getViewerToken();

    if (!token) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      token = await getViewerToken();
      if (!token) {
        return;
      }
    }

    const extraPayload: Omit<PostRequestPayloadChat, 'messages'> = {
      threadId: submitThreadId,
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
    };

    handleApiRequestSubmit(e, {
      body: extraPayload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      experimental_attachments:
        uploadedFiles.length > 0
          ? uploadedFiles.map((file) => ({
              name: file.fileName,
              url: file.filePath,
              contentType: file.mimeType,
            }))
          : undefined,
    });

    // Reset uploaded files and file input after submission
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    resetUploadState();
  };

  return (
    <ChatContext.Provider
      value={{
        threadId: routeThreadId as string | undefined,
        messages,
        setMessages,
        input,
        isLoading,
        title,
        handleInputChange,
        handleSubmit,
        startNewChat,
        thread: threadData?.chatThreadsByPk,
        isLoadingThread,
        data,
        error,
        errorMessage: errorString,
        files,
        setFiles,
        handleFileChange,
        handleUploadClick,
        isUploading,
        uploadProgress,
        uploadedFiles,
        handleRemoveUploadedFile,
        checkAuthBeforeUpload,
        chatModal,
      }}
    >
      {children}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept={FILE_TYPES_ACCEPT}
      />
    </ChatContext.Provider>
  );
};

export function useCurrentChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useCurrentChat must be used within a ChatProvider');
  }
  return context;
}
