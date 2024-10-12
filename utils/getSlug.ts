import slugify from 'slugify'

export default function getSlug(string: string) {
  return slugify(string, { lower: true, remove: /[*+~.()'"!:@]/g })
}
