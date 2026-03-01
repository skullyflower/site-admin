import UploadInput from '../components/inputs/upload-input'
import { Heading, HStack, Button, Stack } from '@chakra-ui/react'
import FloatingFormWrapper from '../components/floatingformwrap'
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
      <Stack gap={4} justifyContent="center">
        <HStack justifyContent="space-between">
          <Heading size="md">Upload Images</Heading>
          <Button recipe={buttonRecipe} onClick={hideForm}>
            Done
          </Button>
        </HStack>
        <UploadInput multiple={true} onUpload={() => void 0} />
      </Stack>
    </FloatingFormWrapper>
  )
}
