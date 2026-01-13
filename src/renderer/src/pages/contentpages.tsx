import { useEffect, useState } from 'react'
import { Button, HStack, Heading, Skeleton, Stack } from '@chakra-ui/react'
import PageLayout from '../components/layout/PageLayout'
import { ApiMessageResponse, PageInfo } from 'src/shared/types'
import FormContainer from '@renderer/components/formcontainer'
import PageForm from '@renderer/forms/contentpageeditor'

const getPages = (
  setLoading: (loading: boolean) => void,
  setMessages: (messages: string) => void,
  setPagesData: (pagesData: string[]) => void
): void => {
  setLoading(true)
  window.api
    .getPages()
    .then((response: ApiMessageResponse | string[]) => {
      if ((response as ApiMessageResponse).message) {
        setMessages((response as ApiMessageResponse).message)
      } else {
        setPagesData(response as string[])
      }
      setLoading(false)
    })
    .catch((err) => {
      setMessages((err as ApiMessageResponse).message || "Couldn't get page data.")
    })
  setLoading(false)
}

export default function PageContent(): React.JSX.Element {
  const [messages, setMessages] = useState<string | null>(null)
  const [pagesData, setPagesData] = useState<string[] | null>(null)
  const [activePage, setActivePage] = useState<PageInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pagesData && !messages) {
      window.api
        .getPages()
        .then((response: ApiMessageResponse | string[]) => {
          if ((response as ApiMessageResponse).message) {
            setMessages((response as ApiMessageResponse).message)
          } else {
            setPagesData(response as string[])
          }
        })
        .catch((err) => {
          setMessages((err as ApiMessageResponse).message || "Couldn't get page data.")
        })
        .finally(() => setLoading(false))
    }
  }, [pagesData, messages, setLoading])

  const addPage = (): void => {
    setActivePage({ page_id: 'change-me', page_title: '', page_description: '', page_content: '' })
  }

  const onSubmit = (pageId: string, values: PageInfo): void => {
    setMessages(null)
    setLoading(true)
    window.api
      .updatePage(pageId, values)
      .then((response: ApiMessageResponse | PageInfo) => {
        if ((response as ApiMessageResponse).message) {
          setMessages((response as ApiMessageResponse).message)
        } else {
          setActivePage(null)
        }
        getPages(setLoading, setMessages, setPagesData)
      })
      .catch((err: Error) => {
        setMessages(err.message || 'There was a problem.')
      })
  }

  const onPageClick = (pageId: string): void => {
    window.api
      .getPage(pageId)
      .then((response: ApiMessageResponse | PageInfo) => {
        if ((response as ApiMessageResponse).message) {
          setMessages((response as ApiMessageResponse).message)
        } else {
          setActivePage(response as PageInfo)
        }
      })
      .catch((err: Error) => {
        setMessages(err.message || 'There was a problem.')
      })
  }

  return (
    <PageLayout
      title={`Manage pages`}
      messages={messages}
      setMessages={setMessages}
      button={{ action: addPage, text: 'Add New Page', value: '' }}
    >
      {loading && (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      )}
      {!activePage && pagesData && (
        <Stack gap={4}>
          <Heading size="sm">Select a page to edit</Heading>
          <HStack
            border="1px solid"
            borderRadius={5}
            p={4}
            width="100%"
            wrap="wrap"
            alignItems="flex-start"
            justifyContent="center"
          >
            {pagesData.map((page) => (
              <Button size="sm" key={page} onClick={() => onPageClick(page)}>
                {page}
              </Button>
            ))}
          </HStack>
        </Stack>
      )}
      {activePage && (
        <FormContainer>
          <PageForm
            pageId={activePage?.page_id || ''}
            pageData={activePage as PageInfo}
            onSubmit={onSubmit}
            onCancel={() => setActivePage(null)}
          />
        </FormContainer>
      )}
    </PageLayout>
  )
}
