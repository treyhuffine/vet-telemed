import { groq } from 'next-sanity';
import { GetPostBySlugQueryResult } from '@/types/generated/sanity/types';
import { client } from '@/services/server/sanity/lib/client';

const GetPostBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  _createdAt,
  _updatedAt,
  readingTime,
  "author": author->{
    _id,
    name,
    slug,
    "image": image{
      "url": asset->url,
      alt
    },
    bio
  },
  mainImage,
  categories[]->{
    _id,
    title,
    slug,
    description
  },
  tags[]->{
    _id,
    title,
    slug,
    description
  },
  editorialClassification->{
    _id,
    title,
    slug,
    description
  },
  "seoMeta": seoMeta{
    metaTitle,
    metaDescription,
    shareTitle,
    shareDescription,
    "shareImage": shareImage{
      "url": asset->url
    }
  },
  previewDescription,
  body
}`;

export const getPostBySlug = async (slug: string) => {
  const post = await client.fetch<GetPostBySlugQueryResult>(GetPostBySlugQuery, { slug });
  return post;
};
