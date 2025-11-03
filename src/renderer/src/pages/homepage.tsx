import { useEffect, useState } from 'react'
import { Skeleton, Stack } from '@chakra-ui/react'
import PageLayout from '../components/PageLayout'
import HomePageForm from '../forms/homepageForm'
import HomePagePreview from '../forms/homepagePreview'

const getSiteData = async (
  setLoading: (loading: boolean) => void,
  setMessages: (messages: string) => void,
  setPageData: (pageData: SiteInfo) => void
): Promise<void> => {
  setLoading(true)
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
  setLoading(false)
}

export default function HomePage(): React.JSX.Element {
  const [messages, setMessages] = useState<string | null>(null)
  const [pageData, setPageData] = useState<SiteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!pageData && !messages) {
      getSiteData(setLoading, setMessages, setPageData)
    }
  }, [pageData, messages])

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
      ) : showForm ? (
        <HomePageForm pageData={pageData} onSubmit={onSubmit} />
      ) : (
        <HomePagePreview pageData={pageData as SiteInfo} />
      )}
    </PageLayout>
  )
}
