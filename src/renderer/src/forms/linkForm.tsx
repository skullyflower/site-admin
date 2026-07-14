import { useForm, useWatch } from 'react-hook-form'
import * as Icons from '@phosphor-icons/react'
import { buttonRecipe, inputRecipe } from '@renderer/themeRecipes'
import {
  Combobox,
  Field,
  Input,
  HStack,
  Stack,
  Button,
  Switch,
  useListCollection,
  useFilter,
  Box
} from '@chakra-ui/react'
import { ExternalLink } from '../../../shared/types'
const iconlist = Object.keys(Icons)

const LinkForm = ({
  link,
  updateLink,
  deleteLink
}: {
  link: ExternalLink
  updateLink: (link: ExternalLink) => void
  deleteLink: (id: string) => void
}): React.JSX.Element => {
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({ defaultValues: link as ExternalLink, mode: 'onChange' })

  const isMine = useWatch({ control, name: 'isMine' })
  const currentIcon = useWatch({ control, name: 'icon' })
  const SelectedIcon = currentIcon ? Icons[currentIcon] : undefined
  const { contains } = useFilter({ sensitivity: 'base' })

  const { collection, filter } = useListCollection({
    initialItems: iconlist,
    filter: contains
  })

  if (!link) return <div />
  return (
    <Box p={2} border={'1px solid var(--chakra-colors-fg)'} borderRadius={5}>
      <Stack>
        <HStack>
          <Field.Root p={1} invalid={errors.icon ? true : false}>
            <HStack alignItems="center" gap={2} width="100%">
              <Field.Label w={40}>Link Icon:</Field.Label>
              <Combobox.Root
                collection={collection}
                onSelect={(sel) => setValue('icon', sel.itemValue)}
                onInputValueChange={(e) => filter(e.inputValue)}
              >
                <Combobox.Control>
                  <Combobox.Input border={'1px solid'} defaultValue={currentIcon} />
                  <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                  </Combobox.IndicatorGroup>
                </Combobox.Control>
                <Combobox.Positioner>
                  <Combobox.Content>
                    <Combobox.Empty>No items found</Combobox.Empty>
                    {collection.items.map((item) => (
                      <Combobox.Item defaultChecked={currentIcon === item} item={item} key={item}>
                        {item}
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))}
                  </Combobox.Content>
                </Combobox.Positioner>
              </Combobox.Root>
              {SelectedIcon && <SelectedIcon size={24} />}
            </HStack>
          </Field.Root>
          <Field.Root p={1} invalid={errors.text ? true : false}>
            <HStack alignItems="center" gap={2} width="100%">
              <Field.Label w={40}>Link Text:</Field.Label>
              <Input
                recipe={inputRecipe}
                _invalid={{ borderColor: 'red.300' }}
                type="text"
                {...register('text', { required: true, validate: (value) => value !== '' })}
              />
            </HStack>
          </Field.Root>
        </HStack>
        <Field.Root p={1} invalid={errors.url ? true : false}>
          <HStack alignItems="center" gap={2} width="100%">
            <Field.Label w={40}>Link URL:</Field.Label>
            <Input
              recipe={inputRecipe}
              _invalid={{ borderColor: 'red.300' }}
              type="url"
              {...register('url', { required: true, validate: (value) => value !== '' })}
            />
          </HStack>
        </Field.Root>
        <Field.Root p={1}>
          <HStack alignItems="center" gap={2} width="100%">
            <Field.Label w={40}>Is Me:</Field.Label>
            <Switch.Root
              colorPalette="slate"
              checked={!!isMine}
              onCheckedChange={(e) => setValue('isMine', e.checked)}
              label="Is Me"
            >
              <Switch.HiddenInput />
              <Switch.Control bg={isMine ? 'slate.500' : 'slate.300'}>
                <Switch.Thumb bg={isMine ? 'blue.900' : 'blue.100'} />
              </Switch.Control>
            </Switch.Root>
            <Field.HelperText>
              When true this marks the linked site as being your content. You would turn this on for
              your url to social media or content site where you post.
            </Field.HelperText>
          </HStack>
        </Field.Root>
      </Stack>
      <HStack gap={8} justifySelf={'flex-end'}>
        <Button recipe={buttonRecipe} onClick={() => deleteLink(link.id)}>
          Delete
        </Button>
        <Button recipe={buttonRecipe} onClick={handleSubmit(updateLink)}>
          Save
        </Button>
      </HStack>
    </Box>
  )
}
export default LinkForm
