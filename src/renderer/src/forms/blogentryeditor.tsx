import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { convertDate } from '../components/datetimebit'
import UploadInput from '../components/upload-input'
import InfoBubble from '../components/info-bubble'
import { Box, Button, Field, Image, Input, HStack, Center, Heading, Stack } from '@chakra-ui/react'
import FloatingFormWrapper from '../components/floatingformwrap'
import StyledInput from '@renderer/components/StyledInput'
import { buttonRecipe } from '@renderer/themeRecipes'
import { BlogEntry } from 'src/shared/types'

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
  newImage: []
}

const EditBlogEntry = ({
  blogid,
  blogEntries,
  isOpen,
  toggleForm,
  onSubmit
}: {
  blogid: string
  blogEntries: BlogEntry[]
  isOpen: boolean
  toggleForm: () => void
  onSubmit: (data: BlogEntry) => void
}): React.JSX.Element => {
  const thisEntry = blogEntries.find((blog) => blog.id === blogid) || newblog
  const [wysiwygText, setWysiwygText] = useState(thisEntry.text)

  if (blogid !== 'newentry' && thisEntry) {
    const ms = Date.parse(thisEntry.date)
    const entrydate = new Date(ms)
    thisEntry.date = convertDate(entrydate, 'input')
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    watch
  } = useForm({ defaultValues: thisEntry, mode: 'onChange' })

  const handleImageFocus = (input) => () => {
    if (!getValues(input)) setValue(input, 'https://www.skullyflower.com/...')
  }

  const handleTextChange = () => (newText) => {
    setValue('text', newText)
    setWysiwygText(newText)
  }

  const thumb = watch('image')
  return (
    <FloatingFormWrapper isOpen={isOpen} onClose={toggleForm}>
      <Stack justifyContent="space-between">
        <HStack w="100%" justifyContent="space-between">
          <Heading textAlign="center" size="md">
            Add/Edit Blog Entries
          </Heading>
          <Button onClick={toggleForm}>Never mind</Button>
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
          <HStack alignItems="center">
            <Field.Label w={40}>Entry Title:</Field.Label>
            <Input
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('title', { required: true })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4}>
          <HStack alignItems="top">
            <Field.Label w={40}>Blog Image:</Field.Label>
            <Box
              width={'100%'}
              flexGrow={3}
              borderWidth={1}
              borderStyle="solid"
              borderRadius={4}
              p={5}
            >
              <Field.Root>
                <HStack alignItems="top">
                  <Field.Label w={40}>
                    Upload New Image{' '}
                    <InfoBubble
                      message={`This Image will need to be uploaded to the server. All blog entries require absolute urls.`}
                    />
                  </Field.Label>
                  <UploadInput name="newImage" multiple={false} register={register} />
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
                    placeholder="https://www.skullyflower.com/images/..."
                    onFocus={handleImageFocus('image')}
                    type="text"
                    {...register('image')}
                  />
                  <Image
                    src={`${thumb}`}
                    boxSize="100px"
                    onError={(e) => {
                      e.currentTarget.src = 'http://localhost:3000/images/image-loading.svg'
                    }}
                  />
                </HStack>
              </Field.Root>
            </Box>
          </HStack>
        </Field.Root>
        <Field.Root p={4} invalid={errors.imagealt ? true : false}>
          <HStack alignItems="center">
            <Field.Label w={40}>Alt Text:</Field.Label>
            <Input _invalid={{ borderColor: 'red.300' }} type="text" {...register('imagealt')} />
          </HStack>
        </Field.Root>
        <Field.Root p={4}>
          <HStack alignItems="center">
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
          <HStack alignItems="center">
            <Field.Label w={40}>Image Caption:</Field.Label>
            <Input
              className={errors.imgcaption ? 'is-invalid' : ''}
              type="text"
              {...register('imgcaption')}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4} invalid={errors.heading ? true : false}>
          <HStack alignItems="center">
            <Field.Label w={40}>Heading:</Field.Label>
            <Input
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('heading', { required: true })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4}>
          <HStack alignItems="top">
            <Field.Label w={40}>Blog Content:</Field.Label>
            <Box width="100%" minH={2} border="1px solid gray" borderRadius={5} className="content">
              <StyledInput
                value={wysiwygText}
                onChange={handleTextChange}
                placeholder="Add Content Here..."
              />
            </Box>
          </HStack>
        </Field.Root>
        <div>
          <label>Tags</label>
          TODO: add tags for filtering.
        </div>
        <Center>
          <Button recipe={buttonRecipe} onClick={handleSubmit(onSubmit)}>
            Submit Changes
          </Button>
        </Center>
      </Stack>
    </FloatingFormWrapper>
  )
}
export default EditBlogEntry
