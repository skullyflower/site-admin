import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import ConfigForm from '@renderer/forms/configeditor'
import { AdminConfig, ApiMessageResponse } from 'src/shared/types'
import FormContainer from '@renderer/components/formcontainer'
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
        setConfig(data as unknown as AdminConfig)
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

  const onSubmit = (): void => {
    if (!config?.pathToSite) {
      setMessages('You must fill out all fields.')
      return
    }
    window.api
      .setAdminConfig(config as AdminConfig)
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
      <FormContainer>
        <ConfigForm
          formData={config as AdminConfig}
          setValue={(value: AdminConfig) => setConfig(value)}
          onSubmit={onSubmit}
        />
      </FormContainer>
    </PageLayout>
  )
}

export default ConfigPage
