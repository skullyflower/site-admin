import { useForm } from 'react-hook-form'
import { Box, Button, Field, Image, Input, HStack, Center, Textarea, Stack } from '@chakra-ui/react'
import InfoBubble from '../components/info-bubble'
import UploadInput from '../components/upload-input'
import { useState } from 'react'
import StyledInput from '@renderer/components/StyledInput'
import { buttonRecipe } from '@renderer/themeRecipes'
import { SiteInfo } from 'src/shared/types'
import imageLoading from '@renderer/assets/image-loading.svg'

const HomePageForm = ({
  pageData,
  onSubmit
}: {
  pageData: SiteInfo
  onSubmit: (data: SiteInfo) => void
}): React.JSX.Element => {
  const [page_content, setPage_content] = useState<string>(pageData?.page_content || '')
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({ defaultValues: pageData as SiteInfo, mode: 'onChange' })
  if (!pageData) {
    return <Box>No data found</Box>
  }
  return (
    <Box p={5}>
      <Field.Root p={4} invalid={errors.page_title ? true : false}>
        <HStack alignItems="center" gap={4}>
          <label>Home Page Title:</label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('page_title', { required: true, validate: (value) => value !== '' })}
          />
        </HStack>
      </Field.Root>
      <HStack>
        <Field.Root p={4} invalid={errors.company_name ? true : false}>
          <HStack alignItems="center">
            <Box w={48}>
              <label>
                Company Name:{' '}
                <InfoBubble message="This is the simple, short name of your site or shop. " />
              </label>
            </Box>
            <Input
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('company_name', { required: true, validate: (value) => value !== '' })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4} invalid={errors.live_site_url ? true : false}>
          <HStack alignItems="center">
            <Box w={48}>
              <label>
                Live Url:{' '}
                <InfoBubble message="You know, that domain name you baught. example: https://www.yoursitename.com " />
              </label>
            </Box>
            <Input
              _invalid={{ borderColor: 'red.300' }}
              type="url"
              {...register('live_site_url', {
                required: true,
                validate: (value) => value !== ''
              })}
            />
          </HStack>
        </Field.Root>
      </HStack>
      <Field.Root p={4} invalid={errors.page_description ? true : false}>
        <HStack alignItems="center">
          <Box w={48}>
            <label>
              Homepage SEO Page Description:{' '}
              <InfoBubble message="Short description that will show in Google searches. " />
            </label>
          </Box>
          <Textarea
            _invalid={{ borderColor: 'red.300' }}
            {...register('page_description', {
              required: true,
              validate: (value) => value !== '' && value.length <= 500
            })}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4}>
        <HStack alignItems="top">
          <label>Site Logo:</label>
          <Box flexGrow={3} borderWidth={1} borderStyle="solid" borderRadius={4} p={5}>
            <Field.Root>
              <HStack alignItems="top">
                <label>Upload New Image</label>
                <UploadInput name="newsitelogo" multiple={false} register={register} />
              </HStack>
            </Field.Root>
            <Field.Root p={4} invalid={errors.sitelogo ? true : false}>
              <HStack alignItems="center">
                <Box w={48}>
                  <label>
                    Or edit image url:{' '}
                    <InfoBubble message="You can edit the image url to be a different image you have uploaded in the past. You can also use an image from a different website. (This value will be overwritten if you select an image to upload.)" />
                  </label>
                </Box>
                <Input
                  _invalid={{ borderColor: 'red.300' }}
                  type="text"
                  {...register('sitelogo')}
                />
                <Image
                  src={`http://localhost:3000/${pageData.sitelogo}`}
                  boxSize="100px"
                  onError={(e) => {
                    e.currentTarget.src = imageLoading
                  }}
                />
              </HStack>
            </Field.Root>
          </Box>
        </HStack>
      </Field.Root>
      <Field.Root p={4}>
        <Stack gap={2} justifyContent={'stretch'} width={'100%'}>
          <label>Home Page Top Content:</label>
          <StyledInput
            value={page_content}
            onChange={(value) => setValue('page_content', value)}
            placeholder="Add Content Here..."
          />
        </Stack>
      </Field.Root>
      <Center>
        <HStack gap={4}>
          <Button
            recipe={buttonRecipe}
            onClick={() => {
              reset(pageData)
              setPage_content(pageData.page_content || '')
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
export default HomePageForm
