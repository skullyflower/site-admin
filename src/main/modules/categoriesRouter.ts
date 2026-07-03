import fs from 'fs'
import { join } from 'path'
import getPathsFromConfig, { checkFile } from '../utilities/pathData'
import { CategoryType } from '../../shared/types'
import { ok, okMessage, fail } from '../utilities/apiResponse'

const getPaths = (): { shopfilepath: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const shopfilepath = join(pathToPublic, 'data', 'categories.json')
  return { shopfilepath }
}

export const updateCategories = (category: CategoryType): string => {
  const { shopfilepath } = getPaths()
  if (category) {
    try {
      checkFile(shopfilepath, { categories: [] })
      checkFile(shopfilepath.replace('public', 'dist'), { categories: [] })
      const oldShopDataString = fs.readFileSync(shopfilepath)
      const oldShopObject = JSON.parse(oldShopDataString.toString())
      const newCategories = [...oldShopObject.categories]
      const newCatIndex = newCategories.findIndex((cat) => cat.id === category.id)
      if (newCatIndex !== -1) {
        newCategories[newCatIndex] = category
      } else {
        newCategories.unshift(category)
      }
      const newShopData = { categories: newCategories }
      fs.writeFileSync(shopfilepath, JSON.stringify(newShopData))
      fs.writeFileSync(shopfilepath.replace('public', 'dist'), JSON.stringify(newShopData))
      return JSON.stringify(okMessage('Updated Shop Categories!'))
    } catch (err) {
      console.log(err)
      return JSON.stringify(fail('Categories update failed.'))
    }
  } else {
    return JSON.stringify(fail('You must fill out all fields.'))
  }
}

export const getAllCategories = (): string => {
  const { shopfilepath } = getPaths()
  checkFile(shopfilepath, { categories: [] })
  const shopData = fs.readFileSync(shopfilepath)
  const shop = JSON.parse(shopData.toString())
  if (shop.categories) {
    return JSON.stringify(ok(shop.categories))
  }
  return JSON.stringify(fail('No categories found.'))
}

// TODO: add check for prods with the category
export const deleteCategory = (catId): string => {
  try {
    const { shopfilepath } = getPaths()
    const catToDelete = catId
    checkFile(shopfilepath, { categories: [] })
    const shopData = fs.readFileSync(shopfilepath)
    const shop = JSON.parse(shopData.toString())
    if (
      shop.categories &&
      shop.categories[shop.categories.findIndex((cat) => cat.id === catToDelete)]
    ) {
      const allcategories = shop.categories
      const newCategoryData = allcategories.filter((cats) => cats.id !== catToDelete)
      const newShopObj = { ...shop, categories: newCategoryData }
      const newShopData = JSON.stringify(newShopObj)
      fs.writeFileSync(shopfilepath, newShopData)
      return JSON.stringify(okMessage(`Successfully deleted ${catToDelete}`))
    }
    return JSON.stringify(fail(`Couldn't find ${catId} in the list.`))
  } catch (err) {
    console.log(err)
    return JSON.stringify(fail(`Failed to delete ${catId}`))
  }
}
