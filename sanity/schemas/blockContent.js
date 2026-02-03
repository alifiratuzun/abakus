export default {
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Başlık', value: 'h2' },
        { title: 'Alt Başlık', value: 'h3' },
      ],
      lists: [{ title: 'Liste', value: 'bullet' }],
      marks: {
        decorators: [
          { title: 'Kalın', value: 'strong' },
          { title: 'İtalik', value: 'em' },
        ],
        annotations: [
          {
            title: 'Link',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    },
    {
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Metin',
          type: 'string',
        },
        {
          name: 'caption',
          title: 'Açıklama',
          type: 'string',
        },
      ],
    },
  ],
}
