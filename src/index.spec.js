import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import fs from 'fs-extra'
import P from 'path'

import self from './index.js'

export default tester(
  {
    async works() {
      await fs.outputFile(
        P.join('pages', 'index.vue'),
        endent`
      <template>
        <div class="foo" />
      </template>
    `
      )

      const nuxt = await self()
      await this.page.goto('http://localhost:3000')
      await this.page.waitForSelector('.foo')
      await fs.outputFile(
        P.join('pages', 'index.vue'),
        endent`
      <template>
        <div class="bar" />
      </template>
    `
      )
      await this.page.waitForSelector('.bar')
      await nuxt.close()
    },
  },
  [testerPluginTmpDir(), testerPluginPuppeteer()]
)
