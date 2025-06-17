import { openai } from '@ai-sdk/openai';
import { UserContent, generateText } from 'ai';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

interface RequestBody {
  systemPrompt: string;
  imageUrls: string[];
  userMessage?: string;
  model?: string;
  temperature?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const {
      systemPrompt,
      imageUrls,
      userMessage = 'Perform a crumb reading and analysis of the images',
      model = 'gpt-4.1-mini',
      temperature = 0.7,
      frequencyPenalty = 0.25,
      presencePenalty = 0.25,
    } = body;

    if (!systemPrompt || !imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'System prompt and at least one image URL are required' },
        { status: 400 },
      );
    }

    // Prepare the content with images
    const content: UserContent = [
      {
        type: 'text',
        text: userMessage,
      },
    ];

    imageUrls.forEach((imageUrl) => {
      content.push({
        type: 'image',
        image: imageUrl,
      });
    });

    // Generate text with the provided system prompt
    const result = await generateText({
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
      model: openai(model),
      temperature,
      frequencyPenalty,
      presencePenalty,
    });

    // Return the result
    return NextResponse.json({
      analysis: result.text,
      meta: {
        systemPrompt,
        userMessage,
        temperature,
        frequencyPenalty,
        presencePenalty,
        model,
        promptTokens: result.usage?.promptTokens,
        completionTokens: result.usage?.completionTokens,
        totalTokens: result.usage?.totalTokens,
      },
    });
  } catch (error) {
    console.error('Error in system test API:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
