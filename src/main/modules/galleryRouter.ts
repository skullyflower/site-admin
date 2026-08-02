import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import getPathsFromConfig, { checkFile, checkPath } from '../utilities/pathData'
import { ok, okMessage, fail } from '../utilities/apiResponse'
import { GalleryImage } from '../../shared/types'
import { deleteImage } from './imagesRouter'
import { updateTagsList } from './tagsRouter'

const getPaths = (): { pathToPublic: string; galleries_json: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const galleries_json = join(pathToPublic, 'data', 'galleries_list.json')
  return { pathToPublic, galleries_json }
}

function getImagesFromFiles(path: string): string[] {
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
  checkFile(json_file, {})
  const imageData = readFileSync(json_file, 'utf8')
  //read in any existing data (to preserve tags)
  const files_data = JSON.parse(imageData) || {}
  //pull images from directory
  const all_real_files = getImagesFromFiles(path)

  if (files_data && Array.isArray(all_real_files) && all_real_files.length) {
    // new object and alltags list to filter out deleted images
    const new_data_files = {}
    if (isStory) {
      all_real_files.sort()
    } else {
      all_real_files.sort().reverse()
    }
    const gall_tags: string[] = []
    // iterate through existing files
    all_real_files.forEach((onefile) => {
      const imgPattern = /(.*)\.(jpg|jpeg|png|gif)$/
      if (imgPattern.test(onefile)) {
        // get the image key
        const imagename = imgPattern.test(onefile) ? onefile.split('.')[0] : ''
        if (imagename) {
          //maintain old data (tags)
          new_data_files[imagename] = files_data[imagename] ? files_data[imagename] : {}
          // build from new data inputs
          //filename
          new_data_files[imagename].imgfile = onefile
          // title and year
          const datestringpattern = /(^[0-9]{8})(.*)\.(jpg|jpeg|png|gif)$/
          const imagebits = datestringpattern.exec(onefile)
          if (imagebits && imagebits[2]) {
            new_data_files[imagename].imgtitle =
              imagebits[2]
                ?.replace(/([A-Z])/g, ' $1')
                ?.replace(/_/g, ' ')
                ?.trim() ?? ''
            new_data_files[imagename].imgyear = imagebits[1].slice(0, 4)
          } else {
            new_data_files[imagename].imgtitle =
              imagename
                ?.replace(/([A-Z])/g, ' $1')
                ?.replace(/_/g, ' ')
                ?.trim() ?? ''
            new_data_files[imagename].imgyear = 2007
          }
          // tags
          if (new_data_files[imagename].tags) {
            gall_tags.push(...new_data_files[imagename].tags)
          }
        }
      }
    })
    try {
      checkFile(json_file, {})
      checkFile(json_file.replace('public', 'dist'), {})
      writeFileSync(json_file, JSON.stringify(new_data_files))
      writeFileSync(json_file.replace('public', 'dist'), JSON.stringify(new_data_files))
      updateTagsList(gall_tags)
      return JSON.stringify({ success: true, message: 'Success!', data: new_data_files })
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

export const updateGalleryList = (gallery): string => {
  const { pathToPublic, galleries_json } = getPaths()
  if (gallery) {
    const galleries = JSON.parse(getGalleries()).data
    if (!Array.isArray(galleries) || galleries.length === 0) {
      throw new Error('Cannot Get Galleries')
    }
    const { id, json_path } = gallery
    if (json_path) {
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

export const updateGalleryImage = (
  galleryId: string,
  newImageData: GalleryImage,
  oldImageKey?: string
): string => {
  if (galleryId && newImageData) {
    const { pathToPublic } = getPaths()
    const galleries = JSON.parse(getGalleries()).data
    const gallery = galleries?.find((g) => g.id === galleryId)
    try {
      if (!gallery) {
        return JSON.stringify(fail(`Gallery ${galleryId} not found.`))
      }
      if (gallery === undefined) {
        console.error('Cannot Find Gallery')
        throw new Error('Cannot Get Gallery')
      }
      //get list of existing image objects for gallery
      if (!gallery.json_path) {
        return JSON.stringify(fail(`Gallery ${galleryId} has no json_path.`))
      }
      const json_file = join(pathToPublic, gallery.json_path)

      checkFile(json_file, {})
      const gallery_json = readFileSync(json_file, 'utf8')
      const gallerData = JSON.parse(gallery_json) || {}
      // create key for new images object
      const newImageKey = newImageData.imgfile.substring(0, newImageData.imgfile.lastIndexOf('.'))
      gallerData[newImageKey] = newImageData
      if (newImageData.tags?.length) {
        //update master tag file
        updateTagsList(newImageData.tags)
      } else {
        console.error('No tags in Data')
      }
      if (oldImageKey && oldImageKey !== newImageKey && gallerData[oldImageKey]) {
        const oldfilepath = join(gallery.path, gallerData[oldImageKey].imgfile)
        deleteImage(oldfilepath)
        delete gallerData[oldImageKey]
      }
      checkFile(json_file.replace('public', 'dist'), {})
      writeFileSync(json_file, JSON.stringify(gallerData))
      writeFileSync(json_file.replace('public', 'dist'), JSON.stringify(gallerData))
      return JSON.stringify(okMessage(`Updated image; ${newImageData.imgtitle}!`))
    } catch (error) {
      return JSON.stringify(fail(`Failed to update image: ${error}`))
    }
  }
  return JSON.stringify(fail('You must fill out all required fields.'))
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
    if (!gallery.json_path) {
      throw new Error(`Gallery ${galleryId} has no json_path`)
    }

    checkFile(join(pathToPublic, gallery.json_path), {})
    const gallery_json = readFileSync(join(pathToPublic, gallery.json_path), 'utf8')
    return JSON.stringify(ok(JSON.parse(gallery_json)))
  } catch (err) {
    return JSON.stringify(fail(`Couldn't read file for ${galleryId} ${err}`))
  }
}
