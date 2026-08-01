import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import getPathsFromConfig, { checkFile } from '../utilities/pathData'
import { ok, okMessage, fail } from '../utilities/apiResponse'

const getPaths = (): { pathToPublic: string; tags_json: string } => {
  const { pathToPublic } = getPathsFromConfig()
  const tags_json = join(pathToPublic, 'data', 'tags_list.json')
  return { pathToPublic, tags_json }
}

export const getTags = (): string => {
  const { tags_json } = getPaths()
  try {
    checkFile(tags_json, [])
    const tagsData = readFileSync(tags_json, 'utf8')
    const tags = JSON.parse(tagsData)
    return JSON.stringify(ok(Array.isArray(tags) ? tags.sort() : []))
  } catch (err) {
    return JSON.stringify(fail(`Couldn't read tags list file. : ${err}`))
  }
}

export const updateTagsList = (someTags: string[]): string => {
  const { tags_json } = getPaths()
  if (someTags) {
    const tags = JSON.parse(getTags()).data
    if (!Array.isArray(tags)) {
      throw new Error('Cannot Get Tags')
    }
    const newTagList = Array.from(new Set([...tags.concat(someTags)]))
    checkFile(tags_json, [])
    writeFileSync(tags_json, JSON.stringify(newTagList))
    return JSON.stringify(okMessage(`Updated tagsList!`))
  } else {
    return JSON.stringify(fail('No tags to add.'))
  }
}
