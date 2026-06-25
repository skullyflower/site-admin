import UploadInput from '@renderer/components/inputs/upload-input'
import { Heading, Button, Stack } from '@chakra-ui/react'
import FloatingFormWrapper from '@renderer/components/floatingformwrap'
import { buttonRecipe } from '@renderer/themeRecipes/button.recipe'

export default function AddImagesForm({
  isOpen,
  hideForm
}: {
  isOpen: boolean
  hideForm: () => void
  setMessages: (message: string) => void
}): React.JSX.Element {
  return (
    <FloatingFormWrapper isOpen={isOpen} onClose={hideForm}>
      <Heading size="md">Upload Images</Heading>
      <Stack gap={4} alignItems="center">
        <UploadInput multiple={true} onUpload={() => void 0} />
        <Button recipe={buttonRecipe} onClick={hideForm}>
          Done
        </Button>
      </Stack>
    </FloatingFormWrapper>
  )
}
