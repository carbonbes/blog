import { Node, mergeAttributes } from '@tiptap/core'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Gallery from '~/components/editor/nodes/gallery/Gallery.vue'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    gallery: {
      setGallery: (images: File[]) => ReturnType
    }
  }
}

const GalleryNode = Node.create({
  name: 'gallery',

  priority: 1000,

  group: 'block',

  content: 'block*',

  draggable: true,

  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
      },

      forUpload: {
        default: [],
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="gallery"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes), 0]
  },

  addNodeView() {
    return VueNodeViewRenderer(Gallery)
  },

  addCommands() {
    return {
      setGallery:
        (images) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              forUpload: images,
            },
          })
        },
    }
  },

  addProseMirrorPlugins() {
    function createGallery(view: EditorView, files: File[] | string) {
      const node = view.state.schema.nodes.gallery.create({
        forUpload: files,
      })

      const pos =
        view.state.tr.selection.$anchor.pos -
        view.state.tr.selection.$anchor.depth

      const resolvedPos = view.state.tr.doc.resolve(pos)

      new NodeSelection(resolvedPos)

      const tr = view.state.tr.replaceSelectionWith(node)
      view.dispatch(tr)
    }

    return [
      new Plugin({
        key: new PluginKey('imagePasteHandler'),

        props: {
          handlePaste(view, event) {
            const hasFiles = !!event.clipboardData?.files.length
            const hasText = !!event.clipboardData?.getData('text')

            if (!(hasFiles || hasText)) return false

            if (hasFiles) {
              const allowedFormats = [
                'image/png',
                'image/webp',
                'image/jpg',
                'image/jpeg',
                'image/heic',
                'image/gif',
              ]

              const images = Array.from(event.clipboardData.files).filter(
                (file) => allowedFormats.includes(file.type)
              )

              if (!images.length) return false

              createGallery(view, images)
            } else if (hasText) {
              const text = event.clipboardData?.getData('text')

              if (!text) return false

              if (!isValidImageURL(text)) return false

              createGallery(view, text)
            }

            return true
          },

          handleDrop(view, event) {
            const hasFiles = event.dataTransfer?.files.length

            if (!hasFiles) return false

            const images = Array.from(event.dataTransfer.files).filter((file) =>
              /image/i.test(file.type)
            )

            if (!images.length) return false

            createGallery(view, images)

            return true
          },
        },
      }),
    ]
  },
})

export default GalleryNode
