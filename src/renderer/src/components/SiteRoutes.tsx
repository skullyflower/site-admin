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
import SiteLayout from './SiteLayout'
import { useEffect, useState } from 'react'
import { AdminConfig, ApiMessageResponse } from 'src/shared/types'
import SubjectsPage from '@renderer/pages/subjectspage'

export default function SiteRoutes(): React.JSX.Element {
  const [config, setConfig] = useState<AdminConfig | null>(null)
  const [messages, setMessages] = useState<string | null>(null)
  useEffect(() => {
    window.api.getAdminConfig().then((response: ApiMessageResponse | AdminConfig) => {
      if (typeof response === 'object' && 'message' in response) {
        setMessages(response.message as string)
      } else {
        setConfig(response as AdminConfig)
      }
    })
  }, [])
  if (config === null && messages === null) {
    return <div>Loading...</div>
  }
  if (messages) {
    return <div>{messages}</div>
  }
  return (
    <Router
      main={
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          {/* <Route path="/content" element={<ContentPage />} />*/}
          <Route path="/gallery" element={<GalleryPage />} />
          {/*<Route path="/images" element={<ImagesPage />} />*/}
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
