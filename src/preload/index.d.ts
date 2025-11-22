import { ElectronAPI } from '@electron-toolkit/preload'
import {
  AdminConfig,
  BlogInfo,
  BlogEntry,
  BlogResponse,
  SiteInfo,
  ApiMessageResponse
} from '../shared/types'

export interface Api {
  getAdminConfig: () => Promise<ApiMessageResponse | AdminConfig>

  setAdminConfig: (config: AdminConfig) => Promise<ApiMessageResponse>

  selectSiteDirectory: () => Promise<string[] | undefined>

  getSiteInfo: () => Promise<ApiMessageResponse | SiteInfo>

  getBlogEntries: () => Promise<ApiMessageResponse | BlogResponse>

  updateSiteInfo: (values: SiteInfo) => Promise<ApiMessageResponse>
  // Blog API functions
  updateBlogInfo: (values: BlogInfo) => Promise<ApiMessageResponse>

  updateBlogPost: (entry: BlogEntry, files: FileList | []) => Promise<ApiMessageResponse>

  submitBlogEntry: (id: string, formData: FormData) => Promise<ApiMessageResponse>

  deleteBlogEntry: (id: string) => Promise<ApiMessageResponse>

  // Shop API functions
  getProducts: () => Promise<ApiMessageResponse | ProductResponse>

  updateProduct: (product: Product) => Promise<ApiMessageResponse>

  deleteProduct: (prodid: string) => Promise<ApiMessageResponse>

  getSubjects: () => Promise<ApiMessageResponse | SubjectResponse>

  updateSubject: (subject: Subject) => Promise<ApiMessageResponse>

  getCategories: () => Promise<ApiMessageResponse | CategoryResponse>

  updateCategory: (category: Category) => Promise<ApiMessageResponse>

  // Gallery API functions
  getGalleries: () => Promise<ApiMessageResponse | GalleryResponse>

  getGallery: (gallery_id: string) => Promise<ApiMessageResponse | Gallery>

  updateGallery: (gallery: Gallery) => Promise<ApiMessageResponse>

  resetGallery: (gallery: Gallery) => Promise<ApiMessageResponse>
  // Returns list of image paths in temp directory - waiting for final destination.
  getStagedImages: () => Promise<string[]>
  // not sure what this for yet
  getPreviewImages: (files: File[]) => Promise<string[]>

  uploadImage: (
    filePath: string,
    destination?: string
  ) => Promise<{ relativeUrl: string; filename: string; message?: string; error?: string }>
  uploadImages: (dest: string, files: string[]) => Promise<ApiMessageResponse>

  moveImages: (
    filesToMove: string,
    toplevel: string,
    secondLevels: string
  ) => Promise<ApiMessageResponse>

  renameImage: (imageurl: string, newname: string) => Promise<ApiMessageResponse>

  deleteImage: (imageurl: string) => Promise<ApiMessageResponse>

  getFolderImages: (toplevel: string) => Promise<ApiMessageResponse | string[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
