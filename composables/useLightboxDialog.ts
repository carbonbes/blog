export default function useLightboxDialog() {
  const items = useState<HTMLElement[] | null>('items', () => null)

  function setItems({
    parent,
    target,
    zoomable,
    lightboxItem,
  }: {
    parent?: HTMLElement
    target: HTMLElement
    zoomable?: boolean
    lightboxItem?: boolean
  }) {
    if (!(zoomable || lightboxItem)) return

    items.value = zoomable
      ? [target]
      : Array.from(parent
        ? parent.querySelectorAll('[data-lightbox-item]')!
        : target.parentNode?.querySelectorAll('[data-lightbox-item]')!
      )

    target.dataset.wasClicked = ''
  }

  return { items, setItems }
}
