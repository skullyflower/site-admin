import { useForm, useWatch } from 'react-hook-form'
import { convertDate } from '../components/datetimebit'
import UploadInput from '../components/upload-input'
import InfoBubble from '../components/info-bubble'
import { Box, Button, Field, Input, HStack, Center, Heading, Stack, Image } from '@chakra-ui/react'
//import FloatingFormWrapper from '../components/floatingformwrap'
import StyledInput from '@renderer/components/StyledInput'
import { buttonRecipe } from '@renderer/themeRecipes'
import { BlogEntry, SiteInfo } from 'src/shared/types'
import imageLoading from '@renderer/assets/image-loading.svg'
import TagSelector from '@renderer/components/TagSelector'
import { useMemo } from 'react'

const today = new Date()

const newblog = {
  id: convertDate(today, 'id'),
  date: convertDate(today, 'input'),
  title: '',
  imagelink: '',
  image: '',
  imagealt: '',
  imgcaption: '',
  heading: '',
  text: '',
  tags: []
} as BlogEntry

const EditBlogEntry = ({
  blogid,
  blogEntries,
  //isOpen,
  toggleForm,
  onSubmit,
  sitedata
}: {
  blogid: string
  blogEntries: BlogEntry[]
  //isOpen: boolean
  toggleForm: () => void
  onSubmit: (data: BlogEntry) => void
  sitedata: SiteInfo
}): React.JSX.Element => {
  const thisEntry = (blogEntries && blogEntries.find((blog) => blog.id === blogid)) || newblog

  const thisEntryDate = useMemo<Date>(() => {
    return thisEntry?.date ? new Date(thisEntry.date) : new Date()
  }, [thisEntry])

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue
  } = useForm({
    defaultValues: { ...thisEntry, date: convertDate(thisEntryDate, 'input') },
    mode: 'onChange'
  })

  const handleImageFocus = (input) => () => {
    if (!getValues(input)) setValue(input, `${sitedata?.live_site_url}/images/...`)
  }

  const handleImageUpload = (paths: string[]): void => {
    if (paths.length > 0) {
      const blogImage = `${sitedata?.live_site_url}/images/blog/${paths[0].split('/').pop()}`
      setValue('image', blogImage)
    }
  }

  const handleTextChange = (newText: string): void => {
    setValue('text', newText)
  }

  const thumb = useWatch({ control: control, name: 'image' }) || ''

  return (
    <Stack justifyContent="space-between">
      <HStack justifyContent="space-between">
        <Heading textAlign="center" size="md">
          Add/Edit Blog Entries
        </Heading>
        <Button recipe={buttonRecipe} onClick={() => toggleForm()}>
          Never mind
        </Button>
      </HStack>
      <Field.Root p={4} invalid={errors.id ? true : false}>
        <HStack>
          <Field.Label w={40}>
            Id: <InfoBubble message={`Blog ids are based on the date"`} />
          </Field.Label>
          <Input _invalid={{ borderColor: 'red.300' }} type="text" {...register('id')} />
        </HStack>
      </Field.Root>
      <Field.Root p={4} invalid={errors.date ? true : false}>
        <HStack alignItems="center">
          <Field.Label w={40}>Date:</Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="datetime-local"
            {...register('date', { required: true })}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4} invalid={errors.title ? true : false}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Entry Title:</Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('title', { required: true })}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4}>
        <Field.Label>Blog Image:</Field.Label>
        <Box
          width={'100%'}
          flexGrow={3}
          borderWidth={1}
          borderStyle="solid"
          borderRadius={4}
          borderColor="gray.300"
          p={5}
        >
          <Field.Root>
            <HStack alignItems="top">
              <Field.Label w={40}>
                Upload New Image{' '}
                <InfoBubble
                  message={`Select an image to upload. It will be resized and saved automatically.`}
                />
              </Field.Label>
              <UploadInput multiple={false} onUpload={handleImageUpload} />
            </HStack>
          </Field.Root>
          <Field.Root p={4} invalid={errors.image ? true : false}>
            <HStack alignItems="center">
              <Field.Label w={40}>
                Or edit image url:{' '}
                <InfoBubble message=" (This value will be overwritten if you select a new image to upload.)" />
              </Field.Label>
              <Input
                _invalid={{ borderColor: 'red.300' }}
                placeholder={`${sitedata?.live_site_url}/images/blog/...`}
                onFocus={handleImageFocus('image')}
                type="text"
                {...register('image')}
              />
              <Image
                src={thumb.replace(sitedata?.live_site_url || '', 'http://localhost:3000')}
                boxSize="100px"
                onError={(e) => {
                  e.currentTarget.src = imageLoading
                }}
              />
            </HStack>
          </Field.Root>
        </Box>
      </Field.Root>
      <Field.Root p={4} invalid={errors.imagealt ? true : false}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Alt Text:</Field.Label>
          <Input _invalid={{ borderColor: 'red.300' }} type="text" {...register('imagealt')} />
        </HStack>
      </Field.Root>
      <Field.Root p={4}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Content Link:</Field.Label>
          <Input
            className={errors.imagelink ? 'is-invalid' : ''}
            type="url"
            onFocus={handleImageFocus('imagelink')}
            {...register('imagelink')}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Image Caption:</Field.Label>
          <Input
            className={errors.imgcaption ? 'is-invalid' : ''}
            type="text"
            {...register('imgcaption')}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4} invalid={errors.heading ? true : false}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Heading:</Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('heading', { required: true })}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4}>
        <HStack alignItems="top" width="100%">
          <Field.Label w={40}>Blog Content:</Field.Label>
          <Box width="100%" minH={2} border="1px solid gray" borderRadius={5} className="content">
            <StyledInput
              value={getValues('text')}
              onChange={handleTextChange}
              placeholder="Add Content Here..."
            />
          </Box>
        </HStack>
      </Field.Root>
      <div>
        <TagSelector
          value={thisEntry?.tags || []}
          onChange={(values: string[]) => setValue('tags', values)}
          allowCustomValue
        />
      </div>
      <Center>
        <Button
          recipe={buttonRecipe}
          paddingBlock={2}
          onClick={handleSubmit(async (data) => {
            onSubmit(data)
          })}
        >
          Submit Changes
        </Button>
      </Center>
    </Stack>
  )
}
export default EditBlogEntry
