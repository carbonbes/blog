export default function useLightboxDialog() {
  const images = useState<HTMLElement[] | null>('images', () => null)

  return { images }
}
