export default function useRootNode() {
  const swipeEnabled = useState('swipe-enabled', () => true)

  return { swipeEnabled }
}