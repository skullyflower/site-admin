import { Button, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useMatch } from 'react-router-dom'
import { SiteInfo, ApiMessageResponse } from 'src/shared/types'
import {
  CatIcon,
  CirclesFourIcon,
  HouseIcon,
  NewspaperClippingIcon,
  FileTextIcon,
  SlideshowIcon,
  ShoppingCartIcon,
  TagIcon,
  ImageIcon,
  GearIcon
} from '@phosphor-icons/react'
interface NavButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  path: string
  icon?: React.ReactNode
  children: React.ReactNode
  minimized?: boolean
}

const NavButton = ({ path, icon, children, minimized }: NavButtonProps): React.ReactNode => {
  return (
    <Button
      as={Link}
      to={path}
      size="sm"
      border={0}
      backgroundColor={useMatch(path) ? 'slate.700' : 'gray.500'}
      alignItems="center"
      justifyContent="start"
      gap={2}
    >
      {icon}
      {!minimized && children}
    </Button>
  )
}

const SideBar = ({ minimized }: { minimized?: boolean }): React.ReactNode => {
  const [config, setConfig] = useState<SiteInfo | null>(null)
  const location = useLocation()
  useEffect(() => {
    window.api.getSiteInfo().then((response: ApiMessageResponse | SiteInfo) => {
      setConfig(response as SiteInfo)
    })
  }, [location])

  return (
    <Stack
      direction="column"
      className="sidebar"
      justifyContent={'start'}
      alignItems="stretch"
      gap={2}
      width={minimized ? '50px' : '200px'}
    >
      <NavButton path="/home" icon={<HouseIcon />} minimized={minimized}>
        Home
      </NavButton>
      {config?.features?.includes('blog') && (
        <NavButton path="/blog" icon={<NewspaperClippingIcon />} minimized={minimized}>
          Blog
        </NavButton>
      )}
      {config?.features?.includes('content') && (
        <NavButton path="/content" icon={<FileTextIcon />} minimized={minimized}>
          Content Pages
        </NavButton>
      )}
      {config?.features?.includes('galleries') && (
        <NavButton path="/gallery" icon={<SlideshowIcon />} minimized={minimized}>
          Galleries
        </NavButton>
      )}
      {config?.features?.includes('products') && (
        <NavButton path="/products" icon={<ShoppingCartIcon />} minimized={minimized}>
          Products
        </NavButton>
      )}
      {config?.features?.includes('categories') && (
        <NavButton path="/categories" icon={<CatIcon />} minimized={minimized}>
          Categories
        </NavButton>
      )}
      {config?.features?.includes('subjects') && (
        <NavButton icon={<CirclesFourIcon />} path="/subjects" minimized={minimized}>
          Subjects
        </NavButton>
      )}
      {config?.features?.includes('sale') && (
        <NavButton icon={<TagIcon />} path="/sale" minimized={minimized}>
          Sale
        </NavButton>
      )}
      <NavButton icon={<ImageIcon />} path="/images" minimized={minimized}>
        Image Upload
      </NavButton>
      <NavButton icon={<GearIcon />} path="/config" minimized={minimized}>
        Config
      </NavButton>
    </Stack>
  )
}

export default SideBar
