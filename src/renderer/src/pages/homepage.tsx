import { useEffect, useState } from 'react'
import { Skeleton, Stack } from '@chakra-ui/react'
import PageLayout from '../components/PageLayout'
import HomePageForm from '../forms/homepageForm'
import HomePagePreview from '../forms/homepagePreview'
import { SiteInfo, ApiMessageResponse } from 'src/shared/types'
import FormContainer from '@renderer/components/formcontainer'

const getSiteData = async (
  setLoading: (loading: boolean) => void,
  setMessages: (messages: string) => void,
  setPageData: (pageData: SiteInfo) => void
): Promise<void> => {
  setLoading(true)
  const pathToSite = await window.api.getAdminConfig()
  if (pathToSite && 'pathToSite' in pathToSite) {
    const response = await window.api.getSiteInfo()
    if ((response as ApiMessageResponse).message) {
      setMessages((response as ApiMessageResponse).message as string)
      setLoading(false)
      return
    }
    if ((response as SiteInfo).page_title) {
      setPageData(response as SiteInfo)
    } else {
      setMessages('No site data found.')
      setLoading(false)
      return
    }
  }
  setLoading(false)
}

const emptySiteInfo: SiteInfo = {
  page_id: 'site',
  page_title: '',
  page_description: '',
  page_content: '',
  company_name: '',
  site_theme: '',
  live_site_url: '',
  sitelogo: ''
}
export default function HomePage(): React.JSX.Element {
  const [messages, setMessages] = useState<string | null>(null)
  const [pageData, setPageData] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    getSiteData(setLoading, setMessages, setPageData)
  }, [])

  const onSubmit = async (values: SiteInfo & { newsitelogo: File[] }): Promise<void> => {
    setMessages(null)
    setLoading(true)
    const imagesArr = Array.from(values.newsitelogo)
    const formData = new FormData()
    formData.append('values', JSON.stringify(values))

    for (const file of imagesArr) {
      formData.append('newsitelogo', file as Blob | string)
    }
    const response = await window.api.updateSiteInfo(values as SiteInfo)
    setMessages((response as ApiMessageResponse).message)
    setLoading(false)
    getSiteData(setLoading, setMessages, setPageData)
  }
  const toggleForm = (): void => {
    setShowForm(!showForm)
  }

  return (
    <PageLayout
      title="Manage Site Data and Homepage"
      messages={messages}
      button={{ text: showForm ? 'Show Preview' : 'Show Form', action: toggleForm, value: '' }}
    >
      {loading ? (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      ) : showForm || !pageData ? (
        <FormContainer>
          <HomePageForm
            pageData={pageData || (emptySiteInfo as SiteInfo)}
            onSubmit={(values: SiteInfo) => onSubmit(values as SiteInfo & { newsitelogo: File[] })}
          />
        </FormContainer>
      ) : (
        <HomePagePreview pageData={pageData as SiteInfo} />
      )}
    </PageLayout>
  )
}
