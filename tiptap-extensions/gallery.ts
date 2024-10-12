import { Node, mergeAttributes } from '@tiptap/core'
import { NodeSelection, Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Gallery from '~/components/editor/nodes/gallery/Gallery.vue'

function createGallery(view: EditorView, files: File[]) {
  const galleryNode = view.state.schema.nodes.gallery.create({
    forUpload: files,
  })

  const rootNode = view.state.schema.nodes.rootNode.create(null, galleryNode)

  const pos =
    view.state.tr.selection.$anchor.pos - view.state.tr.selection.$anchor.depth

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
      items: {
        default: [],
      },

      forUpload: {
        default: null,
      },

      galleryOpenFileFromDeviceDialog: {
        default: false,
      },

      galleryOpenFileFromClipboardDialog: {
        default: false,
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
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-type': 'gallery' }),
      0,
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(Gallery)
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('galleryNodePasteHandler'),

        props: {
          handlePaste(view, event) {
            const items = getFilesFromClipboard(
              event,
              ALLOWED_MEDIAFILE_MIME_TYPES
            )

            if (!items) return false

            createGallery(view, items)

            return true
          },

          handleDrop(view, event) {
            const items = getFilesFromDrop(event, ALLOWED_MEDIAFILE_MIME_TYPES)

            if (!items) return false

            createGallery(view, items)

            return true
          },
        },
      }),
    ]
  },
})

export default GalleryNode
