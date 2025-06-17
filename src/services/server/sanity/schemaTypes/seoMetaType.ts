import { defineField, defineType } from 'sanity';

export const seoMetaType = defineType({
  name: 'seoMeta',
  title: 'SEO Metadata',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title shown in search engine results, typically limited to 50-60 characters.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description:
        'Description shown in search engine results, typically limited to 150-160 characters.',
    }),
    defineField({
      name: 'shareTitle',
      title: 'Share Title (optional)',
      type: 'string',
      description: 'Title used when sharing on social media, if different from the meta title.',
    }),
    defineField({
      name: 'shareDescription',
      title: 'Share Description (optional)',
      type: 'text',
      description:
        'Description used when sharing on social media, if different from the meta description.',
    }),
    defineField({
      name: 'shareImage',
      title: 'Share Image',
      type: 'image',
      description: 'Image used when sharing on social media, if different from main image.',
      options: {
        hotspot: true,
      },
    }),
  ],
});
