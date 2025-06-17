import { type SchemaTypeDefinition } from 'sanity';
import { authorType } from './authorType';
import { blockContentType } from './blockContentType';
import { categoryType } from './categoryType';
import { editorialClassificationType } from './editorialClassificationType';
import { postType } from './postType';
import { seoMetaType } from './seoMetaType';
import { tagType } from './tagType';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    seoMetaType,
    tagType,
    editorialClassificationType,
  ],
};
