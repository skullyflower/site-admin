import { Button, Stack, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import PageLayout from '../components/layout/PageLayout'
import { SiteInfo } from '../../../../src/shared/types'
import ConfigForm from '@renderer/forms/configeditor'
import FormContainer from '@renderer/components/formcontainer'
import { buttonRecipe } from '@renderer/themeRecipes'
import useRunServer from '@renderer/hooks/useRunServer'

const WelcomePage = (): React.JSX.Element => {
  const [brand_name, setbrand_name] = useState('My Site')
  const [messages, setMessages] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'info' | 'warning' | 'error' | 'success'>('info')
  const [pathToSite, setPathToSite] = useState<string | null>(null)
  const { launchDevServer, stopDevServer, serverRunning } = useRunServer()

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
        if (response.success && response.data && 'brand_name' in response.data) {
          setbrand_name(
            (response.data as SiteInfo & { brand_name?: string }).brand_name || 'Spa-Shop'
          )
        } else {
          setbrand_name('My Site')
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
      <PageLayout
        title={`Welcome to your Site's Admin`}
        messages={messages}
        setMessages={setMessages}
        messageType={messageType}
      >
        <Stack>
          <Text>
            <em>Currently editing:</em> {brand_name} at {pathToSite}
          </Text>
          <Text>Start the local dev server so that you can see your changes and images.</Text>

          {serverRunning !== true ? (
            <Button recipe={buttonRecipe} onClick={launchDevServer}>
              Launch Dev Server
            </Button>
          ) : (
            <>
              <Text>
                <a href="http://localhost:3000/" target="localDev">
                  Open Local Dev Site
                </a>
              </Text>
              <Button recipe={buttonRecipe} disabled={!serverRunning} onClick={stopDevServer}>
                Stop Dev Server
              </Button>
            </>
          )}
        </Stack>
      </PageLayout>
    )
  } else {
    // If the config does not exist, show the config form
    return (
      <PageLayout
        title={`Welcome to the ${brand_name} Admin`}
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
