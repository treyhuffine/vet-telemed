import { useState } from 'react';
import { Loader2, Play } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { API_PATH, PostRequestBody, PostResponseBody } from '@/constants/payloads/system-test';
import { SAMPLE_SYSTEM_PROMPTS } from '@/constants/systenPromptTests';
import { useApiGateway } from '@/hooks/useApi';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Page } from '@/components/utils/Page';

const baseUrl = process.env.APP_URL;
const baseTestsPath = '/tests';
const imagePrefix = `${baseUrl}${baseTestsPath}`;
const generateImageUrl = (imagePath: string) => `${imagePrefix}${imagePath}`;

const images = [
  generateImageUrl('/1.jpg'),
  generateImageUrl('/2.jpeg'),
  generateImageUrl('/3.jpg'),
  generateImageUrl('/4.jpeg'),
  generateImageUrl('/5.png'),
  generateImageUrl('/6.jpeg'),
  generateImageUrl('/7.jpg'),
  generateImageUrl('/8.jpg'),
  generateImageUrl('/9.jpg'),
];

const models = [
  { label: 'GPT-4.1-mini', value: 'gpt-4.1-mini' },
  { label: 'GPT-4.1', value: 'gpt-4.1' },
];

interface ImageResult {
  imageUrl: string;
  result?: PostResponseBody;
  isLoading: boolean;
  error?: string;
}

export default function SystemPromptTesting() {
  const [systemPrompt, setSystemPrompt] = useState(SAMPLE_SYSTEM_PROMPTS.SIMPLE_V3);
  const [userMessage, setUserMessage] = useState(
    'Perform a crumb reading and analysis of the image',
  );
  const [model, setModel] = useState('gpt-4.1-mini');
  const [temperature, setTemperature] = useState('0.7');
  const [frequencyPenalty, setFrequencyPenalty] = useState('0.25');
  const [presencePenalty, setPresencePenalty] = useState('0.25');
  const [selectedPromptTemplate, setSelectedPromptTemplate] = useState('SIMPLE_V3');
  const [imageResults, setImageResults] = useState<ImageResult[]>(
    images.map((imageUrl) => ({ imageUrl, isLoading: false })),
  );
  const [isRunning, setIsRunning] = useState(false);

  const { post } = useApiGateway<PostRequestBody, PostResponseBody>(API_PATH);

  const handleSelectPromptTemplate = (template: string) => {
    setSelectedPromptTemplate(template);
    setSystemPrompt(SAMPLE_SYSTEM_PROMPTS[template as keyof typeof SAMPLE_SYSTEM_PROMPTS]);
  };

  const analyzeImage = async (imageUrl: string, index: number) => {
    try {
      // Set loading state for this image
      setImageResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = { ...newResults[index], isLoading: true, error: undefined };
        return newResults;
      });

      const response = await post({
        payload: {
          systemPrompt,
          imageUrls: [imageUrl], // Send just one image
          userMessage,
          model,
          temperature: parseFloat(temperature),
          frequencyPenalty: parseFloat(frequencyPenalty),
          presencePenalty: parseFloat(presencePenalty),
        },
      });

      // Update result for this image
      setImageResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = {
          ...newResults[index],
          isLoading: false,
          result:
            !response.isError && response.data ? (response.data as PostResponseBody) : undefined,
          error: response.error || undefined,
        };
        return newResults;
      });

      return !response.isError;
    } catch (error) {
      setImageResults((prevResults) => {
        const newResults = [...prevResults];
        newResults[index] = {
          ...newResults[index],
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
        return newResults;
      });
      return false;
    }
  };

  const handleRunTests = async () => {
    setIsRunning(true);

    // Reset all results
    setImageResults(images.map((imageUrl) => ({ imageUrl, isLoading: false })));

    // Process images one by one
    for (let i = 0; i < images.length; i++) {
      await analyzeImage(images[i], i);
    }

    setIsRunning(false);
  };

  return (
    <Page title="System Prompt Testing" isNoIndex>
      <MainLayout>
        <div className="container mx-auto max-w-5xl py-8">
          <h1 className="mb-6 text-3xl font-bold">System Prompt Testing</h1>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-xl font-semibold">Configuration</h2>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">Prompt Template</label>
                  <Select value={selectedPromptTemplate} onValueChange={handleSelectPromptTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(SAMPLE_SYSTEM_PROMPTS).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Model</label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Temperature: {temperature}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Frequency Penalty: {frequencyPenalty}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={frequencyPenalty}
                      onChange={(e) => setFrequencyPenalty(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Presence Penalty: {presencePenalty}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={presencePenalty}
                      onChange={(e) => setPresencePenalty(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium">System Prompt</label>
                  <Textarea
                    className="min-h-[200px] font-mono text-sm"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">User Message</label>
                  <Textarea
                    className="min-h-[80px] font-mono text-sm"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleRunTests}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isRunning ? 'Analyzing Images...' : 'Analyze All Images'}
              </Button>
            </div>
          </div>

          <div className="space-y-12">
            {imageResults.map((imageResult, index) => (
              <div key={index} className="overflow-hidden rounded-lg border">
                <div className="border-b bg-gray-100 p-4">
                  <h3 className="font-semibold">Test Image {index + 1}</h3>
                </div>

                <div className="flex flex-col md:flex-row">
                  <div className="p-4 md:w-1/3">
                    <img
                      src={imageResult.imageUrl}
                      alt={`Test bread ${index + 1}`}
                      className="w-full rounded-md"
                    />
                  </div>

                  <div className="border-t p-4 md:w-2/3 md:border-l md:border-t-0">
                    {imageResult.isLoading ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
                        <p>Analyzing image...</p>
                      </div>
                    ) : imageResult.error ? (
                      <div className="p-4 text-red-500">
                        <p>Error: {imageResult.error}</p>
                      </div>
                    ) : imageResult.result ? (
                      <div>
                        <div className="prose prose-sm max-w-none">
                          <Markdown remarkPlugins={[remarkGfm]}>
                            {imageResult.result.analysis}
                          </Markdown>
                        </div>

                        <div className="mt-4 border-t pt-4 text-xs text-gray-500">
                          <p>Tokens: {imageResult.result.meta.totalTokens || 'N/A'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 italic text-gray-400">
                        Click &quot;Analyze All Images&quot; to run the test
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </Page>
  );
}
