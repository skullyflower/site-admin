import fs from 'fs'
import { join } from 'path'
import getPathsFromConfig, { checkFile } from '../utilities/pathData'
import { siteFile, defaultSiteData } from '../../shared/constants'
import { ok, okMessage, fail } from '../utilities/apiResponse'

export const getSiteInfo = (): string => {
  const { pathToPublic } = getPathsFromConfig()
  const homefilepath = pathToPublic ? join(pathToPublic, 'data', siteFile) : null
  try {
    if (!homefilepath) throw new Error('No path to site found.')
    checkFile(homefilepath, defaultSiteData)
    const homeData = fs.readFileSync(homefilepath, 'utf8') || JSON.stringify(defaultSiteData)
    return JSON.stringify(ok(JSON.parse(homeData)))
  } catch (err) {
    console.log(err)
    return JSON.stringify(ok(defaultSiteData))
  }
}

export const updateSiteInfo = (siteInfo): string => {
  const { pathToPublic } = getPathsFromConfig()
  const homefilepath = pathToPublic ? join(pathToPublic, 'data', siteFile) : null
  if (!homefilepath) throw new Error('No path to site found.')
  if (JSON.parse(siteInfo)) {
    const values = JSON.parse(siteInfo)
    try {
      checkFile(homefilepath, defaultSiteData)

      const oldHomeDataString = fs.readFileSync(homefilepath, 'utf8')
      const oldHomeObject = JSON.parse(oldHomeDataString)
      const newHomeData = { ...oldHomeObject, ...values }
      fs.writeFileSync(homefilepath, JSON.stringify(newHomeData))
      fs.writeFileSync(homefilepath.replace('public', 'dist'), JSON.stringify(newHomeData))
      return JSON.stringify(okMessage('Updated Homepage data!'))
    } catch (err) {
      console.log(err)
      return JSON.stringify(fail('Homepage data update failed.'))
    }
  } else {
    return JSON.stringify(fail('You must fill out all fields.'))
  }
}
