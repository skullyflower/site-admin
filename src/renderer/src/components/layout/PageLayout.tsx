import {
  Alert,
  Button,
  Card,
  Dialog,
  Heading,
  HStack,
  Portal,
  ScrollArea,
  Stack
} from '@chakra-ui/react'
import { buttonRecipe } from '@renderer/themeRecipes'

interface PageLayoutProps {
  messages: string | null
  setMessages: (string: string | null) => void
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
const PageLayout = ({
  messages,
  setMessages,
  title,
  button,
  children
}: PageLayoutProps): React.ReactNode => {
  return (
    <Card.Root
      variant="outline"
      borderWidth={2}
      borderStyle="solid"
      borderColor="slate.500"
      backgroundColor="gray.800"
      color="slate.100"
      w={['100%', '100%', '95%', '95%', '95%']}
      height={'82vh'}
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
          {messages && (
            <Dialog.Root placement="center" role="alertdialog" open={messages !== null}>
              <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                  <Dialog.Content>
                    <Dialog.Header>
                      <Dialog.Title>Submitted</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                      <Alert.Root status="info">{messages}</Alert.Root>
                    </Dialog.Body>
                    <Dialog.Footer>
                      <Dialog.CloseTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setMessages(null)}>
                          Close
                        </Button>
                      </Dialog.CloseTrigger>
                    </Dialog.Footer>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          )}
        </Stack>
      </Card.Header>
      <Card.Body>
        <ScrollArea.Root height="inherit">
          <ScrollArea.Viewport>
            <ScrollArea.Content>{children}</ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar>
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </Card.Body>
    </Card.Root>
  )
}
export default PageLayout
