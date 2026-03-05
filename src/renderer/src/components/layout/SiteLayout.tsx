import { IconButton, Image, Stack, Splitter, Heading } from '@chakra-ui/react'
import { Link, Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LuChevronLeft, LuMenu } from 'react-icons/lu'
import Sidebar from '../Sidebar'
import logo from '@renderer/assets/SiteAdmin.png'
import { AdminConfig } from 'src/shared/types'

const SIDEBAR_WIDTH_EXPANDED = 20
const CONTENT_WIDTH_EXPANDED = 80
const SIDEBAR_WIDTH_COLLAPSED = 5
const CONTENT_WIDTH_COLLAPSED = 95

const SIDEBAR_EXPANDED_CUTOFF_PIXELS = 170

const getAdminConfig = async (
  setAdminConfig: (adminConfig: AdminConfig) => void
): Promise<void> => {
  const response = await window.api.getAdminConfig()
  setAdminConfig(response as AdminConfig)
}

export default function SiteLayout(): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [adminConfig, setAdminConfig] = useState<AdminConfig | null>(null)
  const [sizes, setSizes] = useState([SIDEBAR_WIDTH_EXPANDED, CONTENT_WIDTH_EXPANDED])

  useEffect(() => {
    getAdminConfig(setAdminConfig)
  }, [setAdminConfig])

  const toggleSidebar = (): void => {
    setSidebarOpen(!sidebarOpen)
    if (sidebarOpen) {
      setSizes([SIDEBAR_WIDTH_COLLAPSED, CONTENT_WIDTH_COLLAPSED])
    } else {
      setSizes([SIDEBAR_WIDTH_EXPANDED, CONTENT_WIDTH_EXPANDED])
    }
  }

  const handleWindowResize = (): void => {
    const sidebarWidthInPixels = (sizes[0] / 100) * window.innerWidth
    if (sidebarWidthInPixels > SIDEBAR_EXPANDED_CUTOFF_PIXELS) {
      setSidebarOpen(true)
    } else {
      setSidebarOpen(false)
    }
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes])

  const onResize = (details: Splitter.ResizeDetails): void => {
    setSizes(details.size)
    //sizes are really percentages. Need to calculate sidebar width in pixels and check if it's greater than the cutoff pixels
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
      <Splitter.Panel id="sidebar" minW="20px">
        <Stack
          direction="column"
          align="center"
          justify="start"
          justifyContent="start"
          gap={1}
          paddingTop={2}
          height={'98vh'}
          overflowY={'auto'}
        >
          <Link to="/" style={{ minWidth: '20px', display: 'block' }}>
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
        <Heading size="lg" textAlign="center" p={2}>
          Editing: {adminConfig?.pathToSite}
        </Heading>
        <Outlet />
      </Splitter.Panel>
    </Splitter.Root>
  )
}
