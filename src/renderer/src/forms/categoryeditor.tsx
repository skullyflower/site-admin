import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FloatingFormWrapper from '../components/floatingformwrap'
import UploadInput from '../components/upload-input'
import InfoBubble from '../components/info-bubble'

import {
  Box,
  Button,
  Checkbox,
  Field,
  Image,
  Input,
  HStack,
  Center,
  Heading
} from '@chakra-ui/react'

import { CategoryType } from 'src/shared/types'
import StyledInput from '@renderer/components/StyledInput'
import { buttonRecipe } from '@renderer/themeRecipes'

const newcat: CategoryType = {
  id: '',
  name: '',
  img: '',
  description: '',
  subcat: [],
  newImage: []
}

interface EditCategoryProps {
  catid: string
  categories: CategoryType[]
  isOpen: boolean
  toggleCatForm: () => void
  onSubmit: (data: CategoryType) => void
}
export default function EditCategory({
  catid,
  categories,
  isOpen,
  toggleCatForm,
  onSubmit
}: EditCategoryProps): React.JSX.Element {
  const cat = categories[categories?.findIndex((cat) => cat.id === catid)] || newcat
  const [wysiwygText, setWysiwygText] = useState(cat.description)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ defaultValues: cat, mode: 'onChange' })

  const handleTextChange = (formfield) => (newText) => {
    setValue(formfield, newText)
    setWysiwygText(newText)
  }

  const handleImageUpload = (paths: string[]): void => {
    if (paths.length > 0) {
      const catImage = `/shop/categories/${paths[0].split('/').pop()}`
      setValue('img', catImage)
    }
  }

  return (
    <FloatingFormWrapper isOpen={isOpen} onClose={toggleCatForm}>
      <HStack justifyContent="space-between">
        <Heading size="md">Add/Edit Product Categories</Heading>
        <Button onClick={toggleCatForm}>Never mind</Button>
      </HStack>
      <Field.Root p={4} invalid={errors.id ? true : false}>
        <HStack alignItems="center">
          <Field.Label w={40}>
            Id:{' '}
            <InfoBubble message='Ids must be unique, and should be descriptive. Example: "widgets"' />
          </Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('id', { required: true, validate: (value) => value !== '' })}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4} invalid={errors.name ? true : false}>
        <HStack alignItems="center">
          <Field.Label w={40}>Category Name:</Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('name', { required: true })}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={4}>
        <HStack alignItems="top">
          <Field.Label w={40}>Category Image:</Field.Label>
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
                <Field.Label w={40}>Upload New Image</Field.Label>
                <UploadInput multiple={false} onUpload={handleImageUpload} />
              </HStack>
            </Field.Root>
            <Field.Root p={4} invalid={errors.img ? true : false}>
              <HStack alignItems="center">
                <Field.Label w={40}>
                  Or edit image url:{' '}
                  <InfoBubble message="You can edit the image url to be a different image you have uploaded in the past. You can also use an image from a different website. (This value will be overwritten if you select an image to upload.)" />
                </Field.Label>
                <Input _invalid={{ borderColor: 'red.300' }} type="text" {...register('img')} />
                <Image
                  src={`http://localhost:3000/shop/GROUPS/${cat.img}`}
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
      <Field.Root p={4}>
        <HStack alignItems="top">
          <Field.Label w={40}>Description:</Field.Label>
          <Box
            width={'100%'}
            flexGrow={3}
            minH={2}
            borderWidth={1}
            borderStyle="solid"
            borderRadius={5}
            className="content"
          >
            <StyledInput
              value={wysiwygText}
              onChange={handleTextChange('description')}
              placeholder="Add Description Here..."
            />
          </Box>
        </HStack>
      </Field.Root>
      <Field.Root p={4}>
        <HStack alignItems="top">
          <Field.Label w={40}>
            Sub-Categories:{' '}
            <InfoBubble
              message="Do not select anything here unless you want to make this category a container for
                  other categories. Example: 'Stationary' might contain 'Pens' and 'Papers'."
            />
          </Field.Label>
          <HStack
            width={'100%'}
            borderWidth={1}
            borderStyle="solid"
            p={5}
            borderRadius={5}
            wrap="wrap"
          >
            {categories
              .filter((c) => c.id !== cat.id)
              .map((c) => {
                return (
                  <Box key={c.id} p={2}>
                    <Checkbox.Root {...register(`subcat`)} value={c.id}>
                      {c.id}
                    </Checkbox.Root>
                  </Box>
                )
              })}
          </HStack>
        </HStack>
      </Field.Root>
      <Center>
        <Button recipe={buttonRecipe} onClick={handleSubmit(onSubmit)}>
          Submit Changes
        </Button>
      </Center>
    </FloatingFormWrapper>
  )
}
