import { app } from 'electron'
import fs from 'fs'
import path, { join } from 'path'
import { configFile } from '../../shared/constants.d'
import { getAdminConfig } from './configRouter'

export const configfilepath = path.join(app.getPath('home'), '.WebSiteConfig', configFile)

export const getPathsFromConfig = (): {
  pathToPublic: string
} => {
  try {
    const configJson = getAdminConfig()
    const config = JSON.parse(configJson)
    const pathToSite = config.pathToSite
    const pathToPublic = join(app.getPath('home'), pathToSite, 'public')

    return { pathToPublic }
  } catch (err) {
    console.log(
      `No config.json file found. Please create one in the root directory of your site. : ${err}`
    )
    return { pathToPublic: '' }
  }
}

export const checkPath = (path): boolean => {
  try {
    console.log(`Checking path: ${path}`)
    if (!fs.existsSync(path) || !fs.lstatSync(path).isDirectory()) {
      fs.mkdirSync(path, { recursive: true })
      return true
    }
    return true
  } catch (err) {
    console.log(`Failed to create directory ${path}: ${err}`)
    return false
  }
}

export const checkFile = (path, defaultVal): void => {
  try {
    if (!fs.existsSync(path) || !fs.lstatSync(path).isFile()) {
      console.log(`No file found at ${path}. Creating one with default
      values
      `)
      if (checkPath(path.substring(0, path.lastIndexOf('/') + 1))) {
        fs.writeFileSync(path, JSON.stringify(defaultVal ?? {}))
      }
    }
  } catch (err) {
    console.log(`Failed to create file ${path}: ${err}`)
  }
}
export default getPathsFromConfig
