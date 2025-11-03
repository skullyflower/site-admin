import { Button, HStack } from '@chakra-ui/react'
import { Link, useMatch } from 'react-router-dom'
interface NavButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  path: string
  children: React.ReactNode
}
const NavButton = ({ path, children }: NavButtonProps): React.ReactNode => {
  return (
    <Button
      size="xs"
      border={0}
      as={Link}
      to={path}
      backgroundColor={useMatch(path) ? 'blue.500' : 'gray.500'}
    >
      {children}
    </Button>
  )
}

const NavBar = (): React.ReactNode => {
  return (
    <HStack className="navbar" justifyContent={'center'} gap={2} wrap={'wrap'}>
      <NavButton path="/home">Home</NavButton>
      <NavButton path="/blog">Blog</NavButton>
      <NavButton path="/content">Content Pages</NavButton>
      <NavButton path="/gallery">Galleries</NavButton>
      <NavButton path="/images">Image Upload</NavButton>
      <NavButton path="/products">Products</NavButton>
      <NavButton path="/categories">Categories</NavButton>
      <NavButton path="/subjects">Subjects</NavButton>
      <NavButton path="/sale">Sale</NavButton>
      <NavButton path="/config">Config</NavButton>
    </HStack>
  )
}

export default NavBar
