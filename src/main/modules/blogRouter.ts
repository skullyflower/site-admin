import { BlogInfo, BlogEntry } from '../../shared/types'
import fs, { writeFileSync } from 'fs'
import processRss from '../utilities/processBlogRSS.js'
import getPathsFromConfig, { checkFile, checkPath } from '../utilities/pathData.js'
import { blogFile, blogRSSFile, defaultBlogInfo } from '../../shared/constants'
import path, { join } from 'path'
import processFile from '../utilities/imageProcessor'

const getPaths = (): {
  tempPath: string
  blogfilepath: string
  blogRSSpath: string
  blogImagesPath: string
} => {
  const { pathToPublic } = getPathsFromConfig()
  const tempPath = path.join(pathToPublic, 'temp')
  const blogfilepath = join(pathToPublic, 'data', blogFile)
  const blogRSSpath = join(pathToPublic, 'data', blogRSSFile)
  const blogImagesPath = join(pathToPublic, 'images', 'blog')
  return { tempPath, blogfilepath, blogRSSpath, blogImagesPath }
}

export const getBlog = (): string => {
  const { blogfilepath } = getPaths()
  try {
    checkFile(blogfilepath, defaultBlogInfo)
    const blogData = fs.readFileSync(blogfilepath)
    const blogObject: BlogInfo = JSON.parse(blogData.toString()) as BlogInfo
    if (blogObject) {
      return JSON.stringify(blogObject)
    } else {
      return JSON.stringify(defaultBlogInfo as BlogInfo)
    }
  } catch (error) {
    console.log(error)
    return JSON.stringify(defaultBlogInfo as BlogInfo)
  }
}

export const updateBlogInfo = (blogInfo: BlogInfo): string => {
  const { blogfilepath } = getPaths()
  try {
    const oldpageObject: BlogInfo = JSON.parse(getBlog())
    const newpageData: BlogInfo = { ...oldpageObject, ...blogInfo }
    writeFileSync(blogfilepath, JSON.stringify(newpageData))
    return JSON.stringify({ message: 'Updated Blog page!' })
  } catch (error) {
    console.log(error)
    return JSON.stringify({ message: 'Failed to update blog info.' })
  }
}

export const updateBlogPost = (entry: BlogEntry): string => {
  const { blogfilepath, blogRSSpath, blogImagesPath, tempPath } = getPaths()
  if (entry) {
    try {
      checkFile(blogfilepath, defaultBlogInfo)
      const blogObject: BlogInfo = JSON.parse(getBlog()) as BlogInfo
      const entries = blogObject.entries || []
      const updateIndex = entries.findIndex(
        (entry) => entry.id === entry.id || entry.title === entry.title
      )
      if (updateIndex !== -1) {
        entries[updateIndex] = entry
      } else {
        entries.unshift(entry)
      }
      checkPath(blogImagesPath)
      fs.readdirSync(tempPath).forEach(async (file) => {
        if (entry.image.includes(file.split('/').pop() || '')) {
          const bigResult = await processFile(join(tempPath, file), 850, blogImagesPath)
          if (typeof bigResult === 'string') {
            console.error(`Wrong Big File type.`)
          } else if (bigResult.relativeUrl) {
            console.log('Big file uploaded to ', blogImagesPath)
          }
          fs.unlinkSync(join(tempPath, file))
        } else {
          console.log(`File ${file} not found in entry.image`)
        }
      })

      writeFileSync(blogfilepath, JSON.stringify({ ...blogObject, entries }))

      const RSS = processRss(blogObject)
      fs.writeFileSync(blogRSSpath, RSS)
      return JSON.stringify({ message: 'Updated Blog!' })
    } catch (error) {
      console.log(error)
      return JSON.stringify({ message: 'Blog update failed.' })
    }
  } else {
    return JSON.stringify({ message: 'You must fill out all fields.' })
  }
}

export const deletEntry = (blogid: string): string => {
  const { blogfilepath, blogRSSpath } = getPaths()
  try {
    checkFile(blogfilepath, defaultBlogInfo)
    checkFile(blogRSSpath, '')
    const blogJSONString = fs.readFileSync(blogfilepath)
    const blogData: BlogInfo = JSON.parse(blogJSONString.toString()) as BlogInfo
    const entryToDelete = blogData.entries.find((entry) => entry.id === blogid)
    if (!entryToDelete) {
      return JSON.stringify({ message: `Entry not found: ${blogid}` })
    }
    const newblogEntries = blogData.entries.filter((entry) => entry.id !== blogid)
    const newblogData: BlogInfo = { ...blogData, entries: newblogEntries || [] }
    fs.writeFileSync(blogfilepath, JSON.stringify(newblogData))
    const RSS = processRss(newblogData)
    fs.writeFileSync(blogRSSpath, RSS)
    return JSON.stringify({ message: `Removed entry: ${entryToDelete?.title}` })
  } catch (error) {
    console.log(error)
    return JSON.stringify({ message: `Failed to remove entry: ${blogid}` })
  }
}
