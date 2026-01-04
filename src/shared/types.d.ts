export type Feature =
  | 'blog'
  | 'content'
  | 'galleries'
  | 'products'
  | 'categories'
  | 'subjects'
  | 'sale'
export interface AdminConfig {
  pathToSite: string
  features?: Feature[]
}
export interface BlogInfo {
  page_title: string
  page_description: string
  page_content: string
  entries: BlogEntry[]
}

export interface BlogEntry {
  id: string
  title: string
  heading: string
  date: string
  image: string
  imagealt: string
  imagelink: string
  imgcaption: string
  text: string
  tags?: string[]
}

export interface BlogResponse {
  page_title: string
  page_description: string
  page_content: string
  entries: BlogEntry[]
  message?: string
}
export interface PageInfo {
  page_id: string
  page_title: string
  page_description: string
  page_content: string
}
export interface SiteInfo extends PageInfo {
  company_name: string
  site_theme: string
  live_site_url: string
  sitelogo: string
}

export interface CategoryType {
  id: string
  name: string
  img: string
  description: string
  subcat: string[]
  newImage: File[]
}
export interface CategoryResponse {
  categories: CategoryType[]
  message?: string
}
export interface Subject {
  id: string
  name: string
  description: string
  subcat: string[]
}
export interface SubjectResponse {
  subjects: Subject[]
  message?: string
}
export interface GalleryInfo {
  id: string
  json_path: string
  path: string
  title: string
  content?: string
  linked_prod: string
  isStory: boolean
}
export interface GalleryResponse {
  galleries: GalleryInfo[]
  message?: string
}

export interface GalleryImage {
  imgfile: string
  imgtitle: string
  imgyear: string
}
export interface GalleryImages extends Record<string, GalleryImage> {}

export interface ApiMessageResponse {
  message: string
}
export interface ProductType {
  id: string
  name: string
  price: number
  img: string
  altimgs: string[]
  desc: string
  desc_long: string
  cat: string[]
  weight: number
  handling: number
  soldout: boolean
  design: string[]
  externalLink: string
  date: string
}

export interface fileObject {
  filename: string
  path: string
  previewUrls: string
}
export interface fileObjectList {
  fileObjects: fileObject[]
}
