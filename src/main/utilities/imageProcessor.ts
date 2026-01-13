import { Jimp } from 'jimp'
import path from 'path'
import { checkPath, getPathsFromConfig } from './pathData'

export interface FileLike {
  filename: string
  path: string
}

export interface ProcessedImage {
  relativeUrl: string
  filename: string
}

/**
 * Process an image file: resize it and move it to the destination
 * @param sourcePath - Full path to the source image file
 * @param size - Target width in pixels
 * @param destinationPath - Directory where the resized image should be saved
 * @param newName - Optional new filename (without extension)
 * @returns Relative URL path or error message
 */
export default async function processFile(
  sourcePath: string,
  size: number,
  destinationPath: string,
  newName?: string
): Promise<string | ProcessedImage> {
  checkPath(destinationPath)

  const extensionPattern = /\.(jpe?g|png|gif)$/i
  const sourceFilename = path.basename(sourcePath)

  if (!extensionPattern.test(sourceFilename)) {
    return 'Wrong file type'
  }

  const match = sourceFilename.match(extensionPattern)
  const extension = match ? match[1] : 'jpg'

  try {
    // Read and resize the image
    const image = await Jimp.read(sourcePath)
    const resized = image.resize({ w: size })

    // Determine the output filename
    const baseName = newName ? newName : path.parse(sourceFilename).name
    //const outputFilename = `${baseName}.${extension}`
    const outputPath = path.join(destinationPath, baseName)
    const fullFilePath = `${outputPath}.${extension}`
    // Write the resized image
    await resized.write(`${outputPath}.${extension}`)

    // Get relative URL from the public path
    const { pathToPublic } = getPathsFromConfig()
    const relativeUrl = fullFilePath.replace(pathToPublic, '').replace(/\\/g, '/')

    return {
      relativeUrl: relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`,
      filename: `${baseName}.${extension}`
    }
  } catch (err) {
    console.log(`Failed to resize ${sourcePath}: ${err}`)
    return `Failed to process image: ${err}`
  }
}
