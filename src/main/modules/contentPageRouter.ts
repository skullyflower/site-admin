import { readdirSync, readFileSync, writeFileSync } from 'fs'
import getConfig from './pathData'

const { pathToPublic } = getConfig()
const rootdir = `${pathToPublic}/data`

export const getPages = (): string => {
  const files = readdirSync(rootdir)
  return JSON.stringify({ files: files })
}

export const getPage = (page): string => {
  const pagefilepath = `${rootdir}/${page}-data.json`
  const pageDataJson = readFileSync(pagefilepath, 'utf8')
  const pageData = JSON.parse(pageDataJson)
  if (pageData) {
    JSON.stringify(pageData)
  }
  return JSON.stringify({ message: 'Page not found.' })
}

export const updatePage = (page, body): string => {
  const pagefilepath = `${rootdir}/${page}-data.json`
  if (body) {
    try {
      const oldpageDataString = readFileSync(pagefilepath, 'utf8')
      const oldpageObject = JSON.parse(oldpageDataString)
      const newpageData = { ...oldpageObject, ...body }
      writeFileSync(pagefilepath, JSON.stringify(newpageData))
      return JSON.stringify({ message: 'Updated page!' })
    } catch (err) {
      console.log(err)
      return JSON.stringify({ message: 'page update failed.' })
    }
  } else {
    return JSON.stringify({ message: 'You must fill out all fields.' })
  }
}

//TODO get list of pages, create pages, delete pages as well as get and set page. I think this could be easily achieved with a pages subdirectory in data/
