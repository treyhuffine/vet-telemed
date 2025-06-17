import * as React from 'react';
import { type ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

export interface AutoResizeTextareaProps extends ComponentProps<'textarea'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxHeight?: string;
}

export function AutoResizeTextarea({
  value,
  onChange,
  maxHeight = '240px',
  ref,
  ...props
}: AutoResizeTextareaProps) {
  const localRef = React.useRef<HTMLTextAreaElement | null>(null);
  const textareaRef = (ref || localRef) as React.RefObject<HTMLTextAreaElement>;

  const adjustHeight = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = `${textarea.scrollHeight}px`;
    textarea.style.height = newHeight;

    if (textarea.scrollHeight > parseInt(maxHeight)) {
      textarea.style.height = maxHeight;
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxHeight]);

  React.useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onInput={adjustHeight}
      className={cn(props.className, 'min-h-0 resize-none')}
      style={{ maxHeight }}
      {...props}
    />
  );
}
