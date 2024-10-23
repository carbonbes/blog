import { z } from 'h3-zod'
import { type MimeType } from 'file-type'
import { ALLOWED_MEDIAFILE_MIME_TYPES } from '~/utils/consts'

export type HeadingNode = z.infer<typeof HeadingNode>
export type ParagraphNode = z.infer<typeof ParagraphNode>
export type ListNode = z.infer<typeof ListNode>
export type GalleryNode = z.infer<typeof GalleryNode>
export type YoutubeEmbedNode = z.infer<typeof YoutubeEmbedNode>
export type SNEmbedNode = z.infer<typeof SNEmbedNode>

export type StorageMedia = z.infer<typeof StorageMediaSchema>
export type ArticleBody = z.infer<typeof ArticleBodySchema>

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
    type: z.literal('link'),
    attrs: z.object({
      href: z.string().url(),
      target: z.string(),
      rel: z.string(),
      class: z.string().nullable(),
    }),
  }),
  z.object({
    type: z.literal('inlineSpoiler'),
  }),
])

const TextNode = z.object({
  type: z.literal('text'),
  text: z.string().min(1),
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
  content: z.array(ParagraphNode),
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
  type: z.union([z.literal('image'), z.literal('video')]),
  width: z.number().int(),
  height: z.number().int(),
  uploaded: z.boolean(),
})

const GalleryNode = z.object({
  type: z.literal('gallery'),
  attrs: z.object({
    items: z.array(GalleryItem),
    forUpload: z.union([z.array(z.instanceof(File)), z.nullable(z.void())]),
    galleryOpenFileFromDeviceDialog: z.boolean(),
    galleryOpenFileFromClipboardDialog: z.boolean(),
  }),
})

const SeparatorNode = z.object({
  type: z.literal('horizontalRule'),
})

const YoutubeEmbedNode = z.object({
  type: z.literal('youtube-embed'),
  attrs: z.object({
    thumbnail: z.string().url(),
    video_id: z.string().min(1),
  }),
})

const MimeTypeSchema = z.custom<MimeType>(
  (value) => {
    return (
      typeof value === 'string' &&
      ALLOWED_MEDIAFILE_MIME_TYPES.includes(value as MimeType)
    )
  },
  {
    message: 'Invalid MimeType',
  }
)

const StorageMediaSchema = z.object({
  name: z.string().uuid(),
  url: z.string().url(),
  thumbnail: z
    .object({
      name: z.string().uuid(),
      url: z.string().url(),
      width: z.number(),
      height: z.number(),
      mime_type: MimeTypeSchema,
    })
    .optional(),
  width: z.number(),
  height: z.number(),
  mime_type: MimeTypeSchema,
})

const Rfc2822DateSchema = z.string().refine(
  (dateString) => {
    return !isNaN(Date.parse(dateString))
  },
  {
    message: 'Invalid RFC 2822 date format',
  }
)

const SNEmbedNode = z.object({
  type: z.literal('sn-embed'),
  attrs: z.object({
    embed: z.object({
      author: z.object({
        avatar: StorageMediaSchema,
        name: z.string().trim().min(1),
        username: z.string().trim().min(1),
        url: z.string().url(),
      }),
      text: z.string().trim().min(1),
      media: z.array(StorageMediaSchema),
      published: Rfc2822DateSchema,
      type: z.union([z.literal('x'), z.literal('telegram')]),
      url: z.string().url(),
    }),
    type: z.union([z.literal('x'), z.literal('telegram')]),
    url: z.null(),
  }),
})

const RootNode = z.object({
  type: z.literal('rootNode'),
  attrs: z.object({
    pin: z.boolean(),
    spoiler: z.boolean(),
  }),
  content: z.array(
    z.union([
      HeadingNode,
      ParagraphNode,
      ListNode,
      GalleryNode,
      SeparatorNode,
      YoutubeEmbedNode,
      SNEmbedNode,
    ])
  ),
})

const ArticleBodySchema = z.object({
  type: z.literal('doc'),
  content: z.array(RootNode),
})

export default ArticleBodySchema
