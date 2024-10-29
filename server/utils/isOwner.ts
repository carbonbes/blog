import { Article, Profile } from '~/types'

export default function isOwner(user: Profile, record: Article) {
  if (user.id !== record.author.id) {
    return false
  } else return true
}
