import { app, shell, BrowserWindow, ipcMain, dialog, OpenDialogReturnValue } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { getBlogs, updateBlogInfo, updateBlogPost, deletEntry } from './modules/blogRouter'
import { getSiteInfo, updateSiteInfo } from './modules/homeRouter'
import { getSale, setSale } from './modules/saleRouter'
import { getGalleries, updateGallery, resetGallery } from './modules/galleryRouter'
import {
  getStagedImages,
  moveImages,
  renameImage,
  deleteImage,
  getFolderImages,
  uploadImages,
  getPreviewImages,
  processUploadedImages,
  uploadBlogImage
} from './modules/imagesRouter'
import { registerRoute } from '../lib/electron-router-dom'
import { getAdminConfig, updateAdminConfig } from './modules/configRouter'
import { BlogEntry, Category, Product, Subject } from '../shared/types'
import { FileLike } from './modules/imageProcessor'
import { getSubjects, updateSubject } from './modules/subjectsRouter'
import { getProducts, updateProduct } from './modules/productsRouter'
import { getAllCategories, updateCategories } from './modules/categoriesRouter'

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
      webviewTag: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  //   mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  // } else {
  //   mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  // }

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
ipcMain.handle('get-blogs', getBlogs)
ipcMain.handle('update-blog-info', updateBlogInfo)
ipcMain.handle('update-blog-post', (_event, entry: BlogEntry, files: FileLike[]) =>
  updateBlogPost(entry, files)
)
ipcMain.handle('delete-entry', (_event, blogid: string) => deletEntry(blogid))
// Site Info API functions
ipcMain.handle('get-site-info', getSiteInfo)
ipcMain.handle('update-site-info', (_event, siteInfo: string) => updateSiteInfo(siteInfo))
// Gallery API functions
ipcMain.handle('get-galleries', getGalleries)
ipcMain.handle('update-gallery', (_event, gallery: string) => updateGallery(gallery))
ipcMain.handle('reset-gallery', (_event, gallery: string) => resetGallery(gallery))
ipcMain.handle('get-staged-images', getStagedImages)
ipcMain.handle(
  'process-uploaded-images',
  (_event, fileDataArray: Array<{ name: string; data: ArrayBuffer }>) =>
    processUploadedImages(fileDataArray)
)
ipcMain.handle('upload-blog-image', (_event, filePath: string, destination: string) =>
  uploadBlogImage(filePath, destination)
)
// Image API functions
ipcMain.handle(
  'move-images', // simplify this to just move images to a new location
  (_event, filesToMove: string, toplevel: string, secondLevels: string) =>
    moveImages(filesToMove, toplevel, secondLevels)
)
ipcMain.handle('rename-image', (_event, imageurl: string, newname: string) =>
  renameImage(imageurl, newname)
)
ipcMain.handle('delete-image', (_event, imageurl: string) => deleteImage(imageurl))
ipcMain.handle('get-folder-images', (_event, toplevel: string) => getFolderImages(toplevel))
ipcMain.handle('upload-images', (_event, dest: string, files: string) => uploadImages(dest, files))
// work this out, might need to get one preview at a time, we are only moving files and then displaying them.
ipcMain.handle('get-preview-images', (_event, images: string[]) => getPreviewImages(images))
// Shop API functions
ipcMain.handle('get-products', getProducts)
ipcMain.handle('update-product', (_event, product: Product, files: FileLike[]) =>
  updateProduct(product, files)
)
ipcMain.handle('get-subjects', getSubjects)
ipcMain.handle('update-subject', (_event, subject: Subject) => updateSubject(subject))
ipcMain.handle('get-categories', getAllCategories)
ipcMain.handle('update-category', (_event, category: Category) => updateCategories(category))
ipcMain.handle('get-sale', getSale)
ipcMain.handle('set-sale', (_event, sale: string) => setSale(sale))
