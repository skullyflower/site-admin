import fs from 'fs'
import getPathsFromConfig, { checkFile } from '../utilities/pathData'

const getPaths = (): { pathToPublic: string; shopfilepath: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const shopfilepath = `${pathToPublic}/data/sale.json`
  return { pathToPublic, shopfilepath }
}

export const setSale = (sale): string => {
  const { shopfilepath } = getPaths()
  if (!isNaN(Number(sale))) {
    try {
      checkFile(shopfilepath, { sale: 0 })
      const oldShopDataString = fs.readFileSync(shopfilepath, 'utf8')
      const oldShopObject = JSON.parse(oldShopDataString)
      const newShopData = { ...oldShopObject, sale: Number(sale) }
      fs.writeFileSync(shopfilepath, JSON.stringify(newShopData))
      return JSON.stringify({ message: 'Updated Sale!' })
    } catch (err) {
      console.log(err)
      return JSON.stringify({ message: 'Sale update failed.' })
    }
  } else {
    return JSON.stringify({ message: 'You must fill out all fields.' })
  }
}

export const getSale = (): string => {
  const { shopfilepath } = getPaths()
  checkFile(shopfilepath, { sale: 0 })
  const shopData = fs.readFileSync(shopfilepath, 'utf8')
  const shop = JSON.parse(shopData)
  return JSON.stringify({ sale: shop.sale })
}
