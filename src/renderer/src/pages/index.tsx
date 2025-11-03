import { Text } from '@chakra-ui/react'
import { useState } from 'react'
import PageLayout from '../components/PageLayout'

const Welcome = (): React.JSX.Element => {
  const [sitename, setSitename] = useState('Spa-Shop')
  window.api.getSiteInfo().then((response: SiteInfo) => {
    if (response.sitename) {
      setSitename(response.sitename)
    }
  })

  return (
    <PageLayout title={`Welcome to the ${sitename} Admin`} messages={null}>
      <Text>Use this admin to update content.</Text>
    </PageLayout>
  )
}
export default Welcome
