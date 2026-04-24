import { useEffect, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import ConfigForm from '@renderer/forms/configeditor'
import { AdminConfig } from 'src/shared/types'
import FormContainer from '@renderer/components/formcontainer'
import { useAdminConfig } from '@renderer/context/AdminConfigContext'
const getConfig = (
  setConfig: (config: AdminConfig | null) => void,
  setMessages: (message: string) => void,
  setMessageType: (type: 'info' | 'warning' | 'error' | 'success') => void
): void => {
  window.api
    .getAdminConfig()
    .then((data) => {
      if (!data.success) {
        setMessageType('error')
        setMessages(data.message || '')
      } else {
        setConfig(data.data || null)
      }
    })
    .catch((err: Error) => {
      setMessageType('error')
      setMessages(err.message || "Couldn't get config.")
    })
}

const ConfigPage = (): React.ReactNode => {
  const [config, setConfig] = useState<AdminConfig | null>(null)
  const [messages, setMessages] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'error' | 'success'>('info')
  const { refreshAdminConfig } = useAdminConfig()

  useEffect(() => {
    if (config === null && messages === null) {
      getConfig(setConfig, setMessages, setMessageType)
    }
  }, [config, messages, setConfig, setMessages])

  const onSubmit = (): void => {
    if (!config?.pathToSite) {
      setMessageType('error')
      setMessages('You must fill out all fields.')
      return
    }
    window.api
      .setAdminConfig(config as AdminConfig)
      .then((data) => {
        setMessageType(data.success ? 'success' : 'error')
        setMessages(data.message || '')
        refreshAdminConfig()
        getConfig(setConfig, setMessages, setMessageType)
      })
      .catch((err: Error) => {
        setMessageType('error')
        setMessages(err.message || 'Failed to save config.')
      })
  }

  return (
    <PageLayout
      messages={messages}
      setMessages={setMessages}
      messageType={messageType}
      title="Set Config"
      button={{ action: onSubmit, text: 'Update', value: '' }}
    >
      <FormContainer>
        <ConfigForm
          formData={config as AdminConfig}
          setValue={(value: AdminConfig | null) => setConfig(value as AdminConfig)}
          onSubmit={onSubmit}
        />
      </FormContainer>
    </PageLayout>
  )
}

export default ConfigPage
