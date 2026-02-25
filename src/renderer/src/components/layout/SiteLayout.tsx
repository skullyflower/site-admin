import { IconButton, Image, Stack, Splitter } from '@chakra-ui/react'
import { Link, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { LuChevronLeft, LuMenu } from 'react-icons/lu'
import Sidebar from '../Sidebar'
import logo from '@renderer/assets/SiteAdmin.png'

const SIDEBAR_WIDTH_EXPANDED = 20
const CONTENT_WIDTH_EXPANDED = 80
const SIDEBAR_WIDTH_COLLAPSED = 5
const CONTENT_WIDTH_COLLAPSED = 95

export default function SiteLayout(): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sizes, setSizes] = useState([SIDEBAR_WIDTH_EXPANDED, CONTENT_WIDTH_EXPANDED])

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen)
    if (sidebarOpen) {
      setSizes([SIDEBAR_WIDTH_COLLAPSED, CONTENT_WIDTH_COLLAPSED])
    } else {
      setSizes([SIDEBAR_WIDTH_EXPANDED, CONTENT_WIDTH_EXPANDED])
    }
  }

  const onResize = (details: Splitter.ResizeDetails): void => {
    setSizes(details.size)
    if (details.size[0] > SIDEBAR_WIDTH_EXPANDED / 2) {
      setSidebarOpen(true)
    } else {
      setSidebarOpen(false)
    }
  }

  return (
    <Splitter.Root
      panels={[
        { id: 'sidebar', minSize: SIDEBAR_WIDTH_COLLAPSED, maxSize: SIDEBAR_WIDTH_EXPANDED },
        { id: 'content', minSize: CONTENT_WIDTH_EXPANDED, maxSize: CONTENT_WIDTH_COLLAPSED }
      ]}
      defaultSize={sizes}
      borderWidth="1px"
      size={sizes}
      onResize={onResize}
      minH="100"
    >
      <Splitter.Panel id="sidebar">
        <Stack direction="column" align="center" justify="start" gap={2}>
          <Link to="/" style={{ flex: 1, minWidth: '20px', display: 'block' }}>
            <Image src={logo} className="App-logo" alt="WebSite Config" maxW="120px" w="100%" />
          </Link>
          <IconButton aria-label="Toggle sidebar" size="sm" variant="ghost" onClick={toggleSidebar}>
            {sidebarOpen === true ? <LuChevronLeft /> : <LuMenu />}
          </IconButton>
          <Sidebar minimized={!sidebarOpen} />
        </Stack>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="sidebar:content" />
      <Splitter.Panel id="content">
        <Outlet />
      </Splitter.Panel>
    </Splitter.Root>
  )
}
