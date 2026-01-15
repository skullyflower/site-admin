import { Box, Image, HStack, Text, Stack, Badge } from '@chakra-ui/react'
import SemiSafeContent from '../components/SemiSafeContent'
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
            <SemiSafeContent rawContent={pageData.page_content} />
          </Box>
        </HStack>
        <HStack alignItems="top">
          <Text fontWeight="bold" minW={48}>
            Features:
          </Text>
          {pageData.features?.map((feature) => (
            <Badge key={feature}>{feature}</Badge>
          ))}
        </HStack>
      </Stack>
    </Box>
  )
}
export default HomePagePreview
