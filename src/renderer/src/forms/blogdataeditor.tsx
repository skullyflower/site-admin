//import { useState } from 'react'
//import { modules, formats } from '../components/quillbits'
import { useForm, UseFormReturn } from 'react-hook-form'
import InfoBubble from '../components/info-bubble'
import { Accordion, Box, Button, Field, Input, HStack, Center, Heading } from '@chakra-ui/react'
import { buttonRecipe } from '@renderer/themeRecipes/button.recipe'
import { BlogInfo } from 'src/shared/types'
import StyledInput from '@renderer/components/StyledInput'

const EditBlogData = ({
  blogInfo,
  onSubmit
}: {
  blogInfo: BlogInfo
  onSubmit: (data: BlogInfo) => void
}): React.JSX.Element => {
  //const { page_content } = blogInfo
  //const [wysiwygText, setWysiwygText] = useState(page_content)

  const {
    register,
    reset,
    handleSubmit,
    formState,
    getValues,
    setValue
  }: UseFormReturn<BlogInfo, unknown, BlogInfo> = useForm({
    defaultValues: blogInfo,
    mode: 'onChange'
  })

  const { errors } = formState

  const handleTextChange = (formfield: keyof BlogInfo) => (newText: string) => {
    setValue(formfield, newText)
  }

  return (
    <Box p={5}>
      <Accordion.Root collapsible>
        <Accordion.Item value="1">
          <Accordion.ItemTrigger>
            <Heading size="md" as="span" flex="1" textAlign="left">
              Edit Blog&apos;s Information
            </Heading>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Field.Root p={4} invalid={errors.page_title ? true : false}>
              <HStack alignItems="center">
                <Field.Label w={48}>
                  Page Title:{' '}
                  <InfoBubble message={`This is the SEO page title for the blog page.`} />
                </Field.Label>
                <Input
                  _invalid={{ borderColor: 'red.300' }}
                  type="text"
                  {...register('page_title', { required: true, validate: (value) => value !== '' })}
                />
              </HStack>
            </Field.Root>
            <Field.Root p={4} invalid={errors.page_description ? true : false}>
              <HStack alignItems="center">
                <Field.Label w={48}>
                  Blog SEO Page Description:{' '}
                  <InfoBubble message="Short description that will show in Google searches. " />
                </Field.Label>
                <Input
                  _invalid={{ borderColor: 'red.300' }}
                  type="text"
                  {...register('page_description', {
                    required: true,
                    validate: (value) => value !== '' && value.length <= 500
                  })}
                />
              </HStack>
            </Field.Root>
            <Field.Root p={4} invalid={errors.page_content ? true : false}>
              <HStack alignItems="top">
                <Field.Label w={40}>Blog page Content:</Field.Label>
                <Box
                  minW="100%"
                  minH={2}
                  border="1px solid gray"
                  borderRadius={5}
                  className="content"
                >
                  <StyledInput
                    value={getValues('page_content')}
                    onChange={handleTextChange('page_content')}
                    placeholder="Add Content Here..."
                  />
                </Box>
              </HStack>
            </Field.Root>
            <Center>
              <HStack gap={4}>
                <Button
                  _invalid={{ borderColor: 'red.300' }}
                  onClick={() => reset({ page_content: blogInfo.page_content })}
                >
                  Never mind
                </Button>
                <Button recipe={buttonRecipe} onClick={handleSubmit(onSubmit)}>
                  Submit Changes
                </Button>
              </HStack>
            </Center>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  )
}
export default EditBlogData
