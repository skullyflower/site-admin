import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import PageLayout from '../components/PageLayout'
import { Button, Center, Field, HStack, Stack } from '@chakra-ui/react'
import InfoBubble from '../components/info-bubble'
import { buttonRecipe } from '@renderer/themeRecipes'

interface Config {
  pathToSite: string
}
const getConfig = (
  setConfig: (config: Config | null) => void,
  setMessages: (message: string) => void
): void => {
  window.api
    .getAdminConfig()
    .then((data: ApiMessageResponse | Config) => {
      if (typeof data === 'object' && 'message' in data) {
        setMessages(data.message as string)
      } else {
        setConfig(data as Config)
      }
    })
    .catch((err: Error) => {
      setMessages(err.message || "Couldn't get config.")
    })
}

const ConfigPage = (): React.ReactNode => {
  const [config, setConfig] = useState<Config | null>(null)
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
        formData={config as Config}
        onSubmit={(values: Config) => onSubmit(values.pathToSite)}
      />
    </PageLayout>
  )
}

const ConfigForm = ({
  formData,
  onSubmit
}: {
  formData: Config | null
  onSubmit: (values: Config) => void
}): React.ReactNode => {
  const {
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({ defaultValues: formData as Config, mode: 'onChange' })

  return (
    <Stack gap={4}>
      <div>Current Config: {formData?.pathToSite || 'No config found'}</div>
      <Field.Root p={4} invalid={errors.pathToSite ? true : false}>
        <HStack alignItems="center">
          <Field.Label w={48}>
            Site Folder Path: <InfoBubble message="Relative path to the site you are editing" />
          </Field.Label>
          <Button
            onClick={() => {
              window.api
                .selectSiteDirectory()
                .then((data: string[] | undefined) => {
                  if (data && data.length > 0) {
                    setValue('pathToSite', data[0] || '')
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
          <Button recipe={buttonRecipe} onClick={handleSubmit(onSubmit)}>
            Submit Changes
          </Button>
        </HStack>
      </Center>
    </Stack>
  )
}
export default ConfigPage
