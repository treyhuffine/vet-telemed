import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { VetAuthProvider } from '@/context/VetAuth';
import { ChatProvider } from '@/context/Chat';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  return (
    <VetAuthProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </VetAuthProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };