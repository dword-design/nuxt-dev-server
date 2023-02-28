import { loadNuxt } from '@nuxt/kit'
import { toNodeListener } from 'h3'
import { listen } from 'listhen'
import { build } from 'nuxt'

export default async (options = {}) => {
  const nuxt = await loadNuxt({ ...options, dev: true })

  const listener = await listen(toNodeListener(nuxt.server.app))

  const address = listener.server.address()
  nuxt.options.devServer.url = listener.url
  nuxt.options.devServer.port = address.port
  nuxt.options.devServer.host = address.address
  nuxt.options.devServer.https = listener.https
  await build(nuxt)

  return nuxt
}
