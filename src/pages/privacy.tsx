import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PRIVACY_POLICY } from '@/constants/content/privacy';
import { MainLayout } from '@/layouts/MainLayout';
import { Page } from '@/components/utils/Page';

export default function Privacy() {
  return (
    <Page title="Privacy Policy">
      <MainLayout>
        <div className="mx-auto max-w-3xl px-4 pb-32 pt-8 lg:pt-28">
          <Markdown
            className="prose w-full max-w-full dark:prose-invert"
            remarkPlugins={[remarkGfm]}
          >
            {PRIVACY_POLICY}
          </Markdown>
        </div>
      </MainLayout>
    </Page>
  );
}
