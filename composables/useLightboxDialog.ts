export default function useLightboxDialog() {
  const items = useState<HTMLElement[] | null>('items', () => null)

  function setItems({
    target,
    zoomable,
    lightboxItem,
  }: {
    target: HTMLElement
    zoomable?: boolean
    lightboxItem?: boolean
  }) {
    if (!(zoomable || lightboxItem)) return

    items.value = zoomable
      ? [target]
      : Array.from(target.parentNode?.querySelectorAll('[data-lightbox-item]')!)

    target.dataset.wasClicked = ''
  }

  return { items, setItems }
}
