import fs from 'fs'
import { checkFile, configfilepath } from '../utilities/pathData'
import { AdminConfig } from '../../shared/types'
import { ok, okMessage, fail } from '../utilities/apiResponse'

export const updateAdminConfig = (config: AdminConfig): string => {
  if (config.pathToSite) {
    try {
      checkFile(configfilepath, { pathToSite: config.pathToSite })
      const configData: AdminConfig = config as AdminConfig
      fs.writeFileSync(configfilepath, JSON.stringify(configData))
      return JSON.stringify(okMessage('Updated Config page data!'))
    } catch (err: unknown) {
      return JSON.stringify(fail(`Config page data update failed. ${err}`))
    }
  } else {
    return JSON.stringify(fail('You must fill out all fields.'))
  }
}

export const getAdminConfig = (): string => {
  checkFile(configfilepath, { pathToSite: '' })
  try {
    const configDataString: string = fs.readFileSync(configfilepath, 'utf8')
    const configDataObject: AdminConfig = JSON.parse(configDataString)
    if (!configDataObject.pathToSite) throw new Error('No path to site found.')
    return JSON.stringify(ok(configDataObject))
  } catch (err: unknown) {
    console.log(err)
    return JSON.stringify(fail(`Config page data retrieval failed. ${err}`))
  }
}
