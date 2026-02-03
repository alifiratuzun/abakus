export default {
  name: 'project',
  title: 'Proje',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Proje Adı',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL (slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'mimar',
      title: 'Mimar',
      type: 'string',
      description: 'Mimar(lar), virgülle ayırın',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'yer',
      title: 'Yer',
      type: 'string',
      description: 'Örn: Ankara, Türkiye',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tur',
      title: 'Tür',
      type: 'string',
      description: 'Örn: Dini, Endüstriyel, Eğitim',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tarih',
      title: 'Tarih',
      type: 'string',
      description: 'Yıl, örn: 1965',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'coverImage',
      title: 'Kapak Görseli',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'gallery',
      title: 'Galeri',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Metin',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'body',
      title: 'Açıklama',
      type: 'blockContent',
    },
    {
      name: 'footnote',
      title: 'Dipnot',
      type: 'text',
      description: 'Kaynaklar veya ek bilgiler',
    },
  ],
  preview: {
    select: { title: 'title', yer: 'yer', tarih: 'tarih' },
    prepare: ({ title, yer, tarih }) => ({
      title,
      subtitle: `${yer || ''} · ${tarih || ''}`,
    }),
  },
}
