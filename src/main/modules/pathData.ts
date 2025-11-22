import { app } from 'electron'
import fs from 'fs'
import path, { join } from 'path'
import { configFile, defaultSitePath } from '../../shared/constants.d'

export const configfilepath = path.join(app.getPath('home'), '.WebSiteConfig', configFile)

export const getPathsFromConfig = (): {
  pathToPublic: string
  pathToBuild: string
} => {
  try {
    checkFile(configfilepath, { pathToSite: defaultSitePath })
    const config = fs.readFileSync(configfilepath)
    if (!JSON.parse(config.toString()).pathToSite) throw new Error('No path to site found.')
    const pathToSite = join(app.getPath('home'), JSON.parse(config.toString()).pathToSite)
    const pathToPublic = `${pathToSite}/public`
    const pathToBuild = `${pathToSite}/build`

    return { pathToPublic, pathToBuild }
  } catch (err) {
    console.log(
      `No config.json file found. Please create one in the root directory of your site. : ${err}`
    )
    return { pathToPublic: '', pathToBuild: '' }
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
