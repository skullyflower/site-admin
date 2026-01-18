import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  dialog,
  OpenDialogReturnValue,
  MenuItem,
  Menu
} from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { getBlog, updateBlogInfo, updateBlogPost, deletEntry } from './modules/blogRouter'
import { getSiteInfo, updateSiteInfo } from './modules/homeRouter'
import { getSale, setSale } from './modules/saleRouter'
import {
  getGalleries,
  updateGallery,
  resetGallery,
  getGalleryImages
} from './modules/galleryRouter'
import {
  getStagedImages,
  getImageFolders,
  moveImages,
  renameImage,
  deleteImage,
  getFolderImages,
  uploadImages,
  getPreviewImages,
  processUploadedImages,
  uploadBlogImage,
  uploadImage
} from './modules/imagesRouter'
import { registerRoute } from '../lib/electron-router-dom'
import { getAdminConfig, updateAdminConfig } from './modules/configRouter'
import { BlogEntry, BlogInfo, CategoryType, PageInfo, ProductType, Subject } from '../shared/types'
import { deleteSubject, getSubjects, updateSubject } from './modules/subjectsRouter'
import { getProducts, updateProduct } from './modules/productsRouter'
import { getAllCategories, updateCategories } from './modules/categoriesRouter'
import { createPage, deletePage, getPage, getPages, updatePage } from './modules/contentPageRouter'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      spellcheck: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('context-menu', (_event, params) => {
    const menu = new Menu()

    // Add each spelling suggestion
    for (const suggestion of params.dictionarySuggestions) {
      menu.append(
        new MenuItem({
          label: suggestion,
          click: (): void => mainWindow.webContents.replaceMisspelling(suggestion)
        })
      )
    }

    menu.popup()
  })

  registerRoute({
    id: 'main',
    browserWindow: mainWindow,
    htmlFile: path.join(__dirname, '../renderer/index.html')
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  app.quit()
})

// In this file you can include the   rest of your app's specific main process
// Config API functions
ipcMain.handle('get-admin-config', getAdminConfig)
ipcMain.handle('set-admin-config', (_event, config: { pathToSite: string }) =>
  updateAdminConfig(config)
)
ipcMain.handle('select-site-directory', () => {
  const directory: Promise<OpenDialogReturnValue> = dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return directory.then((result) => result.filePaths[0].replace(`${app.getPath('home')}`, ''))
})
// Blog API functions
ipcMain.handle('get-blogs', getBlog)
ipcMain.handle('update-blog-info', (_event, values: BlogInfo) => updateBlogInfo(values))
ipcMain.handle('update-blog-post', (_event, entry: BlogEntry) => updateBlogPost(entry))
ipcMain.handle('delete-entry', (_event, blogid: string) => deletEntry(blogid))
// Site Info API functions
ipcMain.handle('get-site-info', getSiteInfo)
ipcMain.handle('update-site-info', (_event, siteInfo: string) => updateSiteInfo(siteInfo))
// Content Page API functions
ipcMain.handle('get-pages', getPages)
ipcMain.handle('get-page', (_event, pageId: string) => getPage(pageId))
ipcMain.handle('create-page', (_event, pageId: string) => createPage(pageId))
ipcMain.handle('update-page', (_event, pageId: string, values: PageInfo) =>
  updatePage(pageId, values)
)
ipcMain.handle('delete-page', (_event, pageId: string) => deletePage(pageId))
// Gallery API functions
ipcMain.handle('get-galleries', getGalleries)
ipcMain.handle('get-gallery-images', (_event, gallery_id: string) => getGalleryImages(gallery_id))
ipcMain.handle('update-gallery', (_event, gallery: string) => updateGallery(gallery))
ipcMain.handle('reset-gallery', (_event, gallery: string) => resetGallery(gallery))
ipcMain.handle('get-staged-images', getStagedImages)
ipcMain.handle('process-uploaded-images', (_event, fileDataArray: Array<string>) =>
  processUploadedImages(fileDataArray)
)
ipcMain.handle('upload-blog-image', (_event, filePath: string, destination: string) =>
  uploadBlogImage(filePath, destination)
)
// Image API functions
ipcMain.handle('get-image-folders', getImageFolders)
ipcMain.handle('rename-image', (_event, imageurl: string, newname: string) =>
  renameImage(imageurl, newname)
)
ipcMain.handle('delete-image', (_event, imageurl: string) => deleteImage(imageurl))
ipcMain.handle('get-folder-images', (_event, toplevel: string) => getFolderImages(toplevel))
ipcMain.handle(
  'move-images', // simplify this to just move images to a new location
  (_event, filesToMove: string[], destination: string) => moveImages(filesToMove, destination)
)
ipcMain.handle('upload-image', (_event, filePath: string, destination: string) =>
  uploadImage(filePath, destination)
)
ipcMain.handle('upload-images', (_event, filePaths: string[], destination: string) =>
  uploadImages(filePaths, destination)
)
ipcMain.handle('get-preview-images', (_event, images: string[]) => getPreviewImages(images))
// Shop API functions
ipcMain.handle('get-products', getProducts)
ipcMain.handle('update-product', (_event, product: ProductType) => updateProduct(product))
ipcMain.handle('get-subjects', getSubjects)
ipcMain.handle('update-subject', (_event, subject: Subject) => updateSubject(subject))
ipcMain.handle('delete-subject', (_event, subjectid: string) => deleteSubject(subjectid))
ipcMain.handle('get-categories', getAllCategories)
ipcMain.handle('update-category', (_event, category: CategoryType) => updateCategories(category))
ipcMain.handle('get-sale', getSale)
ipcMain.handle('set-sale', (_event, sale: string) => setSale(sale))
