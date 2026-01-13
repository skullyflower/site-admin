import HomePage from '@renderer/pages/homepage'
import BlogPage from '@renderer/pages/blogpage'
import ConfigPage from '@renderer/pages/configpage'
import WelcomePage from '@renderer/pages'
import ProductsPage from '@renderer/pages/productspage'
import CategoriesPage from '@renderer/pages/categoriespage'
import GalleryPage from '@renderer/pages/galleriespage'
//import SalePage from '@renderer/pages/salepage'
import { Route } from 'react-router-dom'
import { Router } from '@renderer/../../lib/electron-router-dom'
import SiteLayout from './layout/SiteLayout'
import SubjectsPage from '@renderer/pages/subjectspage'
import ContentPages from '@renderer/pages/contentpages'
import ImageUploadPage from '@renderer/pages/ImageUploadpage'

export default function SiteRoutes(): React.JSX.Element {
  return (
    <Router
      main={
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/content" element={<ContentPages />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/images" element={<ImageUploadPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          {/*<Route path="/sale" element={<SalePage />} />*/}
          <Route path="/config" element={<ConfigPage />} />
          <Route path="*" element={<WelcomePage />} />
        </Route>
      }
    />
  )
}
