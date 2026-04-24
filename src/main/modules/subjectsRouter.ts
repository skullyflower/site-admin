import fs from 'fs'
import getPathsFromConfig, { checkFile } from '../utilities/pathData'
import { ApiResponse } from '../../shared/types'
import { ok, okMessage, fail } from '../utilities/apiResponse'

const getPaths = (): { subjectFilePath: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const subjectFilePath = `${pathToPublic}/data/subjects.json`
  return { subjectFilePath }
}

export const updateSubject = async (subject): Promise<ApiResponse> => {
  const { subjectFilePath } = getPaths()
  if (subject) {
    try {
      checkFile(subjectFilePath, { designs: [] })
      checkFile(subjectFilePath.replace('public', 'build'), { designs: [] })
      const oldShopDataString = fs.readFileSync(subjectFilePath, 'utf8')
      const oldShopObject = JSON.parse(oldShopDataString)
      const newCategories = [...oldShopObject.designs]
      const newCatIndex = newCategories.findIndex((cat) => cat.id === subject.id)
      if (newCatIndex !== -1) {
        newCategories[newCatIndex] = subject
      } else {
        newCategories.unshift(subject)
      }
      const newShopData = { designs: newCategories }
      fs.writeFileSync(subjectFilePath, JSON.stringify(newShopData))
      fs.writeFileSync(subjectFilePath.replace('public', 'build'), JSON.stringify(newShopData))
      return okMessage('Updated Shop Subjects!')
    } catch (err) {
      console.log(err)
      return fail('Subjects update failed.')
    }
  } else {
    return fail('You must fill out all fields.')
  }
}

export const getSubjects = (): string => {
  const { subjectFilePath } = getPaths()
  checkFile(subjectFilePath, { designs: [] })
  const shopData = fs.readFileSync(subjectFilePath)
  const shop = JSON.parse(shopData.toString())
  if (shop.designs) {
    return JSON.stringify(ok(shop.designs))
  }
  return JSON.stringify(fail('No Subjects to show'))
}

// TODO: add check for prods with the category
export const deleteSubject = (catId): string => {
  try {
    const { subjectFilePath } = getPaths()
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
      return JSON.stringify(okMessage(`Successfully deleted ${catToDelete}`))
    }
    return JSON.stringify(fail(`Couldn't find ${catId} in the list.`))
  } catch (err) {
    console.log(err)
    return JSON.stringify(fail(`Failed to delete ${catId}`))
  }
}
