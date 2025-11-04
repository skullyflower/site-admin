import { BlogInfo } from './../../shared/types.d'
import getConfig from './pathData.js'
import fs from 'fs'

const { pathToPublic } = getConfig()

const htmlEncodeString = (string): string =>
  string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const year = new Date().getUTCFullYear()

const sitedata = JSON.parse(fs.readFileSync(`${pathToPublic}/data/site-data.json`).toString())
const blog_data = JSON.parse(fs.readFileSync(`${pathToPublic}/data/blog-data.json`).toString())

// TODO
// need to Grab title from site-data.json file and inject it.
const processRss = (blogData: BlogInfo): string => {
  let rssString = `<?xml version="1.0" encoding="UTF-8"?>
  <rss xmlns:dc="http://purl.org/dc/elements/1.1/" version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
  <title>${blog_data.page_title}</title>
  <description>${blog_data.page_description}s</description>
  <generator>${sitedata.sitetitle}</generator>
  <link>${sitedata.siteurl}/</link>
  <atom:link href="${sitedata.siteurl}/blog.rss" rel="self" type="application/rss+xml" />
  <dc:language>en-en</dc:language>    
  <dc:rights>Copyright 2005-${year}</dc:rights>`
  blogData.entries.forEach((entry) => {
    const entrylink = `${sitedata.siteurl}/blog/entry/${entry.id}`
    const imageLink = entry.imagelink || entrylink
    const pubDate = new Date(entry.date)

    const entryContent = `<div style="text-align:center">
    <a href="${imageLink}">
    <img alt="${entry.imagealt}" src="${entry.image}">
    </a>
    <p>${entry.imgcaption}</p>
    </div>
    <h3>${entry.heading}</h3>
    ${entry.text}`

    rssString += `
    <item>
    <title>${htmlEncodeString(entry.title)}</title>
    <description>${htmlEncodeString(entryContent)}</description>
    <content:encoded>${htmlEncodeString(entryContent)}</content:encoded>
    <link>${entrylink}</link>
    <guid>${entrylink}</guid>
    <pubDate>${pubDate.toUTCString()}</pubDate>
    </item>`
  })
  rssString += `
</channel>
</rss>`
  return rssString
}
export default processRss
