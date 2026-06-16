import fs from 'fs'
import { join } from 'path'
import getPathsFromConfig, { checkFile } from '../utilities/pathData'
import { okMessage, fail } from '../utilities/apiResponse'

const getPaths = (): { pathToPublic: string; salefilepath: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const salefilepath = join(pathToPublic, 'data', 'sale.json')
  return { pathToPublic, salefilepath: salefilepath }
}

export const setSale = (sale: number): string => {
  const { salefilepath } = getPaths()
  if (!isNaN(sale)) {
    try {
      checkFile(salefilepath, { sale: 0 })
      const newShopData = { sale: Number(sale) }
      fs.writeFileSync(salefilepath, JSON.stringify(newShopData))
      return JSON.stringify(okMessage('Updated Sale!'))
    } catch (err) {
      console.log(err)
      return JSON.stringify(fail('Sale update failed.'))
    }
  } else {
    return JSON.stringify(fail('You must fill out all fields.'))
  }
}

export const getSale = (): string => {
  const { salefilepath } = getPaths()
  checkFile(salefilepath, { sale: 0 })
  const shopData = fs.readFileSync(salefilepath, 'utf8')
  const shop = JSON.parse(shopData)
  return JSON.stringify({ sale: shop.sale })
}
