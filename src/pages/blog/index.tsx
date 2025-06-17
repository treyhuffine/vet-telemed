import { formatDistanceToNow } from 'date-fns';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostPageUrl } from '@/constants/pages';
import { GetAllPostsQueryResult } from '@/types/generated/sanity/types';
import { getAllPosts } from '@/services/server/sanity/groq/getAllPosts';
import { urlFor } from '@/services/server/sanity/lib/image';
import { TopNav } from '@/components/TopNav';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Page } from '@/components/utils/Page';

const REVALIDATE_SECONDS = 14400;

interface BlogPageProps {
  posts: GetAllPostsQueryResult;
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  try {
    const posts = await getAllPosts();

    return {
      props: {
        posts,
      },
      revalidate: process.env.TARGET_PLATFORM === 'mobile' ? undefined : REVALIDATE_SECONDS,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      props: {
        posts: [],
      },
      revalidate: process.env.TARGET_PLATFORM === 'mobile' ? undefined : REVALIDATE_SECONDS,
    };
  }
};

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <Page
      title="Resources"
      description="The #1 resource for parents and providing advice on raising happy families."
    >
      <TopNav />
      <main className="min-h-dvh bg-gradient-to-br from-background to-primary/10">
        {/* Hero Section */}
        <div className="pt-24">
          <div className="container mx-auto max-w-7xl px-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Sourdough Insights
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert advice and stories to help you navigate your sourdough journey.
            </p>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="container mx-auto max-w-7xl px-8 py-12">
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => {
              const postImageUrl = post?.mainImage
                ? urlFor(post.mainImage)?.width(550).height(310).url()
                : null;
              const readingTime = post.readingTime;

              return (
                <Card key={post._id} className="flex h-full flex-col overflow-hidden">
                  <Link href={getBlogPostPageUrl(post.slug?.current || '')}>
                    {postImageUrl ? (
                      <div className="aspect-video w-full overflow-hidden">
                        <Image
                          src={postImageUrl}
                          alt={post.title || ''}
                          width={550}
                          height={310}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <CardHeader>
                      <div className="flex flex-wrap gap-2">
                        {post.categories?.map((category) => (
                          <Badge key={category._id} variant="secondary">
                            {category.title}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="mt-2 line-clamp-2 hover:text-primary">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.previewDescription}
                      </CardDescription>
                    </CardHeader>
                  </Link>
                  <CardContent className="flex-grow" />
                  <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {post.author?.image?.url && (
                        <Image
                          src={post.author.image.url}
                          alt={post.author.name || ''}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <span>{post.author?.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>
                        {formatDistanceToNow(
                          new Date(post.publishedAt || post._updatedAt || post._createdAt),
                          {
                            addSuffix: true,
                          },
                        )}
                      </span>
                      <span>{readingTime} min read</span>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </Page>
  );
}
