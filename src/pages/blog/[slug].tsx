import { PortableText } from '@portabletext/react';
import type { TypedObject } from '@portabletext/types';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BLOG_PAGE_URL } from '@/constants/pages';
import { GetPostBySlugQueryResult } from '@/types/generated/sanity/types';
import { getPostBySlug } from '@/services/server/sanity/groq/getPostBySlug';
import { getPostSlugs } from '@/services/server/sanity/groq/getPostSlugs';
import { client } from '@/services/server/sanity/lib/client';
import { TopNav } from '@/components/TopNav/TopNav';
import { Page } from '@/components/utils/Page';

const REVALIDATE_SECONDS = 14400;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null;

interface PostPageProps {
  post: NonNullable<GetPostBySlugQueryResult>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.TARGET_PLATFORM === 'mobile') {
    return {
      paths: [],
      fallback: false,
    };
  }

  const posts = await getPostSlugs();

  console.log('slugs for blog posts', posts);

  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug.current },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        notFound: true,
        revalidate: REVALIDATE_SECONDS,
      };
    }

    return {
      props: {
        post,
      },
      revalidate: REVALIDATE_SECONDS,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      notFound: true,
      revalidate: REVALIDATE_SECONDS,
    };
  }
};

export default function PostPage({ post }: PostPageProps) {
  if (!post) {
    return null;
  }

  const postImageUrl = post?.mainImage
    ? urlFor(post.mainImage)?.width(1200).height(630).url() || ''
    : null;

  const publishedDate = post.publishedAt || post._updatedAt || post._createdAt;

  // SEO metadata
  const seoTitle = post.seoMeta?.metaTitle || post.title || '';
  const seoDescription = post.seoMeta?.metaDescription || post.previewDescription || '';
  const mainImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(1200).height(630).url()
    : undefined;
  const shareImage = post.seoMeta?.shareImage?.url || mainImageUrl;

  return (
    <Page title={seoTitle} description={seoDescription} ogImage={shareImage}>
      <TopNav />
      <main className="container mx-auto min-h-dvh max-w-[52rem] px-4 py-8 pt-24 md:px-8">
        <Link
          href={BLOG_PAGE_URL}
          className="mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to posts
        </Link>

        <article className="prose prose-lg max-w-none dark:prose-invert">
          {postImageUrl && (
            <Image
              src={postImageUrl}
              alt={post.title || ''}
              width={1200}
              height={600}
              className="rounded-2xl object-cover"
              priority
            />
          )}

          <header className="not-prose mb-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
            {post.previewDescription && (
              <p className="mb-6 text-xl text-muted-foreground">{post.previewDescription}</p>
            )}
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  {post.author.image?.url && (
                    <Image
                      src={post.author.image.url}
                      alt={post.author.image.alt || post.author.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>{post.author.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                <time dateTime={publishedDate}>
                  {new Date(publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
          </header>

          {post.categories && post.categories.length > 0 && (
            <div className="not-prose mb-8 flex gap-2">
              {post.categories.map((category) => (
                <span
                  key={category._id}
                  className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                >
                  {category.title}
                </span>
              ))}
            </div>
          )}

          {Array.isArray(post?.body) && (
            <div className="prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-code:rounded-sm prose-code:bg-muted prose-code:p-1 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none">
              <PortableText value={post.body as TypedObject[]} />
            </div>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="not-prose mt-8 border-t pt-8">
              <h2 className="mb-4 text-lg font-semibold">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                  >
                    {tag.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {post.author?.bio && (
            <div className="not-prose mt-8 rounded-xl bg-muted p-6">
              <div className="mb-4 flex items-center gap-4">
                {post.author.image?.url && (
                  <Image
                    src={post.author.image.url}
                    alt={post.author.image.alt || post.author.name || ''}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h2 className="text-lg font-semibold">{post.author.name}</h2>
                  <p className="text-sm text-muted-foreground">About the author</p>
                </div>
              </div>
              <div className="text-muted-foreground">
                <PortableText value={post.author.bio as TypedObject[]} />
              </div>
            </div>
          )}
        </article>
      </main>
    </Page>
  );
}
