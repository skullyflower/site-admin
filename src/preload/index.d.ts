import { ElectronAPI } from '@electron-toolkit/preload'
import {
  AdminConfig,
  BlogInfo,
  BlogEntry,
  BlogResponse,
  SiteInfo,
  ApiMessageResponse,
  GalleryImage
} from '../shared/types'

export interface Api {
  getAdminConfig: () => Promise<ApiMessageResponse | AdminConfig>
  setAdminConfig: (config: AdminConfig) => Promise<ApiMessageResponse>
  selectSiteDirectory: () => Promise<string[] | undefined>
  getSiteInfo: () => Promise<ApiMessageResponse | SiteInfo>
  getBlogEntries: () => Promise<ApiMessageResponse | BlogResponse>
  updateSiteInfo: (values: SiteInfo) => Promise<ApiMessageResponse>
  // Content Page API functions
  getPages: () => Promise<ApiMessageResponse | string[]>
  getPage: (pageId: string) => Promise<ApiMessageResponse | PageInfo>
  updatePage: (pageId: string, values: PageInfo) => Promise<ApiMessageResponse>
  createPage: (pageId: string) => Promise<ApiMessageResponse>
  deletePage: (pageId: string) => Promise<ApiMessageResponse>
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
  deleteSubject: (subjectid: string) => Promise<ApiMessageResponse>
  getCategories: () => Promise<ApiMessageResponse | CategoryResponse>
  updateCategory: (category: Category) => Promise<ApiMessageResponse>
  deleteCategory: (catid: string) => Promise<ApiMessageResponse>
  getSale: () => Promise<ApiMessageResponse | number>
  setSale: (sale: number) => Promise<ApiMessageResponse>

  // Gallery API functions
  getGalleries: () => Promise<ApiMessageResponse | GalleryResponse>
  getGalleryImages: (gallery_id: string) => Promise<ApiMessageResponse | GalleryImage[]>
  updateGallery: (gallery: Gallery) => Promise<ApiMessageResponse>
  resetGallery: (galleryId: string) => Promise<ApiMessageResponse | GalleryImage[]>
  // Image API functions
  getImageFolders: () => Promise<ApiMessageResponse | string[]>
  // Returns list of image paths in temp directory - waiting for final destination.
  getStagedImages: () => Promise<string[]>
  // not sure what this for yet
  getPreviewImages: (files: File[]) => Promise<string[]>
  // this is more of a move image function because the files are on the same computer.
  uploadImage: (
    filePath: string,
    destination?: string
  ) => Promise<{ relativeUrl: string; filename: string; message?: string; error?: string }>
  uploadImages: (files: string[], destination: string) => Promise<ApiMessageResponse>
  // this one moves staged images to a new location.
  moveImages: (filesToMove: string[], destination: string) => Promise<ApiMessageResponse>
  // this one renames an image.
  renameImage: (imageurl: string, newname: string) => Promise<ApiMessageResponse>
  // this one deletes an image.
  deleteImage: (imageurl: string) => Promise<ApiMessageResponse>
  // this one gets the images in a folder for a category.
  getFolderImages: (toplevel: string) => Promise<ApiMessageResponse | string[]>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
