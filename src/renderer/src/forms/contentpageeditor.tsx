import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { PageInfo } from 'src/shared/types'
import { Box, Button, Field, HStack, Heading, Input, Center, Stack } from '@chakra-ui/react'
import InfoBubble from '../components/info-bubble'
import StyledInput from '@renderer/components/inputs/StyledInput'
import { buttonRecipe } from '@renderer/themeRecipes/button.recipe'

export default function PageForm({
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
  const handleUploadImage = async (image: string): Promise<string> => {
    const imageName = image.split('/').pop() || image
    const response = await window.api.uploadImage(imageName, `${id}`)
    if (response.relativeUrl) {
      return response.relativeUrl
    }
    return image
  }
  return (
    <Stack gap={1}>
      <HStack justifyContent="space-between">
        <Heading size="md">Edit Page {id}</Heading>
      </HStack>
      {pageId === 'change-me' && (
        <Field.Root p={1} invalid={errors.page_id ? true : false}>
          <HStack alignItems="center" width={'100%'}>
            <Field.Label w={40}>
              Page ID:{' '}
              <InfoBubble
                message={`This is the page id, it must be unique and cannot be changed.`}
              />
            </Field.Label>
            <Input
              _invalid={{ borderColor: 'red.300', borderWidth: '2px', borderStyle: 'solid' }}
              type="text"
              {...register('page_id', {
                required: true,
                validate: (value) => value !== '' && value !== 'change-me'
              })}
            />
          </HStack>
        </Field.Root>
      )}
      <Field.Root p={1} invalid={errors.page_title ? true : false}>
        <HStack alignItems="center" width={'100%'}>
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
      <Field.Root p={1} invalid={errors.page_description ? true : false}>
        <HStack alignItems="center" width={'100%'}>
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
      <Field.Root p={1}>
        <Stack alignItems="top" width={'100%'}>
          <Field.Label>Page Content:</Field.Label>
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
                onUploadImage={handleUploadImage}
                placeholder="Add Content Here..."
              />
            </Box>
          </Box>
        </Stack>
      </Field.Root>
      <Center>
        <HStack gap={4}>
          <Button onClick={onCancel}>Done</Button>
          <Button recipe={buttonRecipe} onClick={() => onSubmit(id, getValues() as PageInfo)}>
            Submit Changes
          </Button>
        </HStack>
      </Center>
    </Stack>
  )
}
