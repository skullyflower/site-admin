import fs from 'fs'
import processRss from './processBlogRSS.js'
import processFile from './imageProcessor'
import getConfig from './pathData.js'

const { pathToPublic, pathToBuild, siteURl } = getConfig()

const blogfilepath = `${pathToPublic}/data/blog_data.json`
const blogfilepath_build = `${pathToBuild}/data/blog_data.json`
const blogRSSpath = `${pathToPublic}/data/blog.rss`
const blogRSSpath_build = `${pathToBuild}/data/blog.rss`

export const getBlogs = (): string => {
  try {
    const blogData = fs.readFileSync(blogfilepath)
    const blog = JSON.parse(blogData.toString())
    if (blog.entries) {
      return JSON.stringify(blog)
    } else {
      return JSON.stringify({ message: "Couldn't read blog file" })
    }
  } catch (error) {
    console.log(error)
    return JSON.stringify({ message: 'Blog Data Get Failed' })
  }
}

export const updateBlogInfo = (blogInfo): string => {
  if (blogInfo) {
    try {
      const oldpageDataString = fs.readFileSync(blogfilepath)
      const oldpageObject = JSON.parse(oldpageDataString.toString())
      const newpageData = { ...oldpageObject, ...blogInfo }
      fs.writeFileSync(blogfilepath, JSON.stringify(newpageData))
      fs.copyFileSync(blogfilepath, blogfilepath_build)
      return JSON.stringify({ message: 'Updated Blog page!' })
    } catch (err) {
      console.log(err)
      return JSON.stringify({ message: 'Blog page update failed.' })
    }
  } else {
    return JSON.stringify({ message: 'You must fill out all fields.' })
  }
}

export const updateBlogPost = (entry, files): string => {
  const blogPostData = fs.readFileSync(blogfilepath)
  const blogEntries = JSON.parse(blogPostData.toString())
  if (entry) {
    try {
      const update = JSON.parse(entry)
      const updateIndex = blogEntries.entries.findIndex(
        (entry) => entry.id === update.id || entry.title === update.title
      )
      if (updateIndex !== -1) {
        // existing
        blogEntries.entries[updateIndex] = update
      } else {
        // new
        blogEntries.entries.unshift(update)
      }
      const bigDestPath = `${pathToPublic}/images/blog/`
      //check for path. if it doesn't exist create it.
      const smallDestPath = `${pathToPublic}/images/blog/smaller/`

      if (files) {
        for (const file of files) {
          try {
            processFile(file, 850, bigDestPath)
            processFile(file, 450, smallDestPath)
            fs.copyFileSync(
              `${smallDestPath}${file.filename}`,
              `${smallDestPath.replace('public', 'build')}`
            )
            fs.linkSync(
              `${smallDestPath}${file.filename}`,
              `${smallDestPath.replace('skullyflower', 'skullyflowerTS')}${file.filename}`
            )

            fs.copyFileSync(
              `${bigDestPath}${file.filename}`,
              `${bigDestPath.replace('public', 'build')}`
            )
            fs.linkSync(
              `${bigDestPath}${file.filename}`,
              `${bigDestPath.replace('skullyflower', 'skullyflowerTS')}${file.filename}`
            )
            update.image = `${bigDestPath.replace(pathToPublic, siteURl)}${file.filename}`
          } catch (err) {
            console.log(`Failed: file upload: ${err}`)
          }
        }
      }

      fs.writeFileSync(blogfilepath, JSON.stringify(blogEntries))
      fs.writeFileSync(blogfilepath_build, JSON.stringify(blogEntries))

      const RSS = processRss(blogEntries)
      fs.writeFileSync(blogRSSpath, RSS)
      fs.writeFileSync(blogRSSpath_build, RSS)
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
  try {
    const blogEntrieData = fs.readFileSync(blogfilepath)
    const blogEntries = JSON.parse(blogEntrieData.toString())
    const entryToDelete = blogid
    const entryIndex = blogEntries.entries.findIndex((entry) => entry.id === entryToDelete)
    const removedEntry = blogEntries.entries.splice(entryIndex, 1)
    const newblogEntries = blogEntries
    fs.writeFileSync(blogfilepath, JSON.stringify(newblogEntries))
    const RSS = processRss(newblogEntries)
    fs.writeFileSync(blogRSSpath, RSS)
    return JSON.stringify({ message: `Removed entry: ${removedEntry.title}` })
  } catch (error) {
    console.log(error)
    return JSON.stringify({ message: `Failed to remove entry: ${blogid}` })
  }
}
