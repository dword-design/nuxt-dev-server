import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginPuppeteer from '@dword-design/tester-plugin-puppeteer'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import fs from 'fs-extra'
import outputFiles from 'output-files'
import P from 'path'
import kill from 'tree-kill-promise'
import { execaCommand } from 'execa'

import self from './index.js'

export default tester(
  {
    async works() {
      await outputFiles({
        'package.json': JSON.stringify({ type: 'module' }),
        'pages/index.vue': endent`
          <template>
            <div class="foo" />
          </template>
        `,
      })

      //const nuxt = await self({ config: { telemetry: false } })
      const childProcess = execaCommand('nuxt dev', { stdio: 'inherit', env: { NODE_ENV: '' } })
      await new Promise(resolve => setTimeout(resolve, 10000))
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
      //await nuxt.close()
      await kill(childProcess.pid)
    },
  },
  [testerPluginTmpDir(), testerPluginPuppeteer()]
)
