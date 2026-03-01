import { Button, Field, HStack, Text } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { AdminConfig } from 'src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'
import { useState } from 'react'

const ConfigForm = ({
  formData,
  setValue,
  onSubmit
}: {
  formData: AdminConfig | null
  setValue: (value: AdminConfig | null) => void
  onSubmit: () => void
}): React.ReactNode => {
  const [changed, setChanged] = useState<boolean>(false)
  const updateSiteDirectory = (): void => {
    window.api
      .selectSiteDirectory()
      .then((data) => {
        if (data === undefined) {
          alert('No directory selected')
          return
        }
        if (data && typeof data === 'string') {
          setValue({ ...formData, pathToSite: data } as AdminConfig)
          setChanged(true)
        }
        return
      })
      .catch((err: Error) => {
        alert(err.message || 'Failed to select directory')
      })
  }
  return (
    <Stack gap={4}>
      <Text paddingInline={4}>
        Currently Selected Site Folder:{' '}
        <em style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          {formData?.pathToSite || 'No config found'}
        </em>
      </Text>
      <Field.Root p={4}>
        <HStack alignItems="center">
          <Field.Label w={48}>Select a Site To Edit:</Field.Label>
          <Button onClick={updateSiteDirectory}>Select Site Directory</Button>
        </HStack>
      </Field.Root>
      <HStack justifyContent="end">
        <Button disabled={!changed} recipe={buttonRecipe} onClick={() => onSubmit()}>
          Submit Changes
        </Button>
      </HStack>
    </Stack>
  )
}
export default ConfigForm
