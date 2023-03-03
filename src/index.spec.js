import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import fs from 'fs-extra'
import outputFiles from 'output-files'
import P from 'path'

import self from './index.js'

export default tester(
  {
    config: async () => {
      await outputFiles({
        'package.json': JSON.stringify({ type: 'module' }),
        'pages-new/index.vue': endent`
          <template>
            <div class="foo" />
          </template>
        `,
      })

      const devServer = await self({
        config: {
          modules: [() => fs.outputFile('foo.txt', '')],
          telemetry: false,
        },
      })
      try {
        expect(await fs.exists('foo.txt')).toEqual(true)
      } finally {
        await devServer.close()
      }
    },
    async works() {
      await outputFiles({
        'package.json': JSON.stringify({ type: 'module' }),
        'pages/index.vue': endent`
          <template>
            <div class="foo" />
          </template>
        `,
      })

      const devServer = await self({ config: { telemetry: false } })
      try {
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
        await this.page.goto('http://localhost:3000')
        await this.page.waitForSelector('.bar')
      } finally {
        await devServer.close()
      }
    },
  },
  [testerPluginTmpDir(), testerPluginPuppeteer()]
)
