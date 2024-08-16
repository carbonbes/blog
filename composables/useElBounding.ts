type Bounds = {
  height: Ref<number>
  bottom: Ref<number>
  left: Ref<number>
  right: Ref<number>
  top: Ref<number>
  width: Ref<number>
  x: Ref<number>
  y: Ref<number>
}

export default function useElBounding(target: HTMLElement, cropped?: boolean) {
  const el = useState<HTMLElement>('target', () => target)
  const bounds = useState<Bounds | null>('bounds', () => null)

  onMounted(() => {
    bounds.value = { ...el.value.getBoundingClientRect() as unknown as Bounds }
  })

  return { bounds }
}