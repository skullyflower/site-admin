import fs from 'fs'
import { configfilepath } from './pathData'

interface ConfigData {
  pathToSite: string
}

interface ConfigResponse {
  message: string
}

export const updateAdminConfig = (config: ConfigData): string => {
  if (config.pathToSite) {
    try {
      const configData: ConfigData = config
      fs.writeFileSync(configfilepath, JSON.stringify(configData))
      const response: ConfigResponse = { message: 'Updated Config page data!' }
      return JSON.stringify(response)
    } catch (err: unknown) {
      console.log(err)
      const response: ConfigResponse = { message: 'Config page data update failed.' }
      return JSON.stringify(response)
    }
  } else {
    const response: ConfigResponse = { message: 'You must fill out all fields.' }
    return JSON.stringify(response)
  }
}

export const getAdminConfig = (): string => {
  try {
    const configDataString: string = fs.readFileSync(configfilepath, 'utf8')
    const configDataObject: ConfigData = JSON.parse(configDataString)
    return JSON.stringify(configDataObject)
  } catch (err: unknown) {
    console.log(err)
    const response: ConfigResponse = { message: 'Config page data retrieval failed.' }
    return JSON.stringify(response)
  }
}
