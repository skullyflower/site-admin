import { useEffect, useState } from 'react'
import UploadInput from '../components/inputs/upload-input'
import InfoBubble from '../components/info-bubble'
import {
  Box,
  Button,
  Field,
  Image,
  Input,
  InputGroup,
  HStack,
  Center,
  Heading,
  Switch
} from '@chakra-ui/react'
import FloatingFormWrapper from '../components/floatingformwrap'
import { FieldArrayPath, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { convertDate } from '../components/datetimebit'
import { buttonRecipe } from '@renderer/themeRecipes'
const today = new Date()
import { ProductType, CategoryType, Subject } from 'src/shared/types'
import StyledInput from '@renderer/components/inputs/StyledInput'
import TagSelector from '@renderer/components/inputs/TagSelector'
import imageLoading from '@renderer/assets/image-loading.svg'

const newprodId = 'new-prod-id'
const newproduct = {
  id: newprodId,
  date: convertDate(today, 'input'), // default to current date
  name: '',
  price: 0,
  img: '',
  altimgs: [],
  desc: '',
  desc_long: '',
  cat: [],
  weight: 0,
  handling: 0,
  newImage: []
}

interface EditProductProps {
  isOpen: boolean
  prodId: string
  products: ProductType[]
  categories: CategoryType[]
  subjects: Subject[]
  toggleForm: (productId: string | null) => void
  onSubmit: (data: ProductType) => void
}
export default function EditProduct({
  isOpen,
  prodId,
  products,
  categories,
  subjects,
  toggleForm,
  onSubmit
}: EditProductProps): React.JSX.Element {
  const prodToLoan = !prodId
    ? null
    : prodId.endsWith('-copy')
      ? prodId.replace('-copy', '')
      : prodId
  const selectedProduct = !prodToLoan
    ? newproduct
    : products.find((prod) => prod.id === prodToLoan) || newproduct
  const [wysiwygText, setWysiwygText] = useState(selectedProduct.desc)
  const [wysiwygText2, setWysiwygText2] = useState(selectedProduct.desc_long)
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm<ProductType>({ defaultValues: selectedProduct, mode: 'onChange' })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'altimgs' as FieldArrayPath<ProductType>
  })
  const thumb = useWatch({ control, name: 'img' })
  const soldout = useWatch({ control, name: 'soldout' })
  const prodCategories = useWatch({ control, name: 'cat' })
  const prodSubjects = useWatch({ control, name: 'design' })
  const handleTextChange = (formfield) => (newText) => {
    setValue(formfield, newText)
    if (formfield === 'desc') {
      setWysiwygText(newText)
    } else {
      setWysiwygText2(newText)
    }
  }

  const handleImageUpload =
    (key: keyof ProductType) =>
    (paths: string[]): void => {
      if (paths.length > 0) {
        if (key === 'img') {
          const prodImage = `/shop/${paths[0].split('/').pop()}`
          setValue('img', prodImage)
        } else {
          const altimgs = getValues('altimgs')
          const newAltImgs = paths.map((path) => `/shop/${path.split('/').pop()}`)
          setValue('altimgs', [...altimgs, ...newAltImgs])
        }
      }
    }

  useEffect(() => {
    if (prodId?.endsWith('-copy')) {
      setValue('id', prodId)
      const today = new Date()
      setValue('date', convertDate(today, 'input'))
    }
  }, [prodId, setValue])

  return (
    <FloatingFormWrapper isOpen={isOpen} onClose={() => toggleForm(null)}>
      <HStack justifyContent="space-between">
        <Heading size="md">Add/Edit Product</Heading>
        <Button recipe={buttonRecipe} onClick={() => toggleForm(null)}>
          Never mind
        </Button>
      </HStack>
      <Field.Root p={1} invalid={errors.id ? true : false}>
        <HStack width={'100%'}>
          <Field.Label w={40}>
            Id:
            <InfoBubble
              message={`Product ids must be unique, and should be descriptive. Ex: "med-blue-widget"`}
            />
          </Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('id', { required: true, validate: (value) => value !== newprodId })}
            width={'100%'}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={1} invalid={errors.date ? true : false}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Date:</Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="datetime-local"
            {...register('date', { required: true })}
            width={'100%'}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={1} invalid={errors.name ? true : false}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Product Name:</Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('name', { required: true })}
            width={'100%'}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={1} invalid={errors.price ? true : false}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Price:</Field.Label>
          <InputGroup startAddon="$">
            <Input
              _invalid={{ borderColor: 'red.300' }}
              type="number"
              {...register('price', { required: true, pattern: /^[0-9]{0,4}[.]?[0-9]{0,2}$/ })}
              width={'100%'}
            />
          </InputGroup>
        </HStack>
      </Field.Root>
      <Field.Root p={1}>
        <Field.Label w={40}>Product Image:</Field.Label>
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
              <Field.Label w={40}>Upload New Image</Field.Label>
              <HStack alignItems="top" width={'100%'}>
                <UploadInput multiple={false} onUpload={handleImageUpload('img')} />
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
                  src={`http://localhost:3000/shop/${thumb}`}
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
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Alt Images:</Field.Label>
          <UploadInput multiple={true} onUpload={handleImageUpload('altimgs')} />
          {fields.map((field, index) => (
            <span key={field.id}>
              <InputGroup
                startElement={
                  <Button recipe={buttonRecipe} onClick={() => remove(index)}>
                    X
                  </Button>
                }
              >
                <Input type="text" {...register(`altimgs.${index}`)} />
              </InputGroup>
            </span>
          ))}
          <div>
            <Button recipe={buttonRecipe} onClick={() => append('')}>
              Add
            </Button>
          </div>
        </HStack>
      </Field.Root>
      <Field.Root p={1}>
        <HStack alignItems="top" width={'100%'}>
          <Field.Label w={40}>Description:</Field.Label>
          <Box width={'100%'} minH={2} border="1px solid gray" borderRadius={5} className="content">
            <StyledInput
              value={wysiwygText}
              onChange={handleTextChange('desc')}
              placeholder="Add Description Here..."
            />
          </Box>
        </HStack>
      </Field.Root>
      <Field.Root p={1} invalid={errors.desc_long ? true : false}>
        <HStack alignItems="top" width={'100%'}>
          <Field.Label w={40}>Detail:</Field.Label>
          <Box width={'100%'} minH={2} border="1px solid gray" borderRadius={5} className="content">
            <StyledInput value={wysiwygText2} onChange={handleTextChange('desc_long')} />
          </Box>
        </HStack>
      </Field.Root>
      <Field.Root p={1}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>
            External Link?: <InfoBubble message={`Used for T-Shirts and other external Products`} />
          </Field.Label>
          <Input type="url" {...register('externalLink')} width={'100%'} />
        </HStack>
      </Field.Root>
      <Field.Root p={1}>
        <HStack alignItems="top" width={'100%'}>
          <Field.Label w={40}>Categories:</Field.Label>
          <TagSelector
            onChange={(tags: string[]) => setValue('cat', tags)}
            value={prodCategories}
            defaultOptions={categories.map((c) => c.id)}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={1}>
        <HStack alignItems="top" width={'100%'} gap={2}>
          <Field.Label w={40}>Subjects:</Field.Label>
          <TagSelector
            onChange={(tags: string[]) => setValue('design', tags)}
            value={prodSubjects}
            defaultOptions={subjects.map((c) => c.id)}
          />
        </HStack>
      </Field.Root>
      <Field.Root p={1}>
        <HStack alignItems="center" width={'100%'}>
          <Field.Label w={40}>Extra Handling:</Field.Label>
          <InputGroup startAddon="$" _invalid={{ borderColor: 'red.300' }} width={'100%'}>
            <Input
              className={errors.handling ? 'is-invalid' : ''}
              type="number"
              {...register('handling', { pattern: /^[0-9]{0,4}[.]?[0-9]{0,2}$/ })}
              width={'100%'}
            />
          </InputGroup>
        </HStack>
      </Field.Root>
      <Field.Root p={1}>
        <HStack>
          <Field.Label w={40}>Sold Out?:</Field.Label>
          <Switch.Root
            colorPalette="slate"
            checked={!!soldout}
            onCheckedChange={(e) => setValue('soldout', e.checked)}
            label="Sold Out"
          >
            <Switch.HiddenInput />
            <Switch.Control bg={soldout ? 'slate.500' : 'slate.300'}>
              <Switch.Thumb bg={soldout ? 'blue.900' : 'blue.100'} />
            </Switch.Control>
          </Switch.Root>
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
