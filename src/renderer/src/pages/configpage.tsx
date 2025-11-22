import { useEffect, useState } from 'react'
import PageLayout from '../components/PageLayout'
import ConfigForm from '@renderer/forms/configeditor'
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
    if (!pathToSite) {
      setMessages('You must fill out all fields.')
      return
    }
    window.api
      .setAdminConfig({ pathToSite: pathToSite })
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
      button={{ action: () => onSubmit(config?.pathToSite || ''), text: 'Update', value: '' }}
    >
      <ConfigForm
        formData={config as AdminConfig}
        setValue={(value: string) => setConfig({ pathToSite: value } as AdminConfig)}
        onSubmit={() => onSubmit(config?.pathToSite || '')}
      />
    </PageLayout>
  )
}

export default ConfigPage
