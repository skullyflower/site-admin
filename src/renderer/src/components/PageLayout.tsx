import { Alert, Button, Card, Heading, HStack, Stack } from '@chakra-ui/react'
import { buttonRecipe } from '@renderer/themeRecipes'

interface PageLayoutProps {
  messages: string | null
  title: string
  button?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (values: any | undefined) => void
    text: string
    value: string | null
    disabled?: boolean
  }
  children: React.ReactNode
}
const PageLayout = ({ messages, title, button, children }: PageLayoutProps): React.ReactNode => {
  return (
    <Card.Root
      variant="outline"
      borderWidth={2}
      borderStyle="solid"
      borderColor="slate.500"
      backgroundColor="gray.800"
      color="slate.100"
      w={['100%', '100%', '95%', '95%', '95%']}
      maxHeight={'88vh'}
      overflowY={'auto'}
      marginInline={'auto'}
    >
      <Card.Header>
        <Stack gap={4}>
          <HStack align="center" justifyContent="space-between">
            <Heading textAlign="center" size="lg">
              {title}
            </Heading>
            {button && (
              <Button
                recipe={buttonRecipe}
                disabled={button.disabled}
                value={button.value || ''}
                onClick={button.action}
              >
                {button.text}
              </Button>
            )}
          </HStack>
          {messages && <Alert.Root status="info">{messages}</Alert.Root>}
        </Stack>
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card.Root>
  )
}
export default PageLayout
