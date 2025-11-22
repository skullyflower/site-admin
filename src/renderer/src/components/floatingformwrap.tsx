import { Button, Dialog, Portal } from '@chakra-ui/react'
import { buttonRecipe } from '@renderer/themeRecipes'

interface FloatingFormWrapperProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}
const FloatingFormWrapper = ({
  isOpen,
  onClose,
  children
}: FloatingFormWrapperProps): React.ReactNode => {
  return (
    <Dialog.Root
      placement="center"
      size="lg"
      open={isOpen}
      onOpenChange={(e) => {
        if (!e.open) {
          onClose()
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(180deg)" />
        <Dialog.Positioner>
          <Dialog.Content
            borderWidth={2}
            borderStyle="solid"
            borderColor="slate.500"
            backgroundColor="gray.800"
            color="slate.100"
            maxH={'88vh'}
            overflow={'auto'}
            className="content"
          >
            <Dialog.CloseTrigger asChild>
              <Button recipe={buttonRecipe} onClick={onClose}>
                Never mind
              </Button>
            </Dialog.CloseTrigger>
            <Dialog.Body>{children}</Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
export default FloatingFormWrapper
