import { integer, select, text, relationship } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Product = list({
  // access:
  fields: {
    name: text({
      isRequired: true,
    }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    status: select({
      options: [
        { value: 'AVAILABLE', label: 'Available' },
        { value: 'UNAVAILABLE', label: 'Unavailable' },
        { value: 'DRAFT', label: 'Draft' },
      ],
      defaultValue: 'DRAFT',
      ui: {
        displayMode: 'segmented-control',
        createView: {
          fieldMode: 'hidden',
        },
      },
    }),
    price: integer(),
    photo: relationship({
      ref: 'ProductImage.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: {
          field: ['image', 'altText'],
        },
        inlineEdit: {
          fields: ['image', 'altText'],
        },
      },
    }),
  },
});
