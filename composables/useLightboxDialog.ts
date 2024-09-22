export default function useLightboxDialog() {
  const thumbnails = useState<HTMLElement[] | undefined>()

  function setItems({
    parent,
    target,
    zoomable,
    lightboxItem,
  }: {
    parent?: HTMLElement
    target: HTMLElement | undefined
    zoomable?: boolean
    lightboxItem?: boolean
  }) {
    if (!(zoomable || lightboxItem)) return

    thumbnails.value = zoomable
      ? [target!]
      : Array.from(parent
        ? parent.querySelectorAll('[data-lightbox-item]')!
        : target?.parentNode?.querySelectorAll('[data-lightbox-item]')!
      )

    target!.dataset.wasClicked = ''
  }

  return { thumbnails, setItems }
}
