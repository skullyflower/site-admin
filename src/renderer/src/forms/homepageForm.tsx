import { useForm } from 'react-hook-form'
import { Box, Button, Field, Image, Input, HStack, Center, Textarea, Stack } from '@chakra-ui/react'
import InfoBubble from '../components/info-bubble'
import UploadInput from '../components/upload-input'
import { useState } from 'react'
import StyledInput from '@renderer/components/StyledInput'
import { buttonRecipe, inputRecipe } from '@renderer/themeRecipes'
import { SiteInfo } from 'src/shared/types'
import imageLoading from '@renderer/assets/image-loading.svg'

const HomePageForm = ({
  pageData,
  onSubmit
}: {
  pageData: SiteInfo
  onSubmit: (data: SiteInfo) => void
}): React.JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues
  } = useForm({ defaultValues: pageData as SiteInfo, mode: 'onChange' })
  const [page_content, setPage_content] = useState<string>(getValues('page_content') || '')

  const handleImageUpload = (paths: string[]): void => {
    if (paths.length > 0) {
      const newSitelogo = `${pageData?.live_site_url}/images/${paths[0].split('/').pop()}`
      setValue('sitelogo', newSitelogo)
    }
  }

  if (!pageData) {
    return <Box>No data found</Box>
  }
  return (
    <Box p={5}>
      <Stack gap={4} width="100%" alignItems="stretch">
        <Field.Root p={4} invalid={errors.page_title ? true : false}>
          <HStack alignItems="center" gap={4} width="100%">
            <label>Home Page Title:</label>
            <Input
              recipe={inputRecipe}
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('page_title', { required: true, validate: (value) => value !== '' })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4} invalid={errors.company_name ? true : false}>
          <HStack alignItems="center" width="100%">
            <Box w={48}>
              <label>
                Company Name:{' '}
                <InfoBubble message="This is the simple, short name of your site or shop. " />
              </label>
            </Box>
            <Input
              recipe={inputRecipe}
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('company_name', { required: true, validate: (value) => value !== '' })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4} invalid={errors.live_site_url ? true : false}>
          <HStack alignItems="center" width="100%">
            <Box w={48}>
              <label>
                Live Url:{' '}
                <InfoBubble message="You know, that domain name you baught. example: https://www.yoursitename.com " />
              </label>
            </Box>
            <Input
              recipe={inputRecipe}
              _invalid={{ borderColor: 'red.300' }}
              type="url"
              {...register('live_site_url', {
                required: true,
                validate: (value) => value !== ''
              })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4} invalid={errors.page_description ? true : false}>
          <HStack alignItems="center" width="100%">
            <Box w={48}>
              <label>
                Homepage SEO Page Description:{' '}
                <InfoBubble message="Short description that will show in Google searches. " />
              </label>
            </Box>
            <Textarea
              width="100%"
              recipe={inputRecipe}
              _invalid={{ borderColor: 'red.300' }}
              {...register('page_description', {
                required: true,
                validate: (value) => value !== '' && value.length <= 500
              })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4}>
          <Stack gap={2} alignItems="stretch" width="100%">
            <label>Site Logo:</label>
            <Box
              flexGrow={3}
              borderWidth={1}
              borderStyle="solid"
              borderRadius={4}
              p={5}
              padding={4}
              border="1px solid"
            >
              <Field.Root>
                <HStack alignItems="top" width="100%">
                  <label>Upload New Image</label>
                  <UploadInput multiple={false} onUpload={handleImageUpload} />
                </HStack>
              </Field.Root>
              <Field.Root p={4} invalid={errors.sitelogo ? true : false}>
                <HStack alignItems="center" width="100%">
                  <Box w={48}>
                    <label>
                      Or edit image url:{' '}
                      <InfoBubble message="You can edit the image url to be a different image you have uploaded in the past. You can also use an image from a different website. (This value will be overwritten if you select an image to upload.)" />
                    </label>
                  </Box>
                  <Input
                    recipe={inputRecipe}
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
          </Stack>
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
                setPage_content(pageData.page_content || '')
                reset() //reset the form to the default values
              }}
            >
              Reset Changes
            </Button>
            <Button recipe={buttonRecipe} onClick={handleSubmit(onSubmit)}>
              Submit Changes
            </Button>
          </HStack>
        </Center>
      </Stack>
    </Box>
  )
}
export default HomePageForm
