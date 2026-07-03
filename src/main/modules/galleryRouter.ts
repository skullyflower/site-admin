import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import getPathsFromConfig, { checkFile, checkPath } from '../utilities/pathData'
import { ok, okMessage, fail } from '../utilities/apiResponse'

const getPaths = (): { pathToPublic: string; galleries_json: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const galleries_json = join(pathToPublic, 'data', 'galleries_list.json')
  return { pathToPublic, galleries_json }
}

function getImages(path): string[] {
  const { pathToPublic } = getPaths()
  const images_path = join(pathToPublic, 'images', path)
  checkPath(images_path)
  const all_images = readdirSync(images_path)
  if (Array.isArray(all_images) && all_images.length) {
    return all_images
  }
  console.log(`No files in ${images_path}`)
  return []
}

export const resetGallery = (galleryId: string): string => {
  const { pathToPublic } = getPaths()
  const galleries = JSON.parse(getGalleries()).data
  const gallery = galleries?.find((g) => g.id === galleryId)
  if (!gallery) {
    return JSON.stringify(fail(`Gallery ${galleryId} not found.`))
  }
  const { json_path, path, isStory } = gallery
  const json_file = join(pathToPublic, json_path)
  const img_files = {}
  const all_files = getImages(path)
  if (Array.isArray(all_files) && all_files.length) {
    if (isStory) {
      all_files.sort()
    } else {
      all_files.sort().reverse()
    }
    all_files.forEach((onefile) => {
      const imgPattern = /(.*)\.(jpg|jpeg|png|gif)$/
      if (imgPattern.test(onefile)) {
        const imagename = imgPattern.test(onefile) ? onefile.split('.')[0] : ''
        if (imagename) {
          img_files[imagename] = { imgfile: onefile }
          const breakdownpattern = /(^[0-9]{8})(.*)\.(jpg|jpeg|png|gif)$/

          const imagebits = breakdownpattern.exec(onefile)
          if (imagebits && imagebits[2]) {
            img_files[imagename].imgtitle =
              imagebits[2]
                ?.replace(/([A-Z])/g, ' $1')
                ?.replace(/_/g, ' ')
                ?.trim() ?? ''
            img_files[imagename].imgyear = imagebits[1].slice(0, 4)
          } else {
            img_files[imagename].imgtitle =
              imagename
                ?.replace(/([A-Z])/g, ' $1')
                ?.replace(/_/g, ' ')
                ?.trim() ?? ''
            img_files[imagename].imgyear = 2007
          }
        }
      }
    })
    try {
      checkFile(json_file, {})
      checkFile(json_file.replace('public', 'dist'), {})
      writeFileSync(json_file, JSON.stringify(img_files))
      writeFileSync(json_file.replace('public', 'dist'), JSON.stringify(img_files))
      return JSON.stringify({ success: true, message: 'Success!', data: img_files })
    } catch (err) {
      return JSON.stringify(fail(`Failed to write gallery images to ${json_file}: ${err}`))
    }
  }
  return JSON.stringify(fail('No files in gallery.'))
}

export const getGalleries = (): string => {
  const { galleries_json } = getPaths()
  try {
    checkFile(galleries_json, { galleries: [] })
    const gallerData = readFileSync(galleries_json, 'utf8')
    const parsed = JSON.parse(gallerData)
    const galleries = parsed.galleries ?? parsed
    return JSON.stringify(ok(Array.isArray(galleries) ? galleries : []))
  } catch (err) {
    return JSON.stringify(fail(`Couldn't read galleries list file. : ${err}`))
  }
}

export const updateGallery = (gallery): string => {
  const { pathToPublic, galleries_json } = getPaths()
  if (gallery) {
    const galleries = JSON.parse(getGalleries()).data
    if (!Array.isArray(galleries) || galleries.length === 0) {
      throw new Error('Cannot Get Galleries')
    }
    const { id, title, json_path, path } = gallery
    if (!!id && !!title && !!json_path && !!path) {
      const gall_index = galleries.findIndex((g) => g.id === id)
      if (gall_index !== -1) {
        galleries[gall_index] = gallery
      } else {
        galleries.push(gallery)
        writeFileSync(join(pathToPublic, json_path), JSON.stringify({}))
        writeFileSync(join(pathToPublic.replace('public', 'dist'), json_path), JSON.stringify({}))
      }
      writeFileSync(`${galleries_json}`, JSON.stringify({ galleries: galleries }))
      return JSON.stringify(okMessage(`Updated gallery; ${gallery.title}!`))
    } else {
      return JSON.stringify(fail('You must fill out all required fields.'))
    }
  }
  return JSON.stringify(fail('No gallery to update.'))
}

export const getGalleryImages = (galleryId): string => {
  const { pathToPublic } = getPaths()
  try {
    const galleries = JSON.parse(getGalleries()).data
    if (!Array.isArray(galleries)) {
      throw new Error('Cannot Get Galleries')
    }
    const gallery = galleries.find((g) => g.id === galleryId)
    if (gallery === undefined) {
      throw new Error('Cannot Get Gallery')
    }

    const galleryFile = gallery?.json_path ?? galleries[0].json_path
    checkFile(join(pathToPublic, galleryFile), {})
    const gallery_json = readFileSync(join(pathToPublic, galleryFile), 'utf8')
    return JSON.stringify(ok(JSON.parse(gallery_json)))
  } catch (err) {
    return JSON.stringify(fail(`Couldn't read file for ${galleryId} ${err}`))
  }
}
