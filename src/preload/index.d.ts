import { ElectronAPI } from '@electron-toolkit/preload'
import { AdminConfig, BlogInfo, BlogResponse, SiteInfo, ApiMessageResponse } from '../shared/types'

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
  getGalleries: () => Promise<ApiMessageResponse | GalleryResponse>
  getGallery: (gallery_id: string) => Promise<ApiMessageResponse | Gallery>
  updateGallery: (gallery: Gallery) => Promise<ApiMessageResponse>
  resetGallery: (gallery: Gallery) => Promise<ApiMessageResponse>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
