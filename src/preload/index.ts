import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI /* , WebUtils */ } from '@electron-toolkit/preload'
import { BlogEntry, CategoryType, PageInfo, ProductType } from '../shared/types'

// Custom APIs for renderer
const api = {
  getAdminConfig: async () => {
    const response = await ipcRenderer.invoke('get-admin-config')
    return JSON.parse(response)
  },
  setAdminConfig: async (config) => {
    const response = await ipcRenderer.invoke('set-admin-config', config)
    return JSON.parse(response)
  },
  selectSiteDirectory: async () => {
    const response = await ipcRenderer.invoke('select-site-directory')
    return (response as string) || undefined
  },
  // Site Info API functions
  getSiteInfo: async () => {
    const response = await ipcRenderer.invoke('get-site-info')
    return JSON.parse(response)
  },
  // Content Page API functions
  getPages: async () => {
    const response = await ipcRenderer.invoke('get-pages')
    return JSON.parse(response)
  },
  getPage: async (pageId: string) => {
    const response = await ipcRenderer.invoke('get-page', pageId)
    return JSON.parse(response)
  },
  createPage: async (pageId: string) => {
    const response = await ipcRenderer.invoke('create-page', pageId)
    return JSON.parse(response)
  },
  updatePage: async (pageId: string, values: PageInfo) => {
    const response = await ipcRenderer.invoke('update-page', pageId, values)
    return JSON.parse(response)
  },
  deletePage: async (pageId: string) => {
    const response = await ipcRenderer.invoke('delete-page', pageId)
    return JSON.parse(response)
  },
  updateSiteInfo: async (values) => {
    const response = await ipcRenderer.invoke('update-site-info', JSON.stringify(values))
    return JSON.parse(response)
  },
  // Blog API functions
  getBlogEntries: async () => {
    const response = await ipcRenderer.invoke('get-blogs')
    return JSON.parse(response)
  },
  updateBlogInfo: async (values) => {
    const response = await ipcRenderer.invoke('update-blog-info', values)
    return JSON.parse(response)
  },
  updateBlogPost: async (entry: BlogEntry, files: FileList) => {
    const response = await ipcRenderer.invoke('update-blog-post', entry, files)
    return JSON.parse(response)
  },

  deleteBlogEntry: async (id) => {
    const response = await ipcRenderer.invoke('delete-entry', id)
    return JSON.parse(response)
  },
  // Shop API functions
  getSale: async () => {
    const response = await ipcRenderer.invoke('get-sale')
    return JSON.parse(response)
  },
  setSale: async (sale: string) => {
    const response = await ipcRenderer.invoke('set-sale', sale)
    return JSON.parse(response)
  },
  getProducts: async () => {
    const response = await ipcRenderer.invoke('get-products')
    return JSON.parse(response)
  },
  updateProduct: async (product: ProductType) => {
    const response = await ipcRenderer.invoke('update-product', product)
    return JSON.parse(response)
  },
  getSubjects: async () => {
    const response = await ipcRenderer.invoke('get-subjects')
    return JSON.parse(response)
  },
  updateSubject: async (subject: string) => {
    const response = await ipcRenderer.invoke('update-subject', subject)
    return JSON.parse(response)
  },
  deleteSubject: async (subjectid: string) => {
    const response = await ipcRenderer.invoke('delete-subject', subjectid)
    return JSON.parse(response)
  },
  getCategories: async () => {
    const response = await ipcRenderer.invoke('get-categories')
    return JSON.parse(response)
  },
  updateCategory: async (category: CategoryType) => {
    const response = await ipcRenderer.invoke('update-category', category)
    return JSON.parse(response)
  },
  deleteCategory: async (catid: string) => {
    const response = await ipcRenderer.invoke('delete-category', catid)
    return JSON.parse(response)
  },
  // Gallery API functions
  getGalleries: async () => {
    const response = await ipcRenderer.invoke('get-galleries')
    return JSON.parse(response)
  },
  updateGallery: async (gallery: string) => {
    const response = await ipcRenderer.invoke('update-gallery', gallery)
    return JSON.parse(response)
  },
  getGalleryImages: async (gallery_path: string) => {
    const response = await ipcRenderer.invoke('get-gallery-images', gallery_path)
    return JSON.parse(response)
  },
  resetGallery: async (galleryId: string) => {
    const response = await ipcRenderer.invoke('reset-gallery', galleryId)
    return JSON.parse(response)
  },
  // Image API functions
  getStagedImages: async () => {
    const response = await ipcRenderer.invoke('get-staged-images')
    return JSON.parse(response)
  },
  getPreviewImages: async (files: File[]) => {
    const fileArray = files.map((file) => webUtils.getPathForFile(file))
    const response = await ipcRenderer.invoke('get-preview-images', fileArray)
    return response as string[]
  },
  processUploadedImages: async (fileDataArray: Array<{ name: string; data: ArrayBuffer }>) => {
    const response = await ipcRenderer.invoke('process-uploaded-images', fileDataArray)
    return JSON.parse(response)
  },
  uploadBlogImage: async (filePath: string, destination: string) => {
    const response = await ipcRenderer.invoke('upload-blog-image', filePath, destination)
    return JSON.parse(response)
  },
  moveImages: async (filesToMove: string, toplevel: string, secondLevels: string) => {
    const response = await ipcRenderer.invoke('move-images', filesToMove, toplevel, secondLevels)
    return JSON.parse(response)
  },
  renameImage: async (imageurl: string, newname: string) => {
    const response = await ipcRenderer.invoke('rename-image', imageurl, newname)
    return JSON.parse(response)
  },
  deleteImage: async (imageurl: string) => {
    const response = await ipcRenderer.invoke('delete-image', imageurl)
    return JSON.parse(response)
  },
  getFolderImages: async (toplevel: string) => {
    const response = await ipcRenderer.invoke('get-folder-images', toplevel)
    return JSON.parse(response)
  },
  uploadImages: async (dest: string, files: string[]) => {
    const response = await ipcRenderer.invoke('upload-images', dest, files)
    return JSON.parse(response)
  }
}

ipcRenderer.on('file-content', (_event, data) => {
  return data
})
// Process file "uploads"
// const newPath = webUtils.getPathForFile(document.querySelector('input').files[0]) grabs path so you can move files??

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
