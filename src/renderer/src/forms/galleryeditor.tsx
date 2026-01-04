import { useEffect, useState } from 'react'
import InfoBubble from '../components/info-bubble'
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Field,
  HStack,
  Input,
  Heading
} from '@chakra-ui/react'
import FloatingFormWrapper from '../components/floatingformwrap'
import { useForm, useWatch } from 'react-hook-form'
import { newGalleryId } from '../pages/galleriespage'
import { GalleryInfo } from 'src/shared/types'
import StyledInput from '@renderer/components/StyledInput'
import { buttonRecipe } from '@renderer/themeRecipes'

interface EditGalleryProps {
  selectedGallery: GalleryInfo
  isOpen: boolean
  toggleForm: () => void
}
export default function EditGallery({
  selectedGallery,
  isOpen,
  toggleForm
}: EditGalleryProps): React.JSX.Element {
  const [wysiwygText, setWysiwygText] = useState(selectedGallery.content)

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm({ defaultValues: selectedGallery, mode: 'onChange' })

  const handleTextChange = () => (newText) => {
    setValue('content', newText)
    setWysiwygText(newText)
  }

  const path = useWatch({ control, name: 'path' })
  useEffect(() => {
    if (path) {
      setValue('json_path', `/data/${path}.json`)
    }
  }, [path, setValue])

  const onSubmit = (data: GalleryInfo): void => {
    window.api.updateGallery(data)
    toggleForm()
  }

  return (
    <FloatingFormWrapper isOpen={isOpen} onClose={toggleForm}>
      <Box>
        <Flex justifyContent="space-between">
          <Heading size="md">Add/Edit Gallery Information</Heading>
          <Button onClick={toggleForm}>Never mind</Button>
        </Flex>
        <Field.Root p={4} invalid={errors.id ? true : false}>
          <HStack>
            <Field.Label w={40}>
              Id:
              <InfoBubble
                message={`Gallery Id is used in the URL and should be descriptive. Ex: "papercraft"`}
              />
            </Field.Label>
            <Input
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('id', { required: true, validate: (value) => value !== newGalleryId })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4} invalid={errors.title ? true : false}>
          <HStack>
            <Field.Label w={40}>Title:</Field.Label>
            <Input
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('title', { required: true })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4} invalid={errors.path ? true : false}>
          <HStack>
            <Field.Label w={40}>
              Path to Image Files:
              <InfoBubble message={`Relative to /public/`} />
            </Field.Label>
            <Input
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('path', { required: true })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4} invalid={errors.json_path ? true : false}>
          <HStack>
            <Field.Label w={40}>
              Path to Images Json File: <InfoBubble message={`Relative to public/data/`} />
            </Field.Label>
            <Input
              placeholder="/data/{galleryKey}.json"
              _invalid={{ borderColor: 'red.300' }}
              type="text"
              {...register('json_path', { required: true })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={4}>
          <HStack alignItems="top">
            <Field.Label w={48}>Gallery Description Content:</Field.Label>
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
                value={wysiwygText || ''}
                onChange={handleTextChange()}
                placeholder="Add Content Here..."
              />
            </Box>
          </HStack>
        </Field.Root>

        <Field.Root p={4}>
          <HStack>
            <Field.Label w={40}>
              Id of related Product: <InfoBubble message={`Optional, mostly for comics.`} />
            </Field.Label>
            <Input _invalid={{ borderColor: 'red.300' }} type="text" {...register('linked_prod')} />
          </HStack>
        </Field.Root>
        <Field.Root p={4}>
          <HStack>
            <Field.Label w={40}>
              Sort Old to new: <InfoBubble message={`Optional, mostly for comic stories.`} />
            </Field.Label>
            <Checkbox.Root {...register('isStory')}>
              <Checkbox.HiddenInput />
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
            </Checkbox.Root>
          </HStack>
        </Field.Root>
        <Center>
          <Button recipe={buttonRecipe} onClick={handleSubmit(onSubmit)}>
            Submit Changes
          </Button>
        </Center>
      </Box>
    </FloatingFormWrapper>
  )
}
