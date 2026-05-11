import fs from 'fs'
import path, { join } from 'path'
import processFile, { ProcessedImage } from '../utilities/imageProcessor'
import getPathsFromConfig, { checkPath } from '../utilities/pathData'
import { ApiResponse } from '../../shared/types'
import { ok, okMessage, fail } from '../utilities/apiResponse'

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
  const smallSourcePath = path.join(tempPath, 'smaller')
  return { pathToPublic, tempPath, imagesPath, bigSourcePath, smallSourcePath }
}
// TODO: rewrite so that big images are the standard size and small images are in the smaller directory, always.
/**
 * Moves images to the publictemp directory of the subject site for previewing.
 * @param files - An array of file paths. // File objects are converted to paths in the preload file.
 * @returns An array of updated file paths for previewing.
 */
export const getPreviewImages = async (files: string[]): Promise<ApiResponse<string[]>> => {
  const { tempPath, pathToPublic } = getPaths()
  checkPath(tempPath)
  if (files.length > 0) {
    try {
      const newFilePaths = await Promise.all(
        files.map(async (file) => {
          const newFilePath = join(tempPath, file.split('/').pop() || '')
          fs.copyFileSync(file, newFilePath)
          return newFilePath.replace(pathToPublic, '') // relative URL
        })
      )
      return ok(newFilePaths)
    } catch (err) {
      console.error('Failed to get preview images:', err)
      return ok([])
    }
  }
  return ok([])
}
/**
 * Process "uploaded" images, resize and move to temp directory - saves files from renderer to temp location and returns preview URLs
 * @param files - An array of file paths. // File objects are converted to paths in the preload file.
 * @returns An ApiResponse containing the preview URLs and file paths.
 */
export const processUploadedImages = async (
  files: string[]
): Promise<ApiResponse<{ previewUrls: string[]; filePaths: string[] }>> => {
  const { tempPath } = getPaths()
  checkPath(tempPath)

  const previewUrls: string[] = []
  const filePaths: string[] = []
  let errorMessage = ''

  if (files.length > 0) {
    for (const fileData of files) {
      try {
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
        errorMessage = errorMessage + `Failed to process file ${fileData}: ${err}`
      }
    }
    if (errorMessage) {
      return { success: false, message: errorMessage, data: { previewUrls, filePaths } }
    }
    return ok({ previewUrls, filePaths })
  }
  return { success: false, message: 'No files to process.' }
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
        return JSON.stringify(ok(filtered))
      }
      return JSON.stringify(fail('No images to move.'))
    }
  } catch (err) {
    if (err) {
      return JSON.stringify(fail("Couldn't read directory."))
    }
  }
  return JSON.stringify(fail('No images to move.'))
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

    const bigDestPath = join(pathToPublic, 'images', destination)
    const smallDestPath = join(pathToPublic, 'images', destination, 'smaller')
    checkPath(smallDestPath)
    checkPath(bigDestPath)
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
        fs.renameSync(join(bigSourcePath, file), join(bigDestPath, file))
      } catch (err) {
        message += `Failed to move big ${bigSourcePath}${file} to  ${bigDestPath}${file}:${err}\n`
      }
      if (smallfiles.includes(file)) {
        try {
          fs.renameSync(join(smallSourcePath, file), join(smallDestPath, file))
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
    if (message.includes('Failed')) {
      return JSON.stringify(fail(message))
    }
    return JSON.stringify(okMessage(message))
  }
  return JSON.stringify(fail('You must fill out all fields.'))
}

export const renameImage = (imageurl, newname): string => {
  const { pathToPublic } = getPaths()
  if (imageurl && newname) {
    console.log('[rename image]', imageurl, newname)
    const relativePath = imageurl
    const smallerRelativePath = join(
      path.dirname(relativePath),
      'smaller',
      path.basename(relativePath)
    )
    try {
      fs.renameSync(
        join(pathToPublic, relativePath),
        join(pathToPublic, path.dirname(relativePath), newname)
      )
      fs.renameSync(
        join(pathToPublic, smallerRelativePath),
        join(pathToPublic, path.dirname(smallerRelativePath), newname)
      )
      return JSON.stringify(okMessage(`Successfully renamed ${imageurl}`))
    } catch (error) {
      return JSON.stringify(fail(`Failed to rename ${imageurl}: ${error}`))
    }
  }
  return JSON.stringify(fail('Nothing to rename.'))
}

export const deleteImage = (imageurl): string => {
  const { pathToPublic } = getPaths()
  if (imageurl) {
    const relativePath = imageurl
    const smallerRelativePath = join(
      path.dirname(relativePath),
      'smaller',
      path.basename(relativePath)
    )
    try {
      console.log(relativePath)
      if (relativePath.includes('files')) {
        fs.rmSync(`./public${relativePath}`)
        return JSON.stringify(okMessage(`Successfully removed ${imageurl}`))
      } else {
        fs.rmSync(join(pathToPublic, relativePath))
        fs.rmSync(join(pathToPublic, smallerRelativePath))
      }
      return JSON.stringify(okMessage(`Successfully removed ${imageurl}`))
    } catch (error) {
      return JSON.stringify(fail(`Failed to remove ${imageurl}: ${error}`))
    }
  }
  return JSON.stringify(fail('Nothing to remove.'))
}

export const getImageFolders = (): string => {
  const { imagesPath } = getPaths()
  checkPath(imagesPath)
  const files = fs.readdirSync(imagesPath)
  const filtered = files.filter((file) => fs.statSync(path.join(imagesPath, file)).isDirectory())
  return JSON.stringify(ok(filtered))
}
/**
 * Gets the images in a folder.
 * @param directory - The top level directory.
 * @returns An array of file names.
 */
export const getFolderImages = (directory: string): string => {
  const { pathToPublic } = getPaths()
  const dirpattern = /^[^.]*$/
  checkPath(join(pathToPublic, directory))
  try {
    const files = fs.readdirSync(join(pathToPublic, directory))
    if (files) {
      const filtered = files.filter((file) => dirpattern.test(file))
      return JSON.stringify(ok(filtered))
    }
  } catch (err) {
    return JSON.stringify(fail(`Can't get the files in the directory: ${directory}: ${err}`))
  }
  return JSON.stringify(fail('No files to get.'))
}

/**
 * Upload and process a blog image - resize and move to blog directory, return relative URL
 */
export const uploadBlogImage = async (
  filePath: string,
  destination: string = 'blog'
): Promise<string> => {
  if (!filePath) {
    return JSON.stringify(fail('No file path provided'))
  }

  try {
    const { pathToPublic } = getPaths()
    const bigDestPath = join(pathToPublic, 'images', destination)
    const smallDestPath = join(pathToPublic, 'images', destination, 'smaller')

    const bigResult = await processFile(filePath, 850, bigDestPath)
    const smallResult = await processFile(filePath, 450, smallDestPath)

    if (typeof bigResult === 'string' || typeof smallResult === 'string') {
      const errMsg =
        typeof bigResult === 'string' && bigResult
          ? bigResult
          : typeof smallResult === 'string' && smallResult
            ? smallResult
            : 'Failed to process image'
      return JSON.stringify(fail(errMsg))
    }

    const bigImage = bigResult as ProcessedImage

    return JSON.stringify(ok({ relativeUrl: bigImage.relativeUrl, filename: bigImage.filename }))
  } catch (err) {
    console.error('Failed to upload blog image:', err)
    return JSON.stringify(fail(`Failed to upload image: ${err}`))
  }
}
/**
 * "Uploads" multiple images to a destination folder. These should already be in the temp directory.
 * @param filePaths - An array of file paths.
 * @param destination - The destination folder.
 * @returns An ApiResponse containing the processed images.
 */
export const uploadImages = async (
  filePaths: string[],
  destination: string
): Promise<ApiResponse<ProcessedImage[]>> => {
  const processedImages: ProcessedImage[] = []
  const { imagesPath, tempPath } = getPaths()
  if (filePaths) {
    const bigDestPath = destination ? join(imagesPath, destination) : imagesPath
    const smallDestPath = join(bigDestPath, 'smaller')

    for (const filePath of filePaths) {
      try {
        const result1 = await processFile(join(tempPath, filePath), 750, bigDestPath)
        if (typeof result1 === 'string') {
          console.error(`Wrong Big File type.`)
        } else if (result1.relativeUrl) {
          console.log('Big file uploaded to ', tempPath)
          processedImages.push(result1)
        }
        const result2 = await processFile(join(tempPath, filePath), 450, smallDestPath)
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
  return ok(processedImages || [])
}

export const uploadImage = async (filePath: string, destination: string): Promise<string> => {
  const { tempPath, imagesPath } = getPaths()
  console.log('[upload image]', join(tempPath, filePath), join(imagesPath, destination))
  const result = await processFile(join(tempPath, filePath), 750, join(imagesPath, destination))

  if (typeof result === 'string') {
    return JSON.stringify(fail(result))
  }
  return JSON.stringify(ok({ relativeUrl: result.relativeUrl, filename: result.filename }))
}
