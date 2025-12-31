import { readFileSync, readdirSync, writeFileSync } from 'fs'
import getPathsFromConfig, { checkFile, checkPath } from './pathData'

const { pathToPublic } = getPathsFromConfig()
const galleries_json = `${pathToPublic}/data/galleries_list.json`

function getImages(path): string[] {
  const files_path = `${pathToPublic}/${path}`
  checkPath(files_path)
  const all_files = readdirSync(files_path)
  if (Array.isArray(all_files) && all_files.length) {
    return all_files
  }
  console.log(`No files in ${files_path}`)
  return []
}

export const resetGallery = (galleryId: string): string => {
  const galleriesJson = getGalleries()
  const galleries = JSON.parse(galleriesJson)
  const gallery = galleries.find((g) => g.id === galleryId)
  if (!gallery) {
    return JSON.stringify({ message: `Gallery ${galleryId} not found.` })
  }
  const { json_path, path, isStory } = gallery
  const json_file = `${pathToPublic}${json_path}`
  //const build_file = public_file.replace('public', 'build')
  const img_files = {}
  const all_files = getImages(path)
  if (Array.isArray(all_files) && all_files.length) {
    if (isStory) {
      all_files.sort() //date acending
    } else {
      all_files.sort().reverse() //date decending
    }
    all_files.forEach((onefile) => {
      const imgPattern = /(.*)\.(jpg|jpeg|png|gif)$/
      if (imgPattern.test(onefile)) {
        const imagename = imgPattern.test(onefile) ? onefile.split('.')[0] : ''
        if (imagename) {
          // get filename minus extension yyyymmddTitleTitle.gif
          img_files[imagename] = { imgfile: onefile }
          const breakdownpattern = /(^[0-9]{8})(.*)\.(jpg|jpeg|png|gif)$/

          const imagebits = breakdownpattern.exec(onefile)
          if (imagebits && imagebits[2]) {
            img_files[imagename]['imgtitle'] =
              imagebits[2]
                ?.replace(/([A-Z])/g, ' $1')
                ?.replace(/_/g, ' ')
                ?.trim() ?? ''
            // grab just the year part of the date.
            img_files[imagename]['imgyear'] = imagebits[1].slice(0, 4)
          } else {
            img_files[imagename]['imgtitle'] =
              imagename
                ?.replace(/([A-Z])/g, ' $1')
                ?.replace(/_/g, ' ')
                ?.trim() ?? ''
            img_files[imagename]['imgyear'] = 2007
          }
        }
      }
    })
    try {
      checkFile(json_file, {})
      writeFileSync(json_file, JSON.stringify(img_files))
      //writeFileSync(build_file, JSON.stringify(img_files))
      return JSON.stringify({ message: 'Success!', images: img_files })
    } catch (err) {
      return JSON.stringify({ message: `Failed to write gallery images to ${json_file}: ${err}` })
    }
  }
  return JSON.stringify({ message: 'No files in gallery.' })
}

export const getGalleries = (): string => {
  try {
    checkFile(galleries_json, { galleries: [] })
    const gallerData = readFileSync(galleries_json, 'utf8')
    return gallerData
  } catch (err) {
    return JSON.stringify({ message: `Couldn't read galleries list file. : ${err}` })
  }
}

export const updateGallery = (gallery): string => {
  if (gallery) {
    const galleriesJson = getGalleries()
    const galleries = JSON.parse(galleriesJson)
    if (!Array.isArray(galleries) || galleries.length === 0) {
      throw new Error('Cannot Get Galleries')
    }
    const { id, title, json_path, path } = gallery
    if (!!id && !!title && !!json_path && !!path) {
      const gall_index = galleries.findIndex((g) => g.id === id)
      if (gall_index !== -1) {
        galleries[gall_index] = gallery //replace
      } else {
        galleries.push(gallery) //add
        writeFileSync(`${pathToPublic}${json_path}`, JSON.stringify({}))
      }
      writeFileSync(`${galleries_json}`, JSON.stringify({ galleries: galleries }))
      return JSON.stringify({ message: `Updated gallery; ${gallery.title}!` })
    } else {
      return JSON.stringify({ message: 'You must fill out all required fields.' })
    }
  }
  return JSON.stringify({ message: 'No gallery to update.' })
}

export const getGalleryImages = (galleryId): string => {
  try {
    const galleriesJson = getGalleries()
    const galleries = JSON.parse(galleriesJson)
    if (!Array.isArray(galleries)) {
      throw new Error('Cannot Get Galleries')
    }
    const gallery = galleries.find((g) => g.id === galleryId)
    if (gallery === undefined) {
      throw new Error('Cannot Get Gallery')
    }

    const galleryFile = gallery?.json_path ?? galleries[0].json_path
    checkFile(`${pathToPublic}${galleryFile}`, {})
    const gallery_json = readFileSync(`${pathToPublic}${galleryFile}`, 'utf8')
    return gallery_json
  } catch (err) {
    return JSON.stringify({
      message: `Couldn't read file for ${galleryId} ${err}`
    })
  }
}
