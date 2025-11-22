import { Button, Center, Field, HStack } from '@chakra-ui/react'

import { Stack } from '@chakra-ui/react'
import InfoBubble from '@renderer/components/info-bubble'
import { AdminConfig } from 'src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'

const ConfigForm = ({
  formData,
  setValue,
  onSubmit
}: {
  formData: AdminConfig | null
  setValue: (value: string) => void
  onSubmit: () => void
}): React.ReactNode => {
  return (
    <Stack gap={4}>
      <div>Current Config: {formData?.pathToSite || 'No config found'}</div>
      <Field.Root p={4}>
        <HStack alignItems="center">
          <Field.Label w={48}>
            Site Folder Path: <InfoBubble message="Relative path to the site you are editing" />
          </Field.Label>
          <Button
            onClick={() => {
              window.api
                .selectSiteDirectory()
                .then((data: string | unknown) => {
                  if (data && typeof data === 'string') {
                    setValue(data)
                  } else {
                    alert('No directory selected')
                  }
                })
                .catch((err: Error) => {
                  alert(err.message || 'Failed to select directory')
                })
            }}
          >
            Select Site Directory
          </Button>
        </HStack>
      </Field.Root>
      <Center>
        <HStack gap={4}>
          <Button recipe={buttonRecipe} onClick={() => onSubmit()}>
            Submit Changes
          </Button>
        </HStack>
      </Center>
    </Stack>
  )
}
export default ConfigForm
