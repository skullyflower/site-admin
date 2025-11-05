import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import { Button, Center, Field, HStack, Stack } from '@chakra-ui/react'
import InfoBubble from '../components/info-bubble'
import { buttonRecipe } from '@renderer/themeRecipes'
import { AdminConfig, ApiMessageResponse } from 'src/shared/types'

const getConfig = (
  setConfig: (config: AdminConfig | null) => void,
  setMessages: (message: string) => void
): void => {
  window.api
    .getAdminConfig()
    .then((data: ApiMessageResponse | AdminConfig) => {
      if (typeof data === 'object' && 'message' in data) {
        setMessages(data.message as string)
      } else {
        setConfig(data as AdminConfig)
      }
    })
    .catch((err: Error) => {
      setMessages(err.message || "Couldn't get config.")
    })
}

const ConfigPage = (): React.ReactNode => {
  const [config, setConfig] = useState<AdminConfig | null>(null)
  const [messages, setMessages] = useState<string | null>(null)

  useEffect(() => {
    if (config === null && messages === null) {
      getConfig(setConfig, setMessages)
    }
  }, [config, messages, setConfig, setMessages])

  const onSubmit = (pathToSite: string): void => {
    window.api
      .updateAdminConfig({ pathToSite: pathToSite })
      .then((data: ApiMessageResponse) => {
        setMessages(data.message as string)
        getConfig(setConfig, setMessages)
      })
      .catch((err: Error) => {
        setMessages(err.message || 'Failed to save config.')
      })
  }

  return (
    <PageLayout
      messages={messages}
      title="Set Config"
      button={{ action: onSubmit, text: 'Update', value: '' }}
    >
      <ConfigForm
        formData={config as AdminConfig}
        setValue={(value: string) => setConfig({ pathToSite: value } as AdminConfig)}
        onSubmit={() => onSubmit(config?.pathToSite || '')}
      />
    </PageLayout>
  )
}

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
export default ConfigPage
