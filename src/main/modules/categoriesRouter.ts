import fs from 'fs'
import getConfig from './pathData'
import processFile from './imageProcessor'

const { pathToPublic } = getConfig()
const shopfilepath = `${pathToPublic}/data/categories.json`

export const updateShopCategories = (category, files): string => {
  //upload('newImage', 1)
  if (category) {
    const bigDestPath = `${pathToPublic}/shop/categories/${category.id}/`
    //check for path. if it doesn't exist create it.
    const smallDestPath = `${pathToPublic}/shop/categories/smaller/${category.id}/`
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

            category.img = `${bigDestPath.replace(pathToPublic, '')}${file.filename}`
          } catch (err) {
            console.log(`Failed: file upload: ${err}`)
          }
        }
      }
      const oldShopDataString = fs.readFileSync(shopfilepath)
      const oldShopObject = JSON.parse(oldShopDataString.toString())
      //categories:[]
      const newCategories = [...oldShopObject.categories]
      const newCatIndex = newCategories.findIndex((cat) => cat.id === category.id)
      //updates else adds
      if (newCatIndex !== -1) {
        newCategories[newCatIndex] = category
      } else {
        newCategories.unshift(category)
      }
      const newShopData = { categories: newCategories }
      fs.writeFileSync(shopfilepath, JSON.stringify(newShopData))
      fs.writeFileSync(shopfilepath.replace('public', 'build'), JSON.stringify(newShopData))
      return JSON.stringify({ message: 'Updated Shop Categories!' })
    } catch (err) {
      console.log(err)
      return JSON.stringify({ message: 'Categories update failed.' })
    }
  } else {
    return JSON.stringify({ message: 'You must fill out all fields.' })
  }
}

export const getAllCategories = (): string => {
  const shopData = fs.readFileSync(shopfilepath)
  const shop = JSON.parse(shopData.toString())
  if (shop.categories) {
    return JSON.stringify(shop.categories)
  }
  return JSON.stringify({ message: 'No categories found.' })
}

// TODO: add check for prods with the category
export const deleteCategory = (catId): string => {
  try {
    const catToDelete = catId
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
      return JSON.stringify({ message: `Successfully deleted ${catToDelete}` })
    }
    return JSON.stringify({ message: `Couldn't find ${catId} in the list.` })
  } catch (err) {
    console.log(err)
    return JSON.stringify({ message: `Failed to delete ${catId}` })
  }
}
