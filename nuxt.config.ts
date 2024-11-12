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
    supabaseUrl: env.NUXT_SUPABASE_URL,
    supabasekey: env.NUXT_SUPABASE_KEY,

    telegramApiHash: env.NUXT_TELEGRAM_API_HASH,
    telegramApiId: env.NUXT_TELEGRAM_API_ID,
    telegramApiStringSession: env.NUXT_TELEGRAM_API_STRING_SESSION,

    public: {
      baseUrl: env.NUXT_BASE_URL,
      imageRoute: env.NUXT_BASE_URL + '/media/image',
      videoRoute: env.NUXT_BASE_URL + '/media/video',
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
    'nuxt-api-shield',
  ],

  supabase: {
    url: env.NUXT_SUPABASE_URL,
    key: env.NUXT_SUPABASE_KEY,
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

  dayjs: {
    plugins: ['relativeTime'],
  },

  nuxtApiShield: {
    limit: {
      max: env.apiRateLimitMaxRequestsPerDuration,
      duration: env.apiRateLimitDuration,
      routes: env.NUXT_API_RATE_LIMIT_PROTECTED_ROUTES?.split(','),
    },
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

  nitro: {
    experimental: {
      tasks: true,
    },

    scheduledTasks: {
      '*/15 * * * *': ['shield:clean'],
    },
  },
})
