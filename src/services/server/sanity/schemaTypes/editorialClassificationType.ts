import { TiersIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const editorialClassificationType = defineType({
  name: 'editorialClassification',
  title: 'Editorial Classification',
  type: 'document',
  icon: TiersIcon,
  description: 'A way to separate posts based on the rigor of the research used in the creation.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        list: [
          { title: 'High', value: 'HIGH' },
          { title: 'General', value: 'GENERAL' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 160,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
  ],
});
