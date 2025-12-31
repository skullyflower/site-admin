import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import getPathsFromConfig, { checkFile } from './pathData'
import { ApiMessageResponse, PageInfo } from '../../shared/types'

const { pathToPublic } = getPathsFromConfig()
const rootdir = `${pathToPublic}/data`

export const getPageFiles = (): string[] => {
  try {
    const files = readdirSync(rootdir)
    const pageFiles = files.filter((file) => file.endsWith('-page.json'))
    return pageFiles
  } catch (err) {
    console.log(err)
    return []
  }
}

export const getPages = (): string => {
  const pageFiles = getPageFiles()
  const pages = pageFiles.map((file) => file.replace('-page.json', ''))
  return JSON.stringify(pages || [])
}

export const getPage = (pageId: string): PageInfo | string => {
  const pagefilepath = `${rootdir}/${pageId}-page.json`
  checkFile(pagefilepath, { page_title: '', page_description: '', page_content: '' })
  const pageDataJson = readFileSync(pagefilepath, 'utf8')
  //const pageData = JSON.parse(pageDataJson)
  if (pageDataJson) {
    return pageDataJson
  }
  return JSON.stringify({ message: 'Page not found.' })
}

export const updatePage = (page, body): string => {
  const pagefilepath = `${rootdir}/${page}-page.json`
  if (body) {
    try {
      checkFile(pagefilepath, { page_title: '', page_description: '', page_content: '' })
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

export const createPage = (pageId: string): string => {
  const pagefilepath = `${rootdir}/${pageId}-page.json`
  checkFile(pagefilepath, { page_title: '', page_description: '', page_content: '' })
  const pageData: PageInfo = {
    page_id: pageId,
    page_title: '',
    page_description: '',
    page_content: ''
  }
  writeFileSync(pagefilepath, JSON.stringify(pageData))
  return JSON.stringify({ message: 'Page created!' } as ApiMessageResponse)
}

export const deletePage = (pageId: string): string => {
  const pagefilepath = `${rootdir}/${pageId}-page.json`
  if (existsSync(pagefilepath)) {
    unlinkSync(pagefilepath)
    return JSON.stringify({ message: 'Page deleted!' })
  } else {
    return JSON.stringify({ message: 'Page not found.' })
  }
}
//TODO get list of pages, create pages, delete pages as well as get and set page. I think this could be easily achieved with a pages subdirectory in data/
