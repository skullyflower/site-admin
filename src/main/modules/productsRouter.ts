import fs from 'fs'
import getConfig from './pathData'

const { pathToPublic } = getConfig()

const shopfilepath = `${pathToPublic}/data/products.json`
import processFile from './imageProcessor'

export const updateProduct = async (product, files): Promise<string> => {
  if (product) {
    try {
      const categoryId = product.cat[0]

      const smallDestPath = `${pathToPublic}/shop/${categoryId}/`
      const bigDestPath = `${pathToPublic}/shop/smaller/${categoryId}/`

      if (files) {
        for (const file of files) {
          try {
            processFile(file, 850, bigDestPath)
            processFile(file, 450, smallDestPath)
            fs.copyFileSync(
              `${smallDestPath}${file.filename}`,
              `${smallDestPath.replace('public', 'build')}`
            )
            fs.linkSync(
              `${smallDestPath}${file.filename}`,
              `${smallDestPath.replace('skullyflower', 'skullyflowerTS')}${file.filename}`
            )
            fs.copyFileSync(
              `${bigDestPath}${file.filename}`,
              `${bigDestPath.replace('public', 'build')}`
            )
            fs.linkSync(
              `${bigDestPath}${file.filename}`,
              `${bigDestPath.replace('skullyflower', 'skullyflowerTS')}${file.filename}`
            )
            product.img = `${bigDestPath.replace('../skullyflower/public', '')}${file.filename}`
          } catch (err) {
            console.log(`Failed: file upload: ${err}`)
          }
        }
      }
      const oldShopDataString = fs.readFileSync(shopfilepath, 'utf8')
      const oldShopData = JSON.parse(oldShopDataString)
      const productArray = oldShopData.products
      const prodIndex = productArray.findIndex((prod) => prod.id === product.id)
      if (prodIndex !== -1) {
        productArray[prodIndex] = product
      } else {
        productArray.unshift(product)
      }

      const newShopData = { products: productArray }
      fs.writeFileSync(shopfilepath, JSON.stringify(newShopData))
      fs.writeFileSync(shopfilepath.replace('public', 'build'), JSON.stringify(newShopData))
      return JSON.stringify({ message: 'Updated Products!' })
    } catch (err) {
      console.log(err)
      return JSON.stringify({ message: 'Products update failed.' })
    }
  } else {
    return JSON.stringify({ message: 'You must fill out all fields.' })
  }
}

export const getProducts = (): string => {
  const shopData = fs.readFileSync(shopfilepath, 'utf8')
  const shop = JSON.parse(shopData)
  if (shop.products) {
    return JSON.stringify(shop.products)
  }
  return JSON.stringify({ message: `No product to show.` })
}

export const deleteProduct = (prodId): string => {
  try {
    const prodToDelete = prodId
    const shopData = fs.readFileSync(shopfilepath, 'utf8')
    const shop = JSON.parse(shopData)
    const allproducts = shop.products
    const indexToDelete = allproducts.findIndex((prod) => prod.id === prodToDelete)
    if (indexToDelete !== -1) {
      allproducts.splice(indexToDelete, 1)
      const newShopObj = { ...shop, products: allproducts }
      const newShopData = JSON.stringify(newShopObj)
      fs.writeFileSync(shopfilepath, newShopData)
      fs.writeFileSync(shopfilepath.replace('public', 'build'), JSON.stringify(newShopData))
      return JSON.stringify({ message: `Successfully deleted ${prodToDelete}` })
    }
    JSON.stringify({ message: `Couldn't find ${prodId} in the list.` })
  } catch (err) {
    return JSON.stringify({ message: `Failed to delete ${prodId}: ${err}` })
  }
  return JSON.stringify({ message: `Failed to delete ${prodId}` })
}
