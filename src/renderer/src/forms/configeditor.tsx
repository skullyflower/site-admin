import { Box, Button, Field, HStack, Text } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { AdminConfig } from '../../../../src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'
import { useState } from 'react'
import useRunServer from '@renderer/hooks/useRunServer'

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
  const { launchDevServer, stopDevServer, serverRunning } = useRunServer()

  const updateSiteDirectory = (): void => {
    window.api
      .selectSiteDirectory()
      .then((data) => {
        if (data === undefined) {
          alert('No directory selected')
          return
        }
        if (data && typeof data === 'string') {
          if (data !== formData?.pathToSite) setChanged(true)
          setValue({ ...formData, pathToSite: data } as AdminConfig)
        }
        return
      })
      .catch((err: Error) => {
        alert(err.message || 'Failed to select directory')
      })
  }

  return (
    <Stack alignItems="center" justifyContent="center" gap={4}>
      <Text paddingInline={4}>
        Currently Selected Site Folder:{' '}
        <em style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          {formData?.pathToSite || 'No config found'}
        </em>
      </Text>
      <Box border="1px solid" borderColor="slate.300" padding={4} borderRadius={4}>
        <Field.Root p={4}>
          <HStack alignItems="center">
            <Field.Label w={48}>Select a Site To Edit:</Field.Label>
            <Button onClick={updateSiteDirectory}>Select Site Directory</Button>
          </HStack>
        </Field.Root>
      </Box>
      <HStack justifyContent="end">
        <Button disabled={!changed} recipe={buttonRecipe} onClick={() => onSubmit()}>
          Submit Changes
        </Button>
      </HStack>
      <HStack justifyContent="center">
        {serverRunning !== null && (
          <Text fontSize="sm" color={serverRunning ? 'green.500' : 'gray.400'}>
            Dev Server: {serverRunning ? 'Running: ' : 'Stopped: '}
          </Text>
        )}
        {formData?.pathToSite &&
          (serverRunning !== true ? (
            <Button recipe={buttonRecipe} onClick={launchDevServer}>
              Launch Dev Server
            </Button>
          ) : (
            <Button recipe={buttonRecipe} disabled={!serverRunning} onClick={stopDevServer}>
              Stop Dev Server
            </Button>
          ))}
      </HStack>
    </Stack>
  )
}
export default ConfigForm
