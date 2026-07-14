import { useForm, useWatch } from 'react-hook-form'
import {
  Box,
  Button,
  Checkbox,
  Field,
  Fieldset,
  Image,
  Input,
  HStack,
  Center,
  Textarea,
  Stack,
  For,
  Heading
} from '@chakra-ui/react'
import InfoBubble from '@renderer/components/info-bubble'
import UploadInput from '@renderer/components/inputs/upload-input'
import StyledInput from '@renderer/components/inputs/StyledInput'
import { buttonRecipe, inputRecipe } from '@renderer/themeRecipes'
import { ExternalLink, Feature, SiteInfo } from '@renderer/../../../src/shared/types'
import imageLoading from '@renderer/assets/image-loading.svg'
import LinkForm from './linkForm'

const options = ['blog', 'content', 'galleries', 'products', 'categories', 'subjects', 'sale']

const createNewLink = (): ExternalLink => ({
  id: crypto.randomUUID(),
  icon: '',
  text: '',
  url: 'https://',
  isMine: false
})

const HomePageForm = ({
  pageData,
  onSubmit
}: {
  pageData: SiteInfo
  onSubmit: (data: SiteInfo) => void
}): React.JSX.Element => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({ defaultValues: pageData as SiteInfo, mode: 'onChange' })

  const page_content = useWatch({ control, name: 'page_content' })
  const features = useWatch({ control, name: 'features' })
  const extrnLinks = useWatch({ control, name: 'links' }) || []

  const updateLink = (linkupdate: ExternalLink): void => {
    const indexToUpdate = extrnLinks.findIndex((lnk) => lnk.id === linkupdate.id)
    if (indexToUpdate !== -1) {
      setValue('links', extrnLinks.toSpliced(indexToUpdate, 1, linkupdate))
    }
  }

  const deleteLink = (id: string): void => {
    setValue(
      'links',
      extrnLinks.filter((lnk) => lnk.id !== id)
    )
  }

  const addLink = (): void => {
    setValue('links', [...extrnLinks, createNewLink()])
  }

  const handleLogoUpload = async (paths: string[]): Promise<string[]> => {
    if (paths.length > 0) {
      const newSitelogo = `${pageData?.live_site_url}/images/${paths[0].split('/').pop()}`
      setValue('sitelogo', newSitelogo)
      return [newSitelogo]
    }
    return []
  }

  if (!pageData) {
    return <Box>No data found</Box>
  }
  return (
    <Box p={5}>
      <Stack gap={1} width="100%" alignItems="stretch">
        <Field.Root p={1} invalid={errors.page_title ? true : false}>
          <HStack alignItems="center" gap={4} width="100%">
            <Field.Label w={40}>Home Page Title:</Field.Label>
            <Input
              recipe={inputRecipe}
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('page_title', { required: true, validate: (value) => value !== '' })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={1} invalid={errors.page_description ? true : false}>
          <HStack alignItems="center" width="100%">
            <Box w={48}>
              <Field.Label w={40}>
                Homepage SEO Page Description:{' '}
                <InfoBubble message="Short description that will show in Google searches. " />
              </Field.Label>
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
        <Field.Root p={1}>
          <Stack gap={2} justifyContent={'stretch'} width={'100%'}>
            <Field.Label w={40}>Home Page Content:</Field.Label>
            <StyledInput
              value={page_content}
              onChange={(value) => setValue('page_content', value)}
              placeholder="Add Content Here..."
            />
          </Stack>
        </Field.Root>
        <Field.Root p={1}>
          <Stack gap={2} alignItems="stretch" width="100%">
            <Field.Label w={40}>Site Logo:</Field.Label>
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
                  <Field.Label w={40}>Upload New Image</Field.Label>
                  <UploadInput multiple={false} onUpload={handleLogoUpload} />
                </HStack>
              </Field.Root>
              <Field.Root p={1} invalid={errors.sitelogo ? true : false}>
                <HStack alignItems="center" width="100%">
                  <Box w={48}>
                    <Field.Label w={40}>
                      Or edit image url:{' '}
                      <InfoBubble message="You can edit the image url to be a different image you have uploaded in the past. You can also use an image from a different website. (This value will be overwritten if you select an image to upload.)" />
                    </Field.Label>
                  </Box>
                  <Input
                    recipe={inputRecipe}
                    _invalid={{ borderColor: 'red.300' }}
                    type="text"
                    {...register('sitelogo')}
                  />
                  <Image
                    src={`http://localhost:3000${pageData.sitelogo}`}
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
        <Heading>Site Settings</Heading>
        <Field.Root p={1} invalid={errors.brand_name ? true : false}>
          <HStack alignItems="center" width="100%">
            <Box w={48}>
              <Field.Label w={40}>
                Brand or Company:{' '}
                <InfoBubble message="This is the simple, short name of your site or shop. " />
              </Field.Label>
            </Box>
            <Input
              recipe={inputRecipe}
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('brand_name', { required: true, validate: (value) => value !== '' })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={1} invalid={errors.live_site_url ? true : false}>
          <HStack alignItems="center" width="100%">
            <Box w={48}>
              <Field.Label w={40}>
                Live Url:{' '}
                <InfoBubble message="You know, that domain name you baught. example: https://www.your-brand-name.com " />
              </Field.Label>
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
        <Fieldset.Root p={4}>
          <Stack>
            <HStack justify={'space-between'}>
              <Fieldset.Legend>Manage External Links:</Fieldset.Legend>
              <Button onClick={addLink} size="sm">
                Add One
              </Button>
            </HStack>
            <Fieldset.Content>
              {extrnLinks &&
                extrnLinks.map((link) => (
                  <LinkForm
                    key={link.id}
                    link={link}
                    updateLink={updateLink}
                    deleteLink={deleteLink}
                  />
                ))}
            </Fieldset.Content>
          </Stack>
        </Fieldset.Root>
        <Fieldset.Root p={4}>
          <Fieldset.Legend>Select Features to Enable:</Fieldset.Legend>
          <Fieldset.Content>
            <Checkbox.Group
              value={features}
              onValueChange={(value: string[]) => setValue('features', value as Feature[])}
            >
              <HStack maxW="1000px" alignItems="stretch" wrap="wrap">
                <For each={options}>
                  {(value) => (
                    <Checkbox.Root key={value} value={value}>
                      <Checkbox.HiddenInput />
                      <Checkbox.Control />
                      <Checkbox.Label>{value}</Checkbox.Label>
                    </Checkbox.Root>
                  )}
                </For>
              </HStack>
            </Checkbox.Group>
          </Fieldset.Content>
        </Fieldset.Root>

        <Center>
          <HStack gap={4}>
            <Button
              recipe={buttonRecipe}
              onClick={() => {
                reset(pageData) //reset the form to the default values
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
