import { runCommand } from 'nuxi'

export default (options = {}) =>
  runCommand('dev', undefined, { config: options.config })
