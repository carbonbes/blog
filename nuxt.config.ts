import { loadEnv } from 'vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

const env = { ...process.env, ...loadEnv('', process.cwd()) }

export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  runtimeConfig: {
    supabaseUrl: env.NUXT_SUPABASE_URL,
    supabasekey: env.NUXT_SUPABASE_KEY,

    cloudinaryCloudName: env.NUXT_CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: env.NUXT_CLOUDINARY_API_KEY,
    cloudinaryApiSecret: env.NUXT_CLOUDINARY_API_SECRET,
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

  css: ['~/assets/styles/index.sass'],

  vite: {
    plugins: [
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

  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,maximum-scale=1.0',
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
})