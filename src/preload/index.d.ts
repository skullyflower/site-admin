import { ElectronAPI } from '@electron-toolkit/preload'
import {
  AdminConfig,
  BlogInfo,
  BlogEntry,
  SiteInfo,
  ApiResponse,
  GalleryImages,
  GalleryInfo,
  ProductType,
  saleDataType,
  Subject,
  CategoryType,
  PageInfo
} from '../shared/types'

export interface ProcessedImage {
  relativeUrl: string
  filename: string
}

export interface Api {
  getAdminConfig: () => Promise<ApiResponse<AdminConfig>>
  setAdminConfig: (config: AdminConfig) => Promise<ApiResponse>
  selectSiteDirectory: () => Promise<string[] | undefined>
  runDevServer: () => Promise<ApiResponse>
  getDevServerStatus: () => Promise<ApiResponse<boolean>>
  stopDevServer: () => Promise<ApiResponse>
  getSiteInfo: () => Promise<ApiResponse<SiteInfo>>
  updateSiteInfo: (values: SiteInfo) => Promise<ApiResponse>
  // Content Page API functions
  getPages: () => Promise<ApiResponse<string[]>>
  getPage: (pageId: string) => Promise<ApiResponse<PageInfo>>
  updatePage: (pageId: string, values: PageInfo) => Promise<ApiResponse>
  createPage: (pageId: string) => Promise<ApiResponse>
  deletePage: (pageId: string) => Promise<ApiResponse>
  // Blog API functions
  getBlogEntries: () => Promise<ApiResponse<BlogInfo>>
  updateBlogInfo: (values: BlogInfo) => Promise<ApiResponse>
  updateBlogPost: (entry: BlogEntry, files: FileList | []) => Promise<ApiResponse>
  deleteBlogEntry: (id: string) => Promise<ApiResponse>
  // Shop API functions
  getProducts: () => Promise<ApiResponse<ProductType[]>>
  updateProduct: (product: ProductType) => Promise<ApiResponse>
  deleteProduct: (prodid: string) => Promise<ApiResponse>
  getSubjects: () => Promise<ApiResponse<Subject[]>>
  updateSubject: (subject: Subject) => Promise<ApiResponse>
  deleteSubject: (subjectid: string) => Promise<ApiResponse>
  getCategories: () => Promise<ApiResponse<CategoryType[]>>
  updateCategory: (category: CategoryType) => Promise<ApiResponse>
  deleteCategory: (catid: string) => Promise<ApiResponse>
  getSale: () => Promise<saleDataType>
  setSale: (sale: string | number) => Promise<ApiResponse>
  // Gallery API functions
  getGalleries: () => Promise<ApiResponse<GalleryInfo[]>>
  getGalleryImages: (gallery_id: string) => Promise<ApiResponse<GalleryImages>>
  updateGallery: (gallery: GalleryInfo) => Promise<ApiResponse>
  resetGallery: (galleryId: string) => Promise<ApiResponse<GalleryImages>>
  // Image API functions
  getImageFolders: () => Promise<ApiResponse<string[]>>
  getStagedImages: () => Promise<ApiResponse<string[]>>
  getPreviewImages: (files: File[]) => Promise<ApiResponse<string[]>>
  uploadImage: (
    filePath: string,
    destination?: string
  ) => Promise<ApiResponse<{ relativeUrl: string; filename: string }>>
  uploadImages: (files: string[], destination: string) => Promise<ApiResponse<ProcessedImage[]>>
  uploadBlogImage: (filePath: string, destination?: string) => Promise<ApiResponse<ProcessedImage>>
  processUploadedImages: (
    fileDataArray: File[]
  ) => Promise<ApiResponse<{ previewUrls: string[]; filePaths: string[] }>>
  moveImages: (filesToMove: string[], destination: string) => Promise<ApiResponse>
  renameImage: (imageurl: string, newname: string) => Promise<ApiResponse>
  deleteImage: (imageurl: string) => Promise<ApiResponse>
  getFolderImages: (toplevel: string) => Promise<ApiResponse<string[]>>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: Api
  }
}
