import fs from 'fs'
import path, { join } from 'path'
import processFile, { ProcessedImage } from '../utilities/imageProcessor'
import getPathsFromConfig, { checkPath } from '../utilities/pathData'

const getPaths = (): {
  pathToPublic: string
  tempPath: string
  imagesPath: string
  bigSourcePath: string
  smallSourcePath: string
} => {
  const { pathToPublic } = getPathsFromConfig()
  const tempPath = path.join(pathToPublic, 'temp')
  const imagesPath = path.join(pathToPublic, 'images')
  const bigSourcePath = tempPath
  const smallSourcePath = path.join(tempPath, 'small')
  return { pathToPublic, tempPath, imagesPath, bigSourcePath, smallSourcePath }
}
// TODO: rewrite so that big images are the standard size and small images are in the smaller directory, always.
/**
 * Moves images to the publictemp directory of the subject site for previewing.
 * @param files - An array of file paths. // File objects are converted to paths in the preload file.
 * @returns An array of updated file paths for previewing.
 */
export const getPreviewImages = async (files: string[]): Promise<string[]> => {
  const { tempPath, pathToPublic } = getPaths()
  checkPath(tempPath)
  if (files.length > 0) {
    try {
      const newFilePaths = await Promise.all(
        files.map(async (file) => {
          const newFilePath = join(tempPath, file.split('/').pop() || '')
          fs.copyFileSync(file, newFilePath)
          return newFilePath.replace(pathToPublic, 'http://localhost:3000/') //preview url
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
/**
 * Process "uploaded" images, resize and move to temp directory - saves files from renderer to temp location and returns preview URLs
 * @param files - An array of file paths. // File objects are converted to paths in the preload file.
 * @returns A JSON string containing the preview URLs and file paths.
 */
export const processUploadedImages = async (
  files: string[]
): Promise<{ previewUrls: string[]; filePaths: string[]; message: string }> => {
  const { tempPath } = getPaths()
  checkPath(tempPath)

  const previewUrls: string[] = []
  const filePaths: string[] = []
  let message = ''

  if (files.length > 0) {
    for (const fileData of files) {
      try {
        // resize and move to temp directory
        const bigResult = await processFile(fileData, 850, tempPath)
        const smallResult = await processFile(fileData, 450, join(tempPath, 'smaller'))
        if (typeof bigResult === 'object' && 'relativeUrl' in bigResult && bigResult.relativeUrl) {
          previewUrls.push(join('http://localhost:3000', bigResult.relativeUrl))
          filePaths.push(bigResult.relativeUrl)
        }
        if (
          typeof smallResult === 'object' &&
          'relativeUrl' in smallResult &&
          smallResult.relativeUrl
        ) {
          previewUrls.push(join('http://localhost:3000', smallResult.relativeUrl))
          filePaths.push(smallResult.relativeUrl)
        }
      } catch (err) {
        message = message + `Failed to process file ${fileData}: ${err}`
      }
    }
    return { previewUrls, filePaths, message: message }
  }
  return { previewUrls, filePaths, message: message || 'No files to process.' }
}

/**
 * reads contents of the temp directory and returns a list of images that are ready to be moved.
 * @returns An array of file names.
 */
export const getStagedImages = (): string => {
  const { bigSourcePath, smallSourcePath } = getPaths()
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

/**
 * Moves images from the temp directory to a public destination directory.
 * @param filesToMove - An array of file names.
 * @param destination - The destination directory.
 */
export const moveImages = (filesToMove: string[], destination: string): string => {
  const { pathToPublic, smallSourcePath, bigSourcePath } = getPaths()
  if (filesToMove && filesToMove.length > 0 && destination) {
    const filearray = !Array.isArray(filesToMove) ? [filesToMove] : filesToMove

    const bigDestPath = `${pathToPublic}/images/${destination}`
    const smallDestPath = `${pathToPublic}/images/${destination}/smaller`
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
        /** move to public */
        fs.renameSync(`${bigSourcePath}${file}`, `${bigDestPath}${file}`)
      } catch (err) {
        message += `Failed to move big ${bigSourcePath}${file} to  ${bigDestPath}${file}:${err}\n`
      }
      if (smallfiles.includes(file)) {
        try {
          /** move to public */
          fs.renameSync(`${smallSourcePath}${file}`, `${smallDestPath}${file}`)
        } catch (err) {
          console.log(err, `Failed to copy small ${file} file\n`)
          message += `Failed to copy small ${file} file\n`
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
  const { pathToPublic } = getPaths()
  if (imageurl && newname) {
    const relativePath = imageurl
    const smallerRelativePath = `${relativePath.substring(
      0,
      relativePath.lastIndexOf('/')
    )}/smaller${relativePath.substring(relativePath.lastIndexOf('/'))}`
    try {
      /** small file in public */
      fs.renameSync(
        `${pathToPublic}${relativePath}`,
        `${pathToPublic}${relativePath.substring(0, relativePath.lastIndexOf('/'))}/${newname}`
      )
      /** smaller file in public */
      fs.renameSync(
        `${pathToPublic}${smallerRelativePath}`,
        `${pathToPublic}${smallerRelativePath.substring(0, smallerRelativePath.lastIndexOf('/'))}/smaller${
          newname
        }`
      )
      return JSON.stringify({ message: `Successfully renamed ${imageurl}` })
    } catch (error) {
      return JSON.stringify({ message: `Failed to rename ${imageurl}: ${error}` })
    }
  }
  return JSON.stringify({ message: `Nothing to rename.` })
}

export const deleteImage = (imageurl): string => {
  const { pathToPublic } = getPaths()
  if (imageurl) {
    const relativePath = imageurl
    const smallerRelativePath = `${relativePath.substring(
      0,
      relativePath.lastIndexOf('/')
    )}/smaller${relativePath.substring(relativePath.lastIndexOf('/'))}`
    try {
      console.log(relativePath)
      if (relativePath.includes('files')) {
        fs.rmSync(`./public${relativePath}`)
        return JSON.stringify({ message: `Successfully removed ${imageurl}` })
      } else {
        fs.rmSync(`${pathToPublic}/${relativePath}`)
        fs.rmSync(`${pathToPublic}${smallerRelativePath}`)
      }
      return JSON.stringify({ message: `Successfully removed ${imageurl}` })
    } catch (error) {
      return JSON.stringify({ message: `Failed to remove ${imageurl}: ${error}` })
    }
  }
  return JSON.stringify({ message: `Nothng to remove.` })
}

export const getImageFolders = (): string => {
  const { imagesPath } = getPaths()
  checkPath(imagesPath)
  const files = fs.readdirSync(imagesPath)
  const filtered = files.filter((file) => fs.statSync(path.join(imagesPath, file)).isDirectory())

  if (filtered.length) {
    return JSON.stringify(filtered)
  }
  return JSON.stringify({ message: 'No image folders to get.' })
}

/**
 * Gets the images in a folder.
 * @param directory - The top level directory.
 * @returns An array of file names.
 */
export const getFolderImages = (directory: string): string => {
  const { pathToPublic } = getPaths()
  const dirpattern = /^[^.]*$/
  checkPath(`${pathToPublic}/${directory}`)
  try {
    const files = fs.readdirSync(`${pathToPublic}/${directory}`)
    if (files) {
      const filtered = files.filter((file) => dirpattern.test(file))
      return JSON.stringify(filtered)
    }
  } catch (err) {
    return JSON.stringify({ message: `Can't get the files in the directory: ${directory}: ${err}` })
  }
  return JSON.stringify('No Files to get.')
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
    const { pathToPublic } = getPaths()
    const bigDestPath = `${pathToPublic}/images/${destination}/`
    const smallDestPath = `${pathToPublic}/images/${destination}/smaller/`

    // Process the image - create big and small versions
    const bigResult = await processFile(filePath, 850, bigDestPath)
    const smallResult = await processFile(filePath, 450, smallDestPath)

    if (typeof bigResult === 'string' || typeof smallResult === 'string') {
      return JSON.stringify({ error: bigResult || smallResult })
    }

    const bigImage = bigResult as ProcessedImage

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
/**
 * "Uploads" multiple images to a destination folder. These should already be in the temp directory.
 * @param filePaths - An array of file paths.
 * @param destination - The destination folder.
 * @returns A JSON string containing the message and the paths of the "uploaded" images.
 * image handling needs to be improved.
 */
export const uploadImages = async (
  filePaths: string[],
  destination: string
): Promise<ProcessedImage[]> => {
  const processedImages: ProcessedImage[] = []
  const { imagesPath, tempPath, smallSourcePath } = getPaths()
  if (filePaths) {
    const bigDestPath = destination ? join(imagesPath, destination) : `${imagesPath}/`
    const smallDestPath = join(bigDestPath, 'smaller')

    for (const filePath of filePaths) {
      try {
        const result1 = await processFile(`${tempPath}/${filePath}`, 750, bigDestPath)
        if (typeof result1 === 'string') {
          console.error(`Wrong Big File type.`)
        } else if (result1.relativeUrl) {
          console.log('Big file uploaded to ', tempPath)
          processedImages.push(result1)
        }
        const result2 = await processFile(`${smallSourcePath}/${filePath}`, 450, smallDestPath)
        if (typeof result2 === 'string') {
          console.error(`Wrong Small File type.`)
        } else if (result2.relativeUrl) {
          console.log('Small file uploaded to ', smallDestPath)
          processedImages.push(result2)
        }
      } catch (err) {
        console.error(`Could not process file:${err}`)
      }
    }
  }
  return processedImages || []
}
