import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import fs from 'fs'

function getEnv() {
  const envFilePath = resolve(__dirname, './.env.development')
  try {
    const res: any = {}
    const data = fs.readFileSync(envFilePath, 'utf8')

    data.split('\n').forEach((kv) => {
      const [key, value] = kv.replace(/\s*/g, '').split('=')
      if (key && value) {
        res[key] = value
      }
    })

    return res
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

// https://vitejs.dev/config/
export default () => {
  const envs: any = getEnv()
  const server = envs.API_SERVER
  const port = envs.API_PORT

  return defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: `${server}:${port}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  })
}
