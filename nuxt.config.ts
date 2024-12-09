import { loadEnv } from 'vite'
import mkcert from 'vite-plugin-mkcert'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

const env = { ...process.env, ...loadEnv('', process.cwd()) }

export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },

  runtimeConfig: {
    telegramApiHash: env.NUXT_TELEGRAM_API_HASH,
    telegramApiId: env.NUXT_TELEGRAM_API_ID,
    telegramApiStringSession: env.NUXT_TELEGRAM_API_STRING_SESSION,

    public: {
      imageRoute: '/media/image',
      videoRoute: '/media/video',
    },
  },

  modules: [
    '@nuxtjs/supabase',
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
    '@vueuse/nuxt',
    'radix-vue/nuxt',
    '@nuxt/image',
    'dayjs-nuxt',
    'radix-vue/nuxt',
    '@nuxt/scripts',
    '@bicou/prosemirror-render-nuxt',
  ],

  supabase: {
    url: env.NUXT_SUPABASE_URL,
    key: env.NUXT_SUPABASE_KEY,
    serviceKey: env.NUXT_SUPABASE_SERVICE_KEY,
    redirect: false,
  },

  fonts: {
    families: [
      {
        name: 'Roboto',
        provider: 'google',
        weights: [400, 500, 700],
      },
    ],
  },

  image: {
    provider: 'none'
  },

  dayjs: {
    plugins: ['relativeTime'],
  },

  css: ['~/assets/styles/index.sass'],

  vite: {
    plugins: [
      mkcert({
        source: 'coding',
        savePath: './certs',
        force: true,
        autoUpgrade: true,
      }),

      Components({
        resolvers: [
          IconsResolver({
            customCollections: ['icons'],
          }),
        ],
      }),
      Icons({
        defaultClass: 'icon',
        customCollections: {
          icons: FileSystemIconLoader('./assets/icons'),
        },
      }),
    ],
  },

  devServer: {
    https: {
      cert: './certs/cert.pem',
      key: './certs/dev.pem',
    },
  },

  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
        },
      ],
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['unplugin-icons/types/vue'],
      },
    },
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        ['swiper-container', 'swiper-slide'].includes(tag),
    },
  },
})
