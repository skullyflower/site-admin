import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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

const getPageData = (
  pageId: string,
  setLoading: (loading: boolean) => void,
  setMessages: (messages: string) => void,
  setPageData: (pageData: PageInfo) => void
): void => {
  setLoading(true)
  window.api
    .getPage(pageId)
    .then((response: ApiMessageResponse | PageInfo) => {
      if ((response as ApiMessageResponse).message) {
        setMessages((response as ApiMessageResponse).message)
      } else {
        setPageData(response as PageInfo)
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
  onSubmit
}: {
  pageId: string
  pageData: PageInfo
  onSubmit: (values: PageInfo) => void
}): React.JSX.Element {
  const [wysiwygText, setWysiwygText] = useState(pageData.page_content)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({ defaultValues: pageData, mode: 'onChange' })

  const handleTextChange = (formfield) => (newText) => {
    setValue(formfield, newText)
    setWysiwygText(newText)
  }

  return (
    <Box p={5}>
      <HStack justifyContent="space-between">
        <Heading size="md">Edit Page {pageId}</Heading>
      </HStack>
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
          <Button
            onClick={() => {
              setWysiwygText(pageData.page_content)
              reset()
            }}
          >
            Never mind
          </Button>
          <Button recipe={buttonRecipe} onClick={handleSubmit(onSubmit)}>
            Submit Changes
          </Button>
        </HStack>
      </Center>
    </Box>
  )
}

export default function PageContent(): React.JSX.Element {
  const pageId = 'about'
  const [messages, setMessages] = useState<string | null>(null)
  const [pageData, setPageData] = useState<PageInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!pageData && !messages) {
      getPageData(pageId, setLoading, setMessages, setPageData)
    }
  }, [pageData, messages])

  const onSubmit = (values: PageInfo): void => {
    setMessages(null)
    setLoading(true)
    window.api
      .updatePage(pageId, values)
      .then((response: ApiMessageResponse) => {
        setMessages(response.message as string)
        getPageData(pageId, setLoading, setMessages, setPageData)
      })
      .catch((err: Error) => {
        setMessages(err.message || 'There was a problem.')
      })
  }

  return (
    <PageLayout
      title={`Manage ${pageId} page`}
      messages={messages}
      button={{ action: onSubmit, text: 'Update', value: '' }}
    >
      {loading ? (
        <Stack>
          <Skeleton height="50px" />
          <Skeleton height="50px" />
        </Stack>
      ) : (
        <PageForm pageId={pageId} pageData={pageData as PageInfo} onSubmit={onSubmit} />
      )}
    </PageLayout>
  )
}
