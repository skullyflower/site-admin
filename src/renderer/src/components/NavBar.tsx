import { Button, HStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Link, useMatch } from 'react-router-dom'
import { AdminConfig, ApiMessageResponse } from 'src/shared/types'
interface NavButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  path: string
  children: React.ReactNode
}

const NavButton = ({ path, children }: NavButtonProps): React.ReactNode => {
  return (
    <Button
      as={Link}
      to={path}
      size="xs"
      border={0}
      backgroundColor={useMatch(path) ? 'blue.500' : 'gray.500'}
    >
      {children}
    </Button>
  )
}

const NavBar = (): React.ReactNode => {
  const [config, setConfig] = useState<AdminConfig | null>(null)
  useEffect(() => {
    if (config === null) {
      window.api.getAdminConfig().then((response: ApiMessageResponse | AdminConfig) => {
        setConfig(response as AdminConfig)
      })
    }
  }, [config])

  return (
    <HStack className="navbar" justifyContent={'center'} gap={2} wrap={'wrap'}>
      <NavButton path="/home">Home</NavButton>
      {config?.features?.includes('blog') && <NavButton path="/blog">Blog</NavButton>}
      {config?.features?.includes('content') && (
        <NavButton path="/content">Content Pages</NavButton>
      )}
      {config?.features?.includes('galleries') && <NavButton path="/gallery">Galleries</NavButton>}
      {config?.features?.includes('products') && <NavButton path="/products">Products</NavButton>}
      {config?.features?.includes('categories') && (
        <NavButton path="/categories">Categories</NavButton>
      )}
      {config?.features?.includes('subjects') && <NavButton path="/subjects">Subjects</NavButton>}
      {config?.features?.includes('sale') && <NavButton path="/sale">Sale</NavButton>}
      <NavButton path="/images">Image Upload</NavButton>
      <NavButton path="/config">Config</NavButton>
    </HStack>
  )
}

export default NavBar
