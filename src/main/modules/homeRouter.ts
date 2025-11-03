import fs from 'fs'
import getConfig, { checkPath } from './pathData'

export interface pageInfo {
  page_title: string
  page_description: string
  page_content: string
}
export interface SiteInfo extends pageInfo {
  company_name: string
  site_theme: string
  live_site_url: string
  sitelogo: string
}

const defaultValues: SiteInfo = {
  page_title: '',
  page_description: '',
  page_content: '',
  company_name: '',
  site_theme: '',
  live_site_url: '',
  sitelogo: ''
}

const { pathToPublic } = getConfig()

const homefilepath = `${pathToPublic}/data/site-data.json`

export const getSiteInfo = (): string => {
  try {
    checkPath(homefilepath)
    const homeData = fs.readFileSync(homefilepath, 'utf8') || JSON.stringify(defaultValues)
    return homeData
  } catch (err) {
    console.log(err)
    return JSON.stringify(defaultValues)
  }
}

export const updateSiteInfo = (siteInfo): string => {
  if (JSON.parse(siteInfo)) {
    const values = JSON.parse(siteInfo)
    try {
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
