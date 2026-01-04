import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FloatingFormWrapper from '../components/floatingformwrap'
import UploadInput from '../components/inputs/upload-input'
import InfoBubble from '../components/info-bubble'
import imageLoading from '@renderer/assets/image-loading.svg'
import { Box, Button, Field, Image, Input, HStack, Center, Heading } from '@chakra-ui/react'

import { CategoryType } from 'src/shared/types'
import StyledInput from '@renderer/components/inputs/StyledInput'
import { buttonRecipe } from '@renderer/themeRecipes'
import TagSelector from '@renderer/components/inputs/TagSelector'

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
      <Field.Root p={1} invalid={errors.id ? true : false}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>
            Id:{' '}
            <InfoBubble message='Ids must be unique, and should be descriptive. Example: "widgets"' />
          </Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('id', { required: true, validate: (value) => value !== '' })}
            width={'100%'}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={1} invalid={errors.name ? true : false}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Category Name:</Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('name', { required: true })}
            width={'100%'}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={1}>
        <Field.Label w={40}>Category Image:</Field.Label>
        <HStack alignItems="top" width={'100%'}>
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
              <HStack alignItems="top" width={'100%'}>
                <Field.Label w={40}>Upload New Image</Field.Label>
                <UploadInput multiple={false} onUpload={handleImageUpload} />
              </HStack>
            </Field.Root>
            <Field.Root p={1} invalid={errors.img ? true : false}>
              <HStack alignItems="center" width={'100%'}>
                <Field.Label w={40}>
                  Or edit image url:{' '}
                  <InfoBubble message="You can edit the image url to be a different image you have uploaded in the past. You can also use an image from a different website. (This value will be overwritten if you select an image to upload.)" />
                </Field.Label>
                <Input
                  _invalid={{ borderColor: 'red.300' }}
                  type="text"
                  {...register('img')}
                  width={'100%'}
                />
                <Image
                  src={`http://localhost:3000/shop/GROUPS/${cat.img}`}
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
      <Field.Root p={1}>
        <Field.Label w={40}>Description:</Field.Label>
        <HStack alignItems="top" width={'100%'}>
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
      <Field.Root p={1}>
        <HStack alignItems="top" width={'100%'}>
          <InfoBubble
            message="Do not select anything here unless you want to make this category a container for
                  other categories. Example: 'Stationary' might contain 'Pens' and 'Papers'."
          />
          <TagSelector
            label="Sub-Categories:"
            defaultOptions={categories.filter((c) => c.id !== cat.id).map((c) => c.id)}
            value={cat.subcat}
            onChange={(values: string[]) => setValue('subcat', values)}
            allowCustomValue
          />
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
