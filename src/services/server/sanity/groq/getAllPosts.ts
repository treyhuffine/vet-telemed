import { groq } from 'next-sanity';
import { GetAllPostsQueryResult } from '@/types/generated/sanity/types';
import { client } from '@/services/server/sanity/lib/client';

const GetAllPostsQuery = groq`*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) {
  _id,
  title,
  slug,
  publishedAt,
  _createdAt,
  _updatedAt,
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
  readingTime
}`;

export const getAllPosts = async () => {
  const posts = await client.fetch<GetAllPostsQueryResult>(GetAllPostsQuery);
  return posts;
};
