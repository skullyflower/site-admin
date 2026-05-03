import fs from 'fs'
import path from 'path'
import getPathsFromConfig, { checkFile } from '../utilities/pathData'
import { ProductType, ApiResponse } from '../../shared/types'
import processFile from '../utilities/imageProcessor'
import { ok, okMessage, fail } from '../utilities/apiResponse'

const getPaths = (): { pathToPublic: string; shopfilepath: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const shopfilepath = `${pathToPublic}/data/products.json`
  return { pathToPublic, shopfilepath }
}

export const updateProduct = async (product: ProductType): Promise<ApiResponse> => {
  const { pathToPublic, shopfilepath } = getPaths()
  if (product) {
    try {
      const bigDestPath = `${pathToPublic}/images/shop/products/`
      const smallDestPath = `${pathToPublic}/images/shop/products/smaller/`
      const filePaths = [product.img, ...product.altimgs].filter(Boolean)
      for (const filePath of filePaths) {
        const filename = path.basename(filePath)
        const sourcePath = path.join(pathToPublic, 'temp', filename)
        if (fs.existsSync(sourcePath)) {
          try {
            await processFile(sourcePath, 850, bigDestPath)
            await processFile(sourcePath, 450, smallDestPath)
          } catch (err) {
            console.log(`Failed: file upload: ${filePath}: ${err}`)
          }
        }
      }
      checkFile(shopfilepath, { products: [] })
      checkFile(shopfilepath.replace('public', 'build'), { products: [] })
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
      return okMessage('Updated Products!')
    } catch (err) {
      console.log(err)
      return fail('Products update failed.')
    }
  } else {
    return fail('You must fill out all fields.')
  }
}

export const getProducts = (): string => {
  const { shopfilepath } = getPaths()
  checkFile(shopfilepath, { products: [] })
  const shopData = fs.readFileSync(shopfilepath, 'utf8')
  const shop = JSON.parse(shopData)
  if (shop.products) {
    return JSON.stringify(ok(shop.products))
  }
  return JSON.stringify(fail('No product to show.'))
}

export const deleteProduct = (prodId): string => {
  try {
    const { shopfilepath } = getPaths()
    const prodToDelete = prodId
    checkFile(shopfilepath, { products: [] })
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
      return JSON.stringify(okMessage(`Successfully deleted ${prodToDelete}`))
    }
    return JSON.stringify(fail(`Couldn't find ${prodId} in the list.`))
  } catch (err) {
    return JSON.stringify(fail(`Failed to delete ${prodId}: ${err}`))
  }
}
