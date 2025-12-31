import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {
  Box,
  Button,
  Field,
  Input,
  HStack,
  Center,
  Heading,
  Skeleton,
  Stack
} from '@chakra-ui/react'
import InfoBubble from '../components/info-bubble'
import PageLayout from '../components/PageLayout'
import { ApiMessageResponse, PageInfo } from 'src/shared/types'
import StyledInput from '@renderer/components/StyledInput'
import { buttonRecipe } from '@renderer/themeRecipes'

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

function PageForm({
  pageId,
  pageData,
  onSubmit,
  onCancel
}: {
  pageId: string
  pageData: PageInfo
  onSubmit: (pageId: string, values: PageInfo) => void
  onCancel: () => void
}): React.JSX.Element {
  const [wysiwygText, setWysiwygText] = useState(pageData.page_content)
  const {
    control,
    register,
    formState: { errors },
    setValue,
    getValues
  } = useForm({ defaultValues: pageData, mode: 'onChange' })
  const id = useWatch({ control, name: 'page_id' })
  const handleTextChange = (formfield) => (newText) => {
    setValue(formfield, newText)
    setWysiwygText(newText)
  }

  return (
    <Box p={5}>
      <HStack justifyContent="space-between">
        <Heading size="md">Edit Page {id}</Heading>
      </HStack>
      {pageId === 'ChangeMe' && (
        <Field.Root p={4} invalid={errors.page_id ? true : false}>
          <HStack alignItems="center">
            <Field.Label w={48}>
              Page ID:{' '}
              <InfoBubble
                message={`This is the page id, it must be unique and cannot be changed.`}
              />
            </Field.Label>
            <Input
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('page_id', { required: true, validate: (value) => value !== '' })}
            />
          </HStack>
        </Field.Root>
      )}
      <Field.Root p={4} invalid={errors.page_title ? true : false}>
        <HStack alignItems="center">
          <Field.Label w={48}>
            Page Title:{' '}
            <InfoBubble message={`This is the SEO page title for the ${pageId} page.`} />
          </Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('page_title', { required: true, validate: (value) => value !== '' })}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4} invalid={errors.page_description ? true : false}>
        <HStack alignItems="center">
          <Field.Label w={48}>
            {pageId} SEO Page Description:{' '}
            <InfoBubble message="Short description that will show in Google searches. " />
          </Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('page_description', {
              required: true,
              validate: (value) => value !== '' && value.length <= 500
            })}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4}>
        <HStack alignItems="top">
          <Field.Label w={48}>Page Content:</Field.Label>
          <Box
            width={'100%'}
            flexGrow={3}
            minH={2}
            borderWidth={1}
            borderStyle="solid"
            borderRadius={5}
            className="content"
          >
            <Box
              width={'100%'}
              minH={2}
              border="1px solid gray"
              borderRadius={5}
              className="content"
            >
              <StyledInput
                value={wysiwygText}
                onChange={handleTextChange('page_content')}
                placeholder="Add Content Here..."
              />
            </Box>
          </Box>
        </HStack>
      </Field.Root>
      <Center>
        <HStack gap={4}>
          <Button onClick={onCancel}>Never mind</Button>
          <Button recipe={buttonRecipe} onClick={() => onSubmit(id, getValues() as PageInfo)}>
            Submit Changes
          </Button>
        </HStack>
      </Center>
    </Box>
  )
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
    setActivePage({ page_id: 'ChangeMe', page_title: '', page_description: '', page_content: '' })
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
      button={{ action: addPage, text: 'Add New Page', value: '' }}
    >
      {loading && (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      )}
      {pagesData && (
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
              <Button key={page} onClick={() => onPageClick(page)}>
                {page}
              </Button>
            ))}
          </HStack>
        </Stack>
      )}
      {activePage && (
        <PageForm
          pageId={activePage?.page_id || ''}
          pageData={activePage as PageInfo}
          onSubmit={onSubmit}
          onCancel={() => setActivePage(null)}
        />
      )}
    </PageLayout>
  )
}
