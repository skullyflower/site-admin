import fs from 'fs'
import getPathsFromConfig, { checkFile } from './pathData'

const { pathToPublic } = getPathsFromConfig()

const subjectFilePath = `${pathToPublic}/data/subjects.json`
import processFile from './imageProcessor.js'

export const updateSubject = async (subject, files): Promise<string> => {
  if (subject) {
    const bigDestPath = `${pathToPublic}/shop/subjects/${subject.id}/`
    //check for path. if it doesn't exist create it.
    const smallDestPath = `${pathToPublic}/shop/subjects/smaller/${subject.id}/`
    //check for path. if it doesn't exitst, create it.
    try {
      if (files) {
        for (const file of files) {
          try {
            processFile(file, 850, bigDestPath)
            processFile(file, 450, smallDestPath)
            // skullyflower only for copying to the local build
            fs.copyFileSync(
              `${smallDestPath}${file.filename}`,
              `${smallDestPath.replace('public', 'build')}`
            )
            fs.copyFileSync(
              `${bigDestPath}${file.filename}`,
              `${bigDestPath.replace('public', 'build')}`
            )
            subject.img = `${bigDestPath.replace('../skullyflower/public', '')}${file.filename}`
          } catch (err) {
            console.log(`Failed: file upload: ${err}`)
          }
        }
      }
      checkFile(subjectFilePath, { designs: [] })
      checkFile(subjectFilePath.replace('public', 'build'), { designs: [] })
      const oldShopDataString = fs.readFileSync(subjectFilePath, 'utf8')
      const oldShopObject = JSON.parse(oldShopDataString)
      //categories:[]
      const newCategories = [...oldShopObject.designs]
      const newCatIndex = newCategories.findIndex((cat) => cat.id === subject.id)
      //updates else adds
      if (newCatIndex !== -1) {
        newCategories[newCatIndex] = subject
      } else {
        newCategories.unshift(subject)
      }
      const newShopData = { designs: newCategories }
      fs.writeFileSync(subjectFilePath, JSON.stringify(newShopData))
      fs.writeFileSync(subjectFilePath.replace('public', 'build'), JSON.stringify(newShopData))
      return JSON.stringify({ message: 'Updated Shop Subjects!' })
    } catch (err) {
      console.log(err)
      return JSON.stringify({ message: 'Subjects update failed.' })
    }
  } else {
    return JSON.stringify({ message: 'You must fill out all fields.' })
  }
}

export const getSubjects = (): string => {
  checkFile(subjectFilePath, { designs: [] })
  const shopData = fs.readFileSync(subjectFilePath, 'utf8')
  const shop = JSON.parse(shopData)
  if (shop.designs) {
    return JSON.stringify(shop.designs)
  }
  return JSON.stringify({ message: 'No Subjects to show' })
}

// TODO: add check for prods with the category
export const deleteSubject = (catId): string => {
  try {
    const catToDelete = catId
    checkFile(subjectFilePath, { designs: [] })
    const shopData = fs.readFileSync(subjectFilePath, 'utf8')
    const shop = JSON.parse(shopData)
    if (
      shop.categories &&
      shop.categories[shop.categories.findIndex((cat) => cat.id === catToDelete)]
    ) {
      const allcategories = shop.categories
      const newCategoryData = allcategories.filter((cats) => cats.id !== catToDelete)
      const newShopObj = { ...shop, categories: newCategoryData }
      const newShopData = JSON.stringify(newShopObj)
      fs.writeFileSync(subjectFilePath, newShopData)
      return JSON.stringify({ message: `Successfully deleted ${catToDelete}` })
    }
    return JSON.stringify({ message: `Couldn't find ${catId} in the list.` })
  } catch (err) {
    console.log(err)
    return JSON.stringify({ message: `Failed to delete ${catId}` })
  }
}
