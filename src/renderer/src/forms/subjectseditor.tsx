import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FloatingFormWrapper from '../components/floatingformwrap'
import InfoBubble from '../components/info-bubble'

import { Box, Button, Field, Input, HStack, Center, Heading } from '@chakra-ui/react'

import 'react-quill/dist/quill.bubble.css'
import { buttonRecipe } from '@renderer/themeRecipes'
import StyledInput from '@renderer/components/StyledInput'
import { Subject } from 'src/shared/types'

const newcat: Subject = { id: '', name: '', description: '', subcat: [] }

interface EditSubjectProps {
  catid: string
  subjects: Subject[]
  isOpen: boolean
  toggleCatForm: () => void
  onSubmit: (data: Subject) => void
}

export default function EditSubject({
  catid,
  subjects,
  isOpen,
  toggleCatForm,
  onSubmit
}: EditSubjectProps): React.JSX.Element {
  const cat = subjects[subjects?.findIndex((cat) => cat.id === catid)] || newcat
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

  return (
    <FloatingFormWrapper isOpen={isOpen} onClose={toggleCatForm}>
      <HStack justifyContent="space-between">
        <Heading size="md">Add/Edit Product Subjects</Heading>
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
      <Center>
        <Button recipe={buttonRecipe} onClick={handleSubmit(onSubmit)}>
          Submit Changes
        </Button>
      </Center>
    </FloatingFormWrapper>
  )
}
