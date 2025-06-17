import { groq } from 'next-sanity';
import { client } from '@/services/server/sanity/lib/client';

const GetPostSlugsQuery = groq`*[
  _type == "post" 
  && defined(slug.current)
]{
  slug
}`;

interface PostSlug {
  slug: {
    current: string;
  };
}

export const getPostSlugs = async () => {
  const posts = await client.fetch<PostSlug[]>(GetPostSlugsQuery);
  return posts;
};
