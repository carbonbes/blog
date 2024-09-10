import { Node, mergeAttributes, nodePasteRule } from '@tiptap/core'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Gallery from '~/components/editor/nodes/Gallery.vue'

function createGallery(view: EditorView, files: File[] | string) {
  const galleryNode = view.state.schema.nodes.gallery.create({
    forUpload: files,
  })

  const rootNode = view.state.schema.nodes.rootNode.create(null, galleryNode)

  const pos =
    view.state.tr.selection.$anchor.pos -
    view.state.tr.selection.$anchor.depth

  NodeSelection.create(view.state.doc, pos)

  view.dispatch(view.state.tr.replaceSelectionWith(rootNode))
}

const GalleryNode = Node.create({
  name: 'gallery',

  priority: 1000,

  group: 'block',

  content: 'block*',

  atom: true,

  addAttributes() {
    return {
      images: {
        default: [],
      },

      forUpload: {
        default: [],
      },

      galleryOpenFileFromDeviceDialog: {
        default: false
      },

      galleryOpenFileFromUrlDialog: {
        default: false
      }
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
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'gallery' }), 0]
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /https?:\/\/.*\.(?:png|jpe?g|gif|webp)/gi,
        type: this.type,
        getAttributes: (match) => {
          return { forUpload: match[0] }
        },
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(Gallery)
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imagePasteHandler'),

        props: {
          handlePaste(view, event) {
            if (!event.clipboardData?.files) return false

            const images = Array.from(event.clipboardData.files).filter(
              (file) => isAllowedImgFormat(file.type)
            )

            if (!images.length) return false

            createGallery(view, images)

            return true
          },

          handleDrop(view, event) {
            if (!event.dataTransfer?.files) return false

            const images = Array.from(event.dataTransfer.files).filter(
              (file) => isAllowedImgFormat(file.type)
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
