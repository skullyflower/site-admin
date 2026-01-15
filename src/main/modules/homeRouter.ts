import fs from 'fs'
import getPathsFromConfig, { checkFile } from '../utilities/pathData'
import { siteFile, defaultSiteData } from '../../shared/constants'

export const getSiteInfo = (): string => {
  const { pathToPublic } = getPathsFromConfig()
  const homefilepath = pathToPublic ? `${pathToPublic}/data/${siteFile}` : null
  try {
    if (!homefilepath) throw new Error('No path to site found.')
    checkFile(homefilepath, defaultSiteData)
    const homeData = fs.readFileSync(homefilepath, 'utf8') || JSON.stringify(defaultSiteData)
    return homeData
  } catch (err) {
    console.log(err)
    return JSON.stringify(defaultSiteData)
  }
}

export const updateSiteInfo = (siteInfo): string => {
  const { pathToPublic } = getPathsFromConfig()
  const homefilepath = pathToPublic ? `${pathToPublic}/data/${siteFile}` : null
  if (!homefilepath) throw new Error('No path to site found.')
  if (JSON.parse(siteInfo)) {
    const values = JSON.parse(siteInfo)
    try {
      checkFile(homefilepath, defaultSiteData)

      const oldHomeDataString = fs.readFileSync(homefilepath, 'utf8')
      const oldHomeObject = JSON.parse(oldHomeDataString)
      const newHomeData = { ...oldHomeObject, ...values }
      fs.writeFileSync(homefilepath, JSON.stringify(newHomeData))
      return JSON.stringify({ message: 'Updated Homepage data!' })
    } catch (err) {
      console.log(err)
      return JSON.stringify({ message: 'Homepage data update failed.' })
    }
  } else {
    return JSON.stringify({ message: 'You must fill out all fields.' })
  }
}
