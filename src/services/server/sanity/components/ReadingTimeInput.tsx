import { Button, Stack, Text } from '@sanity/ui';
import { set, useFormValue } from 'sanity';

// Extract text content from Portable Text blocks
const extractTextFromBlocks = (blocks: any[] = []) => {
  return blocks
    .filter((block) => block._type === 'block')
    .map((block) =>
      block.children
        .filter((child: any) => child._type === 'span')
        .map((span: any) => span.text)
        .join(''),
    )
    .join(' ');
};

const AVERAGE_WORDS_PER_MINUTE = 200;
// Utility function to calculate reading time
const calculateReadingTime = (blocks: any[] = []) => {
  const text = extractTextFromBlocks(blocks);
  // A simple word count: adjust the regex as needed for your text structure
  const words = text ? text.match(/\w+/g) : [];
  const wordCount = words ? words.length : 0;
  // Assume an average reading speed of 200 words per minute
  return Math.round(wordCount / AVERAGE_WORDS_PER_MINUTE) || 1; // Return at least 1 minute
};

type Props = {
  title?: string;
  description?: string;
  value?: number;
  onChange?: (patch: any) => void;
};

const ReadingTimeInput = (props: Props) => {
  const { title, description, value, onChange } = props;
  // Retrieve the current value of the "body" field from the form context
  const body = useFormValue(['body']) as any[];

  const handleCalculate = () => {
    const newTime = calculateReadingTime(body);
    // Update the readingTime field with the new calculated value
    onChange?.(set(newTime));
  };

  return (
    <Stack space={3}>
      <Stack space={2}>
        {title && <Text weight="semibold">{title}</Text>}
        {description && (
          <Text size={1} muted>
            {description}
          </Text>
        )}
      </Stack>
      <Text>
        Current reading time: <strong>{value || 0}</strong> minute(s)
      </Text>
      <Button mode="ghost" text="Calculate Reading Time" onClick={handleCalculate} tone="primary" />
    </Stack>
  );
};

export default ReadingTimeInput;
