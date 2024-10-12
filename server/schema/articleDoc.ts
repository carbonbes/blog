import { z } from 'h3-zod'

const MarkSchema = z.union([
  z.object({
    type: z.literal('bold'),
  }),
  z.object({
    type: z.literal('italic'),
  }),
  z.object({
    type: z.literal('strike'),
  }),
  z.object({
    type: z.literal('underline'),
  }),
  z.object({
    type: z.literal('inlineSpoiler'),
  }),
  z.object({
    type: z.literal('link'),
    attrs: z.object({
      href: z.string().url(),
      target: z.string(),
      rel: z.string(),
      class: z.string().nullable(),
    }),
  }),
])

const TextNode = z.object({
  type: z.literal('text'),
  text: z.string().trim().min(1),
  marks: z.array(MarkSchema).optional(),
})

const HeadingNode = z.object({
  type: z.literal('heading'),
  attrs: z.object({
    level: z.number().int().min(1).max(2),
  }),
  content: z.array(TextNode),
})

const ParagraphNode = z.object({
  type: z.literal('paragraph'),
  content: z.array(TextNode),
})

const ListItem = z.object({
  type: z.literal('listItem'),
  content: z.array(TextNode),
})

const ListNode = z.object({
  type: z.union([z.literal('bulletList'), z.literal('orderedList')]),
  attrs: z
    .object({
      start: z.number().int(),
    })
    .optional(),
  content: z.array(ListItem),
})

const GalleryItem = z.object({
  src: z.string().url(),
  type: z.literal('image'),
  width: z.number().int(),
  height: z.number().int(),
  uploaded: z.boolean(),
})

const GalleryNode = z.object({
  type: z.literal('gallery'),
  attrs: z.object({
    items: z.array(GalleryItem),
    forUpload: z.nullable(z.void()),
    galleryOpenFileFromDeviceDialog: z.boolean(),
    galleryOpenFileFromClipboardDialog: z.boolean(),
  }),
})

const SeparatorNode = z.object({
  type: z.literal('horizontalRule'),
})

const RootNode = z.object({
  type: z.literal('rootNode'),
  attrs: z.object({
    pin: z.boolean(),
    spoiler: z.boolean(),
  }),
  content: z.array(
    z.union([HeadingNode, ParagraphNode, ListNode, GalleryNode, SeparatorNode])
  ),
})

const DocSchema = z.object({
  type: z.literal('doc'),
  content: z.array(RootNode),
})

export default DocSchema
