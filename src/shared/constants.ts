import { SiteInfo, BlogInfo, BlogEntry } from '@renderer/../../src/shared/types'

export const defaultSitePath = '/Sites/spa-shop-with-admin/spa-shop'
export const configFile = 'config.json'
export const siteFile = 'site-data.json'
export const blogFile = 'blog-data.json'
export const blogRSSFile = 'blog.rss'

export const defaultSiteData: SiteInfo = {
  page_id: '',
  page_title: '',
  page_description: '',
  page_content: '',
  brand_name: '',
  site_theme: '',
  live_site_url: '',
  sitelogo: '',
  links: [],
  features: []
}
export const defaultBlogInfo: BlogInfo = {
  page_title: '',
  page_description: '',
  page_content: '',
  entries: []
}
export const defaultBlogEntry: BlogEntry = {
  id: '',
  title: '',
  heading: '',
  date: '',
  image: '',
  imagealt: '',
  imagelink: '',
  imgcaption: '',
  text: '',
  tags: []
}
