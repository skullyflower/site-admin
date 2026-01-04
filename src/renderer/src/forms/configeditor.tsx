import { Button, Center, Field, Heading, HStack, Checkbox, Fieldset, Text } from '@chakra-ui/react'
import { Stack } from '@chakra-ui/react'
import { AdminConfig } from 'src/shared/types'
import { buttonRecipe } from '@renderer/themeRecipes'

const options = ['blog', 'content', 'galleries', 'products', 'categories', 'subjects', 'sale']

const ConfigForm = ({
  formData,
  setValue,
  onSubmit
}: {
  formData: AdminConfig | null
  setValue: (value: AdminConfig) => void
  onSubmit: () => void
}): React.ReactNode => {
  return (
    <Stack gap={4}>
      <Heading paddingInline={4}>Currently Selected Site Folder:</Heading>
      <Text textAlign="center" paddingInline={4}>
        {formData?.pathToSite || 'No config found'}
      </Text>
      <Field.Root p={4}>
        <HStack alignItems="center">
          <Field.Label w={48}>Select a Site To Edit:</Field.Label>
          <Button
            onClick={() => {
              window.api
                .selectSiteDirectory()
                .then((data: string | unknown) => {
                  if (data && typeof data === 'string') {
                    setValue({ ...formData, pathToSite: data } as AdminConfig)
                  } else {
                    alert('No directory selected')
                  }
                })
                .catch((err: Error) => {
                  alert(err.message || 'Failed to select directory')
                })
            }}
          >
            Select Site Directory
          </Button>
        </HStack>
      </Field.Root>
      <Fieldset.Root p={4}>
        <Fieldset.Legend w={48}>Select Features to Enable:</Fieldset.Legend>
        <Fieldset.Content>
          <Checkbox.Group
            value={formData?.features || []}
            onValueChange={(value: string[]) => {
              setValue({ ...formData, features: value } as AdminConfig)
            }}
          >
            <HStack maxW="1000px" alignItems="stretch" wrap="wrap">
              {options.map((key) => (
                <Checkbox.Root key={key} value={key}>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label>{key}</Checkbox.Label>
                </Checkbox.Root>
              ))}
            </HStack>
          </Checkbox.Group>
        </Fieldset.Content>
      </Fieldset.Root>
      <Center>
        <HStack gap={4}>
          <Button recipe={buttonRecipe} onClick={() => onSubmit()}>
            Submit Changes
          </Button>
        </HStack>
      </Center>
    </Stack>
  )
}
export default ConfigForm
