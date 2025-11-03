import { Jimp } from 'jimp'
import fs from 'fs'
import { checkPath } from './pathData'

export interface FileLike {
  filename: string
  path: string
}

export default async function processFile(
  file: FileLike,
  size: number,
  DestinationPath: string,
  newName = ''
): Promise<string | void> {
  checkPath(DestinationPath)
  const extentionPattern = /.*(jpe?g|png|gif)$/i
  if (extentionPattern.test(file.filename)) {
    const extention = file.filename.match(extentionPattern)

    try {
      const image = await Jimp.read(file.path)
      await image.resize({ w: size }).write(`${file.path}_${size}.${extention && extention[0]}`)
      const filename = newName ? newName : file.filename
      fs.renameSync(`${file.path}_${size}`, `${DestinationPath}${filename}`)
      return 'success'
    } catch (err) {
      console.log(`failed to resize :  ${err}`)
    }
  } else {
    return 'Wrong file type'
  }
}
