import { useRef } from 'react'
import { Dialog, Portal, Button } from '@chakra-ui/react'
import { buttonRecipe } from '@renderer/themeRecipes'
interface ConfirmDeleteProps {
  what: string
  action: () => void
  onClose: () => void
  isOpen: boolean
}
const ConfirmDelete = ({ what, action, onClose, isOpen }: ConfirmDeleteProps): React.ReactNode => {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const doAction = (): void => {
    action()
    onClose()
  }
  return (
    <Dialog.Root
      role="alertdialog"
      open={isOpen}
      finalFocusEl={() => cancelRef.current}
      onOpenChange={(e) => {
        if (!e.open) {
          onClose()
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title fontSize="lg" fontWeight="bold">
                Delete {what}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>Are you sure? You&apos;t undo this action afterwards.</Dialog.Body>

            <Dialog.Footer>
              <Button recipe={buttonRecipe} onClick={onClose}>
                Cancel
              </Button>
              <Button colorPalette="red" onClick={doAction} ml={3}>
                Delete
              </Button>
            </Dialog.Footer>
            <Dialog.CloseTrigger />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
export default ConfirmDelete
