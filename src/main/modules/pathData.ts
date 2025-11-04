import { app } from 'electron'
import fs from 'fs'
import { join } from 'path'

export const configfilepath = './config.json'
export const getConfig = (): { pathToPublic: string; pathToBuild: string; siteURl: string } => {
  checkFile(configfilepath, { pathToSite: '' })
  try {
    fs.readFileSync(configfilepath)
  } catch (err) {
    console.log(
      `No config.json file found. Please create one in the root directory of your site. : ${err}`
    )
    process.exit()
  }
  const config = fs.readFileSync('./config.json')

  const pathToSite = join(app.getPath('home'), JSON.parse(config.toString()).pathToSite)
  const siteData = fs.readFileSync(`${pathToSite}/public/data/site-data.json`)

  const pathToPublic = `${pathToSite}/public`
  const pathToBuild = `${pathToSite}/build`
  const siteURl = JSON.parse(siteData.toString()).live_site_url

  return { pathToPublic, pathToBuild, siteURl }
}

export const checkPath = (path): void => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

export const checkFile = (path, defaultVal): void => {
  if (!fs.existsSync(path)) {
    console.log(`No file found at ${path}. Creating one with default
      values
      `)
    checkPath(path)
    fs.writeFileSync(path, JSON.stringify(defaultVal ?? {}))
  }
}

export default getConfig
