export const API_PATH = '/system-test' as const;

export interface PostRequestBody {
  systemPrompt: string;
  imageUrls: string[];
  userMessage?: string;
  model?: string;
  temperature?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface PostResponseBody {
  analysis: string;
  meta: {
    systemPrompt: string;
    userMessage: string;
    temperature: number;
    frequencyPenalty: number;
    presencePenalty: number;
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}
