import { Stack, Flex, LinkBox, Image } from '@chakra-ui/react'
import { Link, Outlet } from 'react-router-dom'
import NavBar from '../NavBar'
import logo from '@renderer/assets/SiteAdmin.png'

export default function SiteLayout(): React.JSX.Element {
  return (
    <Stack gap={4} width="100%">
      <header id="pagetop" style={{ zIndex: 100, position: 'sticky', top: 0, textAlign: 'center' }}>
        <Flex p={2} direction={['column', 'row']} justifyContent="center" align={'center'} gap={4}>
          <LinkBox as={Link} to="/" width={100} height="auto">
            <Image src={logo} className="App-logo" alt="WebSite Config" />
          </LinkBox>
          <NavBar />
        </Flex>
      </header>
      <main id="pagebody" style={{ justifySelf: 'stretch' }}>
        <section id="content">
          <Outlet />
        </section>
      </main>
    </Stack>
  )
}
