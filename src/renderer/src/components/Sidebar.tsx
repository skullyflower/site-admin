import { Button, Stack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const onClick = (): void => {
    navigate(path)
  }
  return (
    <Button
      onClick={onClick}
      size="xs"
      border={0}
      color={useMatch(path) ? 'green.300' : 'green.900'}
      backgroundColor={useMatch(path) ? 'slate.700' : 'slate.500'}
      _hover={{
        color: 'green.300',
        backgroundColor: 'slate.700'
      }}
      justifyContent={minimized ? 'center' : 'start'}
      gap={2}
      title={children as string}
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
      <NavButton path="/home" icon={<HouseIcon weight="fill" />} minimized={minimized}>
        Home
      </NavButton>
      {config?.features?.includes('blog') && (
        <NavButton
          path="/blog"
          icon={<NewspaperClippingIcon weight="fill" />}
          minimized={minimized}
        >
          Blog
        </NavButton>
      )}
      {config?.features?.includes('content') && (
        <NavButton path="/content" icon={<FileTextIcon weight="fill" />} minimized={minimized}>
          Content Pages
        </NavButton>
      )}
      {config?.features?.includes('galleries') && (
        <NavButton path="/gallery" icon={<SlideshowIcon weight="fill" />} minimized={minimized}>
          Galleries
        </NavButton>
      )}
      {config?.features?.includes('products') && (
        <NavButton path="/products" icon={<ShoppingCartIcon weight="fill" />} minimized={minimized}>
          Products
        </NavButton>
      )}
      {config?.features?.includes('categories') && (
        <NavButton path="/categories" icon={<CatIcon weight="fill" />} minimized={minimized}>
          Categories
        </NavButton>
      )}
      {config?.features?.includes('subjects') && (
        <NavButton icon={<CirclesFourIcon weight="fill" />} path="/subjects" minimized={minimized}>
          Subjects
        </NavButton>
      )}
      {config?.features?.includes('sale') && (
        <NavButton icon={<TagIcon weight="fill" />} path="/sale" minimized={minimized}>
          Sale
        </NavButton>
      )}
      <NavButton icon={<ImageIcon weight="fill" />} path="/images" minimized={minimized}>
        Image Upload
      </NavButton>
      <NavButton icon={<GearIcon weight="fill" />} path="/config" minimized={minimized}>
        Config
      </NavButton>
    </Stack>
  )
}

export default SideBar
