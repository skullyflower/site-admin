import { BlogInfo, BlogEntry } from '../../shared/types'
import fs from 'fs'
import processRss from '../utilities/processBlogRSS.js'
import processFile from '../utilities/imageProcessor'
import getPathsFromConfig, { checkFile } from '../utilities/pathData.js'
import { blogFile, blogRSSFile, defaultBlogInfo } from '../../shared/constants'
import path from 'path'

const getPaths = (): { tempPath: string; blogfilepath: string; blogRSSpath: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const tempPath = path.join(pathToPublic, 'temp')
  const blogfilepath = `${pathToPublic}/data/${blogFile}`
  const blogRSSpath = `${pathToPublic}/data/${blogRSSFile}`
  return { tempPath, blogfilepath, blogRSSpath }
}

export const getBlogs = (): string => {
  const { blogfilepath } = getPaths()
  try {
    checkFile(blogfilepath, defaultBlogInfo)
    const blogData = fs.readFileSync(blogfilepath)
    const blogObject: BlogInfo = JSON.parse(blogData.toString()) as BlogInfo
    if (blogObject) {
      return JSON.stringify(blogObject)
    } else {
      return JSON.stringify({ message: "Couldn't read blog file" })
    }
  } catch (error) {
    console.log(error)
    return JSON.stringify({ message: 'Blog Data Get Failed' })
  }
}

export const updateBlogInfo = (blogInfo): string => {
  const { blogfilepath } = getPaths()
  if (blogInfo) {
    try {
      checkFile(blogfilepath, defaultBlogInfo)
      const oldpageDataString = fs.readFileSync(blogfilepath)
      const oldpageObject: BlogInfo = JSON.parse(oldpageDataString.toString()) as BlogInfo
      const newpageData = { ...oldpageObject, ...blogInfo }
      fs.writeFileSync(blogfilepath, JSON.stringify(newpageData))
      return JSON.stringify({ message: 'Updated Blog page!' })
    } catch (err) {
      console.log(err)
      return JSON.stringify({ message: 'Blog page update failed.' })
    }
  } else {
    return JSON.stringify({ message: 'You must fill out all fields.' })
  }
}

export const updateBlogPost = (entry: BlogEntry): string => {
  const { blogfilepath, tempPath, blogRSSpath } = getPaths()
  if (entry) {
    try {
      checkFile(blogfilepath, defaultBlogInfo)
      const blogInfoData = fs.readFileSync(blogfilepath)
      const blogObject: BlogInfo = JSON.parse(blogInfoData.toString()) as BlogInfo

      const update: BlogEntry = entry
      const updateIndex = blogObject.entries.findIndex(
        (entry) => entry.id === update.id || entry.title === update.title
      )
      if (updateIndex !== -1) {
        // existing
        blogObject.entries[updateIndex] = update
      } else {
        // new
        blogObject.entries.unshift(update)
      }
      const destPath = `images/blog/`
      const smallDestPath = `${destPath}/smaller/`
      fs.readdirSync(tempPath).forEach(async (file) => {
        if (entry.image.includes(file.split('/').pop() || '')) {
          await processFile(path.join(tempPath, file), 850, destPath)
          await processFile(path.join(tempPath, file), 450, smallDestPath)
          fs.unlinkSync(path.join(tempPath, file))
        } else {
          console.log(`File ${file} not found in entry.image`)
        }
      })

      fs.writeFileSync(blogfilepath, JSON.stringify({ ...blogObject, entries: blogObject.entries }))

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
