import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI /* , WebUtils */ } from '@electron-toolkit/preload'

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
  previewUploadedImages: async (images: string[]) => {
    const response = await ipcRenderer.invoke('preview-uploaded-images', images)
    return JSON.parse(response)
  },
  // Site Info API functions
  getSiteInfo: async () => {
    const response = await ipcRenderer.invoke('get-site-info')
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

  updateBlogPost: async (entry, files) => {
    const response = await ipcRenderer.invoke('update-blog-post', entry, files)
    return JSON.parse(response)
  },

  deleteBlogEntry: async (id) => {
    const response = await ipcRenderer.invoke('delete-entry', id)
    return JSON.parse(response)
  },
  getSale: async () => {
    const response = await ipcRenderer.invoke('get-sale')
    return JSON.parse(response)
  },
  setSale: async (sale: string) => {
    const response = await ipcRenderer.invoke('set-sale', sale)
    return JSON.parse(response)
  },
  getGalleries: async () => {
    const response = await ipcRenderer.invoke('get-galleries')
    return JSON.parse(response)
  },
  updateGallery: async (gallery: string) => {
    const response = await ipcRenderer.invoke('update-gallery', gallery)
    return JSON.parse(response)
  },
  getGallery: async (gallery_id: string) => {
    const response = await ipcRenderer.invoke('get-gallery', gallery_id)
    return response
  },
  resetGallery: async (gallery: string) => {
    const response = await ipcRenderer.invoke('reset-gallery', gallery)
    return JSON.parse(response)
  },
  getStagedImages: async () => {
    const response = await ipcRenderer.invoke('get-staged-images')
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
  uploadImages: async (dest: string, files: string) => {
    const response = await ipcRenderer.invoke('upload-images', dest, files)
    return JSON.parse(response)
  }
}

ipcRenderer.on('file-content', (_event, data) => {
  console.log('File content received:', data)
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
