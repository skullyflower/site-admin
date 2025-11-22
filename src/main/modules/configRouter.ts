import fs from 'fs'
import { checkFile, configfilepath } from './pathData'
import { AdminConfig } from '../../shared/types'
interface ConfigResponse {
  message: string
}

export const updateAdminConfig = (config: AdminConfig): string => {
  if (config.pathToSite) {
    try {
      checkFile(configfilepath, { pathToSite: config.pathToSite })
      const configData: AdminConfig = config as AdminConfig
      fs.writeFileSync(configfilepath, JSON.stringify(configData))
      const response: ConfigResponse = { message: 'Updated Config page data!' }
      return JSON.stringify(response)
    } catch (err: unknown) {
      const response: ConfigResponse = { message: `Config page data update failed. ${err}` }
      return JSON.stringify(response)
    }
  } else {
    const response: ConfigResponse = { message: 'You must fill out all fields.' }
    return JSON.stringify(response)
  }
}

export const getAdminConfig = (): string => {
  checkFile(configfilepath, { pathToSite: '' })
  try {
    const configDataString: string = fs.readFileSync(configfilepath, 'utf8')
    const configDataObject: AdminConfig = JSON.parse(configDataString)
    if (!configDataObject.pathToSite) throw new Error('No path to site found.')
    return JSON.stringify(configDataObject)
  } catch (err: unknown) {
    console.log(err)
    const response: ConfigResponse = { message: `Config page data retrieval failed. ${err}` }
    return JSON.stringify(response)
  }
}
