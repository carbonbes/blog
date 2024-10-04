import { joinURL } from 'ufo'
import { defu } from 'defu'
import type { ProviderGetImage } from '@nuxt/image'
import { createOperationsGenerator } from '#image'

const operationsGenerator = createOperationsGenerator({
  keyMap: {
    width: 'width',
    height: 'height',
    resize: 'resize',
    quality: 'quality',
    format: 'format',
  },
  valueMap: {
    resize: {
      cover: 'cover',
      contain: 'contain',
      fill: 'fill',
    },
  },
  joinWith: '&',
})

const defaultModifiers = {
  quality: '80',
}

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL = '/' } = {}
) => {
  const mergeModifiers = defu(modifiers, defaultModifiers)

  const operations = operationsGenerator(mergeModifiers)

  return {
    url: joinURL(baseURL, src) + (operations ? `?${operations}` : ''),
  }
}
