import { DocumentTextIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';
import ReadingTimeInput from '../components/ReadingTimeInput';

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: { type: 'author' },
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: { type: 'category' } })],
      description: 'Grouping of posts by topic',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }],
      description: 'Identifier for type of content in a post',
    }),
    defineField({
      name: 'editorialClassification',
      title: 'Editorial Classification',
      type: 'reference',
      to: { type: 'editorialClassification' },
      description: 'High bar of rigor for the post vs. something that is a generic SEO post',
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      description:
        "Optional published date for the post if you don't want to use the _createdAt date",
    }),
    defineField({
      name: 'seoMeta',
      title: 'SEO Meta',
      type: 'seoMeta',
      description: 'Optional metadata for SEO. Will use title and description if not provided.',
    }),
    defineField({
      name: 'previewDescription',
      title: 'Preview description (~200 max characters)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time',
      type: 'number',
      description: 'Estimated reading time in minutes',
      components: {
        input: ReadingTimeInput,
      },
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
