import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import getPathsFromConfig, { checkFile } from '../utilities/pathData'
import { PageInfo } from '../../shared/types'
import { moveImages } from './imagesRouter'
import { join } from 'path'
import { ok, okMessage, fail } from '../utilities/apiResponse'

const getPaths = (): { rootdir: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const rootdir = join(pathToPublic, 'data')
  return { rootdir }
}

export const getPageFiles = (): string[] => {
  const { rootdir } = getPaths()
  try {
    const files = readdirSync(rootdir)
    const pageFiles = files.filter((file) => file.endsWith('-page.json'))
    return pageFiles
  } catch (err) {
    console.log(err)
    return []
  }
}

const updatePagesData = (): void => {
  //updates pages list data
  const { rootdir } = getPaths()
  const pagesFile = join(rootdir, 'pages-data.json')
  checkFile(pagesFile, [])
  const pageFiles = getPageFiles()
  const pagesData = pageFiles.map((file) => {
    const pageData = readFileSync(join(rootdir, file), 'utf8')
    const pageObject = JSON.parse(pageData)
    return { page_id: pageObject.page_id, page_title: pageObject.page_title }
  })
  writeFileSync(pagesFile, JSON.stringify(pagesData))
  writeFileSync(pagesFile.replace('public', 'dist'), JSON.stringify(pagesData))
}

export const getPages = (): string => {
  const pageFiles = getPageFiles()
  const pages = pageFiles.map((file) => file.replace('-page.json', ''))
  return JSON.stringify(ok(pages || []))
}

export const getPage = (pageId: string): string => {
  const { rootdir } = getPaths()
  const pagefilepath = join(rootdir, `${pageId}-page.json`)
  checkFile(pagefilepath, { page_title: '', page_description: '', page_content: '' })
  const pageDataJson = readFileSync(pagefilepath, 'utf8')
  if (pageDataJson) {
    return JSON.stringify(ok(JSON.parse(pageDataJson) as PageInfo))
  }
  return JSON.stringify(fail('Page not found.'))
}

export const updatePage = (page, body): string => {
  // updates one page.
  const { rootdir } = getPaths()
  const pagefilepath = join(rootdir, `${page}-page.json`)
  if (body) {
    try {
      checkFile(pagefilepath, {
        page_title: '',
        page_description: '',
        page_content: ''
      })
      if (body.images) {
        const imageNames = body.images.map((image) => image.split('/').pop() || '')
        console.log('[move images]', imageNames, `images/${page}`)
        moveImages(imageNames, `images/${page}`)
      } else {
        console.log('no images to move')
      }
      const oldpageDataString = readFileSync(pagefilepath, 'utf8')
      const oldpageObject = JSON.parse(oldpageDataString)
      const newpageData = { ...oldpageObject, ...body }
      writeFileSync(pagefilepath, JSON.stringify(newpageData))
      writeFileSync(pagefilepath.replace('public', 'dist'), JSON.stringify(newpageData))
      updatePagesData()
      return JSON.stringify(okMessage('Updated page!'))
    } catch (err) {
      console.log(err)
      return JSON.stringify(fail('page update failed.'))
    }
  } else {
    return JSON.stringify(fail('You must fill out all fields.'))
  }
}

export const createPage = (pageId: string): string => {
  const { rootdir } = getPaths()
  const pagefilepath = join(rootdir, `${pageId}-page.json`)
  checkFile(pagefilepath, { page_title: '', page_description: '', page_content: '' })
  const pageData: PageInfo = {
    page_id: pageId,
    page_title: '',
    page_description: '',
    page_content: ''
  }
  writeFileSync(pagefilepath, JSON.stringify(pageData))
  writeFileSync(pagefilepath.replace('public', 'dist'), JSON.stringify(pageData))
  updatePagesData()
  return JSON.stringify(okMessage('Page created!'))
}

export const deletePage = (pageId: string): string => {
  const { rootdir } = getPaths()
  const pagefilepath = join(rootdir, `${pageId}-page.json`)
  if (existsSync(pagefilepath)) {
    unlinkSync(pagefilepath)
    unlinkSync(pagefilepath.replace('public', 'build'))
    updatePagesData()
    return JSON.stringify(okMessage('Page deleted!'))
  } else {
    return JSON.stringify(fail('Page not found.'))
  }
}
//TODO get list of pages, create pages, delete pages as well as get and set page. I think this could be easily achieved with a pages subdirectory in data/
