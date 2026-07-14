import { Box, Image, HStack, Text, Stack, Badge } from '@chakra-ui/react'
import SemiSafeContent from '@renderer/components/SemiSafeContent'
import { SiteInfo } from '@renderer/../../src/shared/types'
import DynamicIcon from '@renderer/components/ui/DynamicIcon'

function HomePagePreview({ pageData }: { pageData: SiteInfo }): React.JSX.Element {
  if (!pageData) {
    return <Box>No data found</Box>
  }
  return (
    <Box p={5}>
      <Stack gap={1} width="100%" alignItems="stretch">
        {pageData.sitelogo && (
          <HStack alignItems="top">
            <Text fontWeight="bold" w={40}>
              Site Logo:
            </Text>
            <Image
              src={`http://localhost:3000/${pageData.sitelogo}`}
              height={'100px'}
              alt="Site Logo"
            />
          </HStack>
        )}

        <HStack alignItems="center" gap={2}>
          <Text fontWeight="bold" w={40}>
            Home Page Title:
          </Text>
          <Text>{pageData?.page_title}</Text>
        </HStack>
        <HStack alignItems="center">
          <Text fontWeight="bold" w={40}>
            Brand Name:
          </Text>
          <Text>{pageData?.brand_name}</Text>
        </HStack>
        <HStack alignItems="center">
          <Text fontWeight="bold" w={40}>
            Live Url:
          </Text>
          <Text>{pageData.live_site_url}</Text>
        </HStack>
        <HStack alignItems="center">
          <Text fontWeight="bold" minW={40}>
            SEO Description:
          </Text>
          <Box
            minH={2}
            borderColor={'var(--chakra-colors-fg)'}
            borderWidth={1}
            p={2}
            borderStyle="solid"
            borderRadius={5}
          >
            <Text>{pageData.page_description}</Text>
          </Box>
        </HStack>
        <HStack alignItems="top">
          <Text fontWeight="bold" minW={40}>
            Home Page Content:
          </Text>
          <Box
            flexGrow={3}
            minH={2}
            borderWidth={1}
            borderColor={'var(--chakra-colors-fg)'}
            borderStyle="solid"
            borderRadius={5}
            p={4}
          >
            <SemiSafeContent rawContent={pageData.page_content} />
          </Box>
        </HStack>
        {pageData.site_theme && (
          <HStack alignItems="center">
            <Text fontWeight="bold" w={40}>
              Default Theme:
            </Text>
            <Text>{pageData.site_theme}</Text>
          </HStack>
        )}
        <HStack alignItems="top">
          <Text fontWeight="bold" minW={40}>
            External Links:
          </Text>
          {pageData.links?.map((link) => (
            <a key={link.id} href={link.url} target="externallinks">
              <HStack alignItems="center" gap={1}>
                <DynamicIcon iconName={link.icon} size={20} />
                {link.text}
              </HStack>
            </a>
          ))}
        </HStack>
        <HStack alignItems="top">
          <Text fontWeight="bold" minW={40}>
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
