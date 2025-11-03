import { ElectronAPI } from '@electron-toolkit/preload'

export interface AdminConfig {
  pathToSite: string
}
export interface BlogInfo {
  page_title: string
  page_description: string
  page_content: string
}

export interface BlogEntry {
  id: string
  title: string
  heading: string
  date: string
  image: string
  imagealt: string
}

interface BlogResponse {
  page_title: string
  page_description: string
  page_content: string
  entries: BlogEntry[]
  message?: string
}
export interface pageInfo {
  page_title: string
  page_description: string
  page_content: string
}
export interface SiteInfo extends pageInfo {
  company_name: string
  site_theme: string
  live_site_url: string
  sitelogo: string
}
export interface ApiMessageResponse {
  message: string
}
export interface Api {
  getAdminConfig: () => Promise<ApiMessageResponse | AdminConfig>
  updateAdminConfig: (config: AdminConfig) => Promise<ApiMessageResponse>
  selectSiteDirectory: () => Promise<string[] | undefined>
  getSiteInfo: () => Promise<ApiMessageResponse | SiteInfo>
  getBlogEntries: () => Promise<ApiMessageResponse | BlogResponse>
  updateSiteInfo: (values: SiteInfo) => Promise<ApiMessageResponse>
  updateBlogInfo: (values: BlogInfo) => Promise<ApiMessageResponse>
  submitBlogEntry: (id: string, formData: FormData) => Promise<ApiMessageResponse>
  deleteBlogEntry: (id: string) => Promise<ApiMessageResponse>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
  type AdminConfig = AdminConfig
  type SiteInfo = SiteInfo
  type BlogInfo = BlogInfo
  type BlogEntry = BlogEntry
  type BlogResponse = BlogResponse
  type ApiMessageResponse = ApiMessageResponse
}
