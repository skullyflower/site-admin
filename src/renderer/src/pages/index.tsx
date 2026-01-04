import { Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { AdminConfig, ApiMessageResponse, SiteInfo } from 'src/shared/types'
import ConfigForm from '@renderer/forms/configeditor'
import FormContainer from '@renderer/components/formcontainer'

const WelcomePage = (): React.JSX.Element => {
  const [sitename, setSitename] = useState('Spa-Shop')
  const [messages, setMessages] = useState<string | null>(null)
  const [pathToSite, setPathToSite] = useState<string | null>(null)
  useEffect(() => {
    // Check if the config exists
    window.api.getAdminConfig().then((response: ApiMessageResponse | AdminConfig) => {
      if (typeof response === 'object' && 'pathToSite' in response) {
        setPathToSite(response.pathToSite as string)
      } else {
        setMessages((response as ApiMessageResponse).message as string)
      }
    })
  }, [])
  useEffect(() => {
    if (pathToSite) {
      window.api.getSiteInfo().then((response: ApiMessageResponse | SiteInfo) => {
        if (typeof response === 'object' && 'sitename' in response) {
          setSitename(response.sitename as string)
        } else {
          setSitename('Spa-Shop')
          setMessages((response as ApiMessageResponse).message as string)
        }
      })
    }
  }, [pathToSite])

  if (pathToSite) {
    return (
      <PageLayout title={`Welcome to the Admin`} messages={messages}>
        <Text>
          <em>Currently editing:</em> {sitename} at {pathToSite}
        </Text>
        <Text>Use this admin to update content.</Text>
      </PageLayout>
    )
  } else {
    // If the config does not exist, show the config form
    return (
      <PageLayout title={`Welcome to the ${sitename} Admin`} messages={messages}>
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
