import { Box, Image, HStack, Text, Stack, List, Heading, Link } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { SiteInfo } from 'src/shared/types'

function HomePagePreview({ pageData }: { pageData: SiteInfo }): React.JSX.Element {
  if (!pageData) {
    return <Box>No data found</Box>
  }
  return (
    <Box p={5}>
      <Stack gap={4} width="100%" alignItems="stretch">
        <HStack alignItems="center" gap={4}>
          <Text fontWeight="bold" w={48}>
            Home Page Title:{' '}
          </Text>
          <Text>{pageData?.page_title}</Text>
        </HStack>
        <HStack alignItems="center">
          <Text fontWeight="bold" w={48}>
            Company Name:{' '}
          </Text>
          <Text>{pageData?.company_name}</Text>
        </HStack>
        <HStack alignItems="center">
          <Text fontWeight="bold" w={48}>
            Live Url:{' '}
          </Text>
          <Text>{pageData.live_site_url}</Text>
        </HStack>
        <HStack alignItems="center">
          <Text fontWeight="bold" minW={48}>
            SEO Description:{' '}
          </Text>
          <Box minH={2} borderWidth={1} p={4} borderStyle="solid" borderRadius={5}>
            <Text>{pageData.page_description}</Text>
          </Box>
        </HStack>
        {pageData.sitelogo && (
          <HStack alignItems="top">
            <Text fontWeight="bold" w={48}>
              Site Logo:
            </Text>
            <Image
              src={`http://localhost:3000/${pageData.sitelogo}`}
              height={'100px'}
              alt="Site Logo"
            />
          </HStack>
        )}
        {pageData.site_theme && (
          <HStack alignItems="center">
            <Text fontWeight="bold" w={48}>
              Default Theme:
            </Text>
            <Text>{pageData.site_theme}</Text>
          </HStack>
        )}
        <HStack alignItems="top">
          <Text fontWeight="bold" minW={48}>
            Home Page Top Content:
          </Text>
          <Box flexGrow={3} minH={2} borderWidth={1} borderStyle="solid" borderRadius={5} p={4}>
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <Heading as="h1" fontSize="2xl">
                    {children}
                  </Heading>
                ),
                h2: ({ children }) => (
                  <Heading as="h2" fontSize="xl">
                    {children}
                  </Heading>
                ),
                h3: ({ children }) => (
                  <Heading as="h3" fontSize="lg">
                    {children}
                  </Heading>
                ),
                h4: ({ children }) => (
                  <Heading as="h4" fontSize="md">
                    {children}
                  </Heading>
                ),
                h5: ({ children }) => (
                  <Heading as="h5" fontSize="sm">
                    {children}
                  </Heading>
                ),
                h6: ({ children }) => (
                  <Heading as="h6" fontSize="xs">
                    {children}
                  </Heading>
                ),
                p: ({ children }) => <Text>{children}</Text>,
                ul: ({ children }) => <List.Root>{children}</List.Root>,
                ol: ({ children }) => <List.Root>{children}</List.Root>,
                li: ({ children }) => <List.Item>{children}</List.Item>,
                a: ({ children, href }) => (
                  <Link color="blue.500" href={href} target="_blank">
                    {children}
                  </Link>
                )
              }}
            >
              {pageData?.page_content}
            </ReactMarkdown>
          </Box>
        </HStack>
      </Stack>
    </Box>
  )
}
export default HomePagePreview
