import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import processFile, { ProcessedImage } from './imageProcessor'
import getPathsFromConfig, { checkPath } from './pathData'

const { pathToPublic, pathToBuild } = getPathsFromConfig()
const tempPath = path.join(pathToPublic, 'temp')

export const getPreviewImages = async (files: string[]): Promise<string[]> => {
  checkPath(tempPath)
  if (files.length > 0) {
    console.log('files', files)
    try {
      const newFilePaths = await Promise.all(
        files.map(async (file) => {
          const newFilePath = `${tempPath}/${file.split('/').pop()}`
          fs.copyFileSync(file, newFilePath)
          return newFilePath.replace(pathToPublic, 'http://localhost:3000/')
        })
      )
      return newFilePaths
    } catch (err) {
      console.error('Failed to get preview images:', err)
      return []
    }
  }
  return []
}

// path from skullyflower/admin/
const bigSourcePath = tempPath
const smallSourcePath = path.join(tempPath, 'small')

const publicPath = `${pathToPublic}/`
const buildPath = `${pathToBuild}/`

const getDestinationPaths = (
  topdir,
  subdir = 'bigger'
): {
  pubPathBig: string
  pubPathSmall: string
  buildPathBig: string
  buildPathSmall: string
} => {
  if (subdir !== 'bigger' && topdir !== 'images') {
    return {
      pubPathBig: `${publicPath}${topdir}/${subdir}/bigger/`,
      pubPathSmall: `${publicPath}${topdir}/${subdir}/`,
      buildPathBig: `${buildPath}${topdir}/${subdir}/bigger/`,
      buildPathSmall: `${buildPath}${topdir}/${subdir}/`
    }
  }
  return {
    pubPathBig: `${publicPath}${topdir}/${subdir}/`,
    pubPathSmall: `${publicPath}${topdir}/`,
    buildPathBig: `${buildPath}${topdir}/${subdir}/`,
    buildPathSmall: `${buildPath}${topdir}/`
  }
}

export const getStagedImages = (): string => {
  try {
    checkPath(bigSourcePath)
    checkPath(smallSourcePath)
    const files = fs.readdirSync(bigSourcePath)
    if (files) {
      const filtered = files.filter(
        (file) =>
          file.endsWith('.jpeg') ||
          file.endsWith('.jpg') ||
          file.endsWith('.png') ||
          file.endsWith('.gif')
      )
      if (filtered.length) {
        return JSON.stringify(filtered)
      }
      return JSON.stringify({ message: 'No images to move.' })
    }
  } catch (err) {
    if (err) {
      return JSON.stringify({ message: "Couldn't read directory." })
    }
  }
  return JSON.stringify({ message: 'No images to move.' })
}

export const moveImages = (filesToMove, toplevel, secondLevels): string => {
  if (filesToMove && filesToMove.length > 0 && toplevel && secondLevels) {
    const filearray = !Array.isArray(filesToMove) ? [filesToMove] : filesToMove

    const destPaths = getDestinationPaths(toplevel, secondLevels)
    const bigDestPath = destPaths.pubPathBig
    const smallDestPath = destPaths.pubPathSmall
    const bigDestPath_build = destPaths.buildPathBig
    const smallDestPath_build = destPaths.buildPathSmall
    let message = ''
    let smallfiles: string[] = []
    try {
      checkPath(smallSourcePath)
      smallfiles = fs.readdirSync(smallSourcePath, 'utf8')
    } catch (err) {
      console.log(`Cannot read small dir: ${smallSourcePath}: ${err}`)
    }
    filearray.forEach((file) => {
      try {
        /** copy to public */
        fs.copyFileSync(`${bigSourcePath}${file}`, `${bigDestPath}${file}`)
        fs.linkSync(
          `${bigDestPath}${file}`,
          `${bigDestPath.replace('skullyflower', 'skullyflowerTS')}${file}`
        )
      } catch (err) {
        message += `Failed to copy big ${bigSourcePath}${file} to  ${bigDestPath}${file}:${err}\n`
      }
      try {
        /** move to build */
        fs.renameSync(`${bigSourcePath}${file}`, `${bigDestPath_build}${file}`)
      } catch (err) {
        message += `Failed to move big ${bigSourcePath}${file} to ${bigDestPath_build}${file} file :${err}\n`
      }
      if (smallfiles.includes(file)) {
        try {
          /** copy to public */
          fs.copyFileSync(`${smallSourcePath}${file}`, `${smallDestPath}${file}`)
          /** create link to new TS version */
          fs.linkSync(
            `${smallDestPath}${file}`,
            `${smallDestPath.replace('skullyflower', 'skullyflowerTS')}${file}`
          )
        } catch (err) {
          console.log(err, `Failed to copy small ${file} file\n`)
          message += `Failed to copy small ${file} file\n`
        }
        try {
          /** move to build */
          fs.renameSync(`${smallSourcePath}${file}`, `${smallDestPath_build}${file}`)
        } catch (err) {
          console.log(err, `Failed to move small ${file} file`)
          message += `Failed to move small ${file} file\n`
        }
      }
      if (!message.length) {
        message += 'Successfully moved files!!'
      }
    })
    console.log(message)
    return JSON.stringify({ message: message })
  }
  return JSON.stringify({ message: 'You must fill out all fields.' })
}

export const renameImage = (imageurl, newname): string => {
  if (imageurl && newname) {
    const relativePath = imageurl
    const biggerRelativePath = `${relativePath.substring(
      0,
      relativePath.lastIndexOf('/')
    )}/bigger${relativePath.substring(relativePath.lastIndexOf('/'))}`
    try {
      /** small file in public */
      fs.renameSync(
        `${publicPath}${relativePath}`,
        `${publicPath}${relativePath.substring(0, relativePath.lastIndexOf('/'))}/${newname}`
      )
      /** bigger file in public */
      fs.renameSync(
        `${publicPath}${biggerRelativePath}`,
        `${publicPath}${biggerRelativePath.substring(0, biggerRelativePath.lastIndexOf('/'))}/${
          newname
        }`
      )
      /** small file in build */
      fs.renameSync(
        `${buildPath}${relativePath}`,
        `${buildPath}${relativePath.substring(0, relativePath.lastIndexOf('/'))}/${newname}`
      )
      /** bigger file in build */
      fs.renameSync(
        `${buildPath}${biggerRelativePath}`,
        `${buildPath}${biggerRelativePath.substring(0, biggerRelativePath.lastIndexOf('/'))}/${
          newname
        }`
      )
      /** create link to new TS version of small file */
      fs.renameSync(
        `${publicPath.replace('skullyflower', 'skullyflowerTS')}${relativePath}`,
        `${publicPath.replace('skullyflower', 'skullyflowerTS')}${relativePath.substring(
          0,
          relativePath.lastIndexOf('/')
        )}/${newname}`
      )
      /** create link to new TS version */
      fs.renameSync(
        `${publicPath.replace('skullyflower', 'skullyflowerTS')}${biggerRelativePath}`,
        `${publicPath.replace('skullyflower', 'skullyflowerTS')}${biggerRelativePath.substring(
          0,
          biggerRelativePath.lastIndexOf('/')
        )}/${newname}`
      )
      return JSON.stringify({ message: `Successfully renamed ${imageurl}` })
    } catch (error) {
      return JSON.stringify({ message: `Failed to rename ${imageurl}: ${error}` })
    }
  }
  return JSON.stringify({ message: `Nothing to rename.` })
}

export const deleteImage = (imageurl): string => {
  if (imageurl) {
    const relativePath = imageurl
    const biggerRelativePath = `${relativePath.substring(
      0,
      relativePath.lastIndexOf('/')
    )}/bigger${relativePath.substring(relativePath.lastIndexOf('/'))}`
    try {
      console.log(relativePath)
      if (relativePath.includes('files')) {
        fs.rmSync(`./public${relativePath}`)
        return JSON.stringify({ message: `Successfully removed ${imageurl}` })
      } else {
        fs.rmSync(`${publicPath}/${relativePath}`)
        fs.rmSync(`${publicPath}${biggerRelativePath}`)
        fs.rmSync(`${buildPath}/${relativePath}`)
        fs.rmSync(`${buildPath}${biggerRelativePath}`)
        fs.rmSync(`${publicPath.replace('skullyflower', 'skullyflowerTS')}/${relativePath}`)
        fs.rmSync(`${publicPath.replace('skullyflower', 'skullyflowerTS')}${biggerRelativePath}`)
      }
      return JSON.stringify({ message: `Successfully removed ${imageurl}` })
    } catch (error) {
      return JSON.stringify({ message: `Failed to remove ${imageurl}: ${error}` })
    }
  }
  return JSON.stringify({ message: `Nothng to remove.` })
}

export const getFolderImages = (toplevel): string => {
  const topLeveDestination = toplevel
  const dirpattern = /^[^.]*$/
  checkPath(`${pathToBuild}/${topLeveDestination}`)
  fs.readdir(`${pathToBuild}/${topLeveDestination}`, (err, files) => {
    if (err) {
      console.log(err)
      return JSON.stringify({ message: "Can't get the subirectories." })
    }
    if (files) {
      const filtered = files.filter((file) => dirpattern.test(file))
      return JSON.stringify(filtered)
    }
    return JSON.stringify('No Files to get.')
  })
  return JSON.stringify({ message: "Can't get the subirectories." })
}

/**
 * Process uploaded images for preview - saves files from renderer to temp location and returns preview URLs
 */
export const processUploadedImages = async (
  fileDataArray: Array<{ name: string; data: ArrayBuffer }>
): Promise<string> => {
  if (!fileDataArray || fileDataArray.length === 0) {
    return JSON.stringify([])
  }

  const tempDir = path.join(app.getPath('temp'), 'site-admin-uploads')
  checkPath(tempDir)
  const previewUrls: string[] = []
  const filePaths: string[] = []

  for (const fileData of fileDataArray) {
    try {
      // Save file to temp directory
      const tempPath = path.join(tempDir, fileData.name)
      const buffer = Buffer.from(fileData.data)
      fs.writeFileSync(tempPath, buffer)

      // Store the path for later use
      filePaths.push(tempPath)

      // Create a file:// URL for preview
      previewUrls.push(`file://${tempPath}`)
    } catch (err) {
      console.error(`Failed to process file ${fileData.name}:`, err)
    }
  }

  return JSON.stringify({ previewUrls, filePaths })
}

/**
 * Upload and process a blog image - resize and move to blog directory, return relative URL
 */
export const uploadBlogImage = async (
  filePath: string,
  destination: string = 'blog'
): Promise<string> => {
  if (!filePath) {
    return JSON.stringify({ error: 'No file path provided' })
  }

  try {
    const { pathToPublic, pathToBuild } = getPathsFromConfig()
    const bigDestPath = `${pathToPublic}/images/${destination}/`
    const smallDestPath = `${pathToPublic}/images/${destination}/smaller/`
    const bigDestPathBuild = `${pathToBuild}/images/${destination}/`
    const smallDestPathBuild = `${pathToBuild}/images/${destination}/smaller/`

    // Process the image - create big and small versions
    const bigResult = await processFile(filePath, 850, bigDestPath)
    const smallResult = await processFile(filePath, 450, smallDestPath)

    if (typeof bigResult === 'string' || typeof smallResult === 'string') {
      return JSON.stringify({ error: bigResult || smallResult })
    }

    const bigImage = bigResult as ProcessedImage
    const smallImage = smallResult as ProcessedImage

    // Copy to build directories
    try {
      checkPath(bigDestPathBuild)
      checkPath(smallDestPathBuild)
      fs.copyFileSync(
        path.join(bigDestPath, bigImage.filename),
        path.join(bigDestPathBuild, bigImage.filename)
      )
      fs.copyFileSync(
        path.join(smallDestPath, smallImage.filename),
        path.join(smallDestPathBuild, smallImage.filename)
      )
    } catch (err) {
      console.error('Failed to copy to build directories:', err)
    }

    // Return the relative URL for the big image (used in blog entries)
    return JSON.stringify({
      relativeUrl: bigImage.relativeUrl,
      filename: bigImage.filename,
      message: 'Image uploaded successfully'
    })
  } catch (err) {
    console.error('Failed to upload blog image:', err)
    return JSON.stringify({ error: `Failed to upload image: ${err}` })
  }
}

export const uploadImages = async (dest: string, files): Promise<string> => {
  if (files) {
    let destPaths: {
      pubPathBig: string
      pubPathSmall: string
      buildPathBig: string
      buildPathSmall: string
    } | null = null
    const messages: string[] = []
    if (dest) {
      const pathBits = dest.includes('/') ? dest.split('/') : false
      const topdir = pathBits ? pathBits[0] : dest
      const subdir = pathBits ? pathBits[1] : 'bigger'
      destPaths = getDestinationPaths(topdir, subdir)
    }
    const bigDestPath = destPaths?.pubPathBig ?? bigSourcePath
    const smallDestPath = destPaths?.pubPathSmall ?? smallSourcePath

    for (const file of files) {
      try {
        const result1 = await processFile(file, 750, bigSourcePath)
        if (result1 === 'success') {
          console.log('Big file uploaded to ', bigSourcePath)
        } else {
          messages.push(`Wrong Big File type.`)
        }
        const result2 = await processFile(file, 450, smallSourcePath)
        if (result2 === 'success') {
          console.log('Small file uploaded to ', smallSourcePath)
        } else {
          messages.push(`Wrong Small File type.`)
        }
      } catch (err) {
        messages.push(`Could not process file:${err}`)
      }
      if (destPaths) {
        try {
          checkPath(bigDestPath)
          fs.copyFileSync(`${bigSourcePath}${file.filename}`, `${bigDestPath}${file.filename}`)
        } catch (err) {
          messages.push(`Could not copy big file:${file.filename} to ${bigDestPath}:${err}`)
        }
        try {
          checkPath(smallDestPath)
          fs.copyFileSync(`${smallSourcePath}${file.filename}`, `${smallDestPath}${file.filename}`)
        } catch (err) {
          messages.push(`Could not copy small file:${file.filename} to ${smallDestPath}:${err}`)
        }
        try {
          checkPath(smallDestPath.replace('public/', 'build/'))
          fs.copyFileSync(
            `${smallSourcePath}${file.filename}`,
            `${smallDestPath.replace('public/', 'build/')}${file.filename}`
          )
        } catch (err) {
          messages.push(`Could not copy small file:${file.filename} to build:${err}`)
        }
        try {
          checkPath(bigDestPath.replace('public/', 'build/'))
          fs.copyFileSync(
            `${bigSourcePath}${file.filename}`,
            `${bigDestPath.replace('public/', 'build/')}${file.filename}`
          )
        } catch (err) {
          messages.push(`Could not copy big file:${file.filename} to build:${err}`)
        }
        try {
          checkPath(bigDestPath.replace('skullyflower', 'skullyflowerTS'))
          fs.linkSync(
            `${bigDestPath}${file.filename}`,
            `${bigDestPath.replace('skullyflower', 'skullyflowerTS')}${file.filename}`
          )
        } catch (err) {
          messages.push(`Could not link big file:${file.filename} to TS:${err}`)
        }
        try {
          checkPath(smallDestPath.replace('skullyflower', 'skullyflowerTS'))
          fs.linkSync(
            `${smallDestPath}${file.filename}`,
            `${smallDestPath.replace('skullyflower', 'skullyflowerTS')}${file.filename}`
          )
        } catch (err) {
          messages.push(`Could not link small file:${file.filename} to TS:${err}`)
        }
      }
      try {
        console.log('Removing ', file.path)
        fs.rmSync(file.path)
      } catch (err) {
        messages.push(`Could not remove file: ${file.filename}: ${err}`)
      }
    }
    return JSON.stringify({ message: messages.join(', ') })
  } else {
    return JSON.stringify({ message: 'No uploaded files.' })
  }
}
