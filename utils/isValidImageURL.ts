export default function checkValidImageURL(url: string) {
  return /(https:\/\/)([^\s(["<>/]*)(\/)[^\s["><]*(.png|.jpg|.webp|.mp4|.gif)(\?[^\s[",><]*)?/g.test(
    url
  )
}
