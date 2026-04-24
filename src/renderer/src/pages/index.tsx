import { Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { SiteInfo } from 'src/shared/types'
import ConfigForm from '@renderer/forms/configeditor'
import FormContainer from '@renderer/components/formcontainer'

const WelcomePage = (): React.JSX.Element => {
  const [sitename, setSitename] = useState('Spa-Shop')
  const [messages, setMessages] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'error' | 'success'>('info')
  const [pathToSite, setPathToSite] = useState<string | null>(null)
  useEffect(() => {
    // Check if the config exists
    window.api.getAdminConfig().then((response) => {
      if (response.success && response.data?.pathToSite) {
        setPathToSite(response.data.pathToSite)
      } else {
        setMessageType('error')
        setMessages(response.message || '')
      }
    })
  }, [])
  useEffect(() => {
    if (pathToSite) {
      window.api.getSiteInfo().then((response) => {
        if (response.success && response.data && 'sitename' in response.data) {
          setSitename((response.data as SiteInfo & { sitename?: string }).sitename || 'Spa-Shop')
        } else {
          setSitename('Spa-Shop')
          if (!response.success) {
            setMessageType('error')
            setMessages(response.message || '')
          }
        }
      })
    }
  }, [pathToSite])

  if (pathToSite) {
    return (
      <PageLayout title={`Welcome to the Admin`} messages={messages} setMessages={setMessages} messageType={messageType}>
        <Text>
          <em>Currently editing:</em> {sitename} at {pathToSite}
        </Text>
        <Text>Use this admin to update content.</Text>
      </PageLayout>
    )
  } else {
    // If the config does not exist, show the config form
    return (
      <PageLayout
        title={`Welcome to the ${sitename} Admin`}
        messages={messages}
        setMessages={setMessages}
        messageType={messageType}
      >
        <FormContainer>
          <ConfigForm
            formData={null}
            setValue={() => {}}
            onSubmit={() => (pathToSite: string) =>
              window.api.setAdminConfig({ pathToSite: pathToSite })
            }
          />
        </FormContainer>
      </PageLayout>
    )
  }
}
export default WelcomePage
