import { useState } from 'react'
import { useForm } from 'react-hook-form'
import FloatingFormWrapper from '../components/floatingformwrap'
import InfoBubble from '../components/info-bubble'
import { Box, Button, Field, Input, HStack, Center, Heading } from '@chakra-ui/react'
import { buttonRecipe } from '@renderer/themeRecipes'
import StyledInput from '@renderer/components/inputs/StyledInput'
import { Subject } from 'src/shared/types'

const newcat: Subject = { id: '', name: '', description: '', subcat: [] }

interface EditSubjectProps {
  subjectid: string
  subjects: Subject[]
  isOpen: boolean
  toggleSubjectForm: (subjectid: string | null) => void
  onSubmit: (data: Subject) => void
}

export default function EditSubject({
  subjectid,
  subjects,
  isOpen,
  toggleSubjectForm,
  onSubmit
}: EditSubjectProps): React.JSX.Element {
  const cat = subjects[subjects?.findIndex((cat) => cat.id === subjectid)] || newcat
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
    <FloatingFormWrapper isOpen={isOpen} onClose={() => toggleSubjectForm(null)}>
      <HStack justifyContent="space-between">
        <Heading size="md">Add/Edit Product Subjects</Heading>
        <Button onClick={() => toggleSubjectForm(null)}>Never mind</Button>
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
          <Field.Label w={40}>Subject Name:</Field.Label>
          <Input
            _invalid={{ borderColor: 'red.300' }}
            type="text"
            {...register('name', { required: true })}
            width={'100%'}
          />
        </HStack>
      </Field.Root>

      <Field.Root p={1}>
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
