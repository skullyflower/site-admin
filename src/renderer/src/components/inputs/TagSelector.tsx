'use client'

import {
  Combobox,
  TagsInput,
  useCombobox,
  useFilter,
  useListCollection,
  useTagsInput
} from '@chakra-ui/react'
import { useId, useRef } from 'react'

interface TagSelectorProps {
  onChange: (tags: string[]) => void
  tags: string[]
  defaultOptions?: string[]
  label?: string
  placeholder?: string
  allowCustomValue?: boolean
}

const TagSelector = ({
  label,
  tags: currentTags,
  defaultOptions,
  onChange,
  allowCustomValue = false,
  placeholder = 'Add tag...'
}: TagSelectorProps): React.JSX.Element => {
  const { contains } = useFilter({ sensitivity: 'base' })
  const allTagsList = Array.from(
    new Set((defaultOptions || []).filter((t): t is string => Boolean(t)))
  )
  const { collection, filter } = useListCollection({
    initialItems: allTagsList,
    filter: contains
  })

  const inputId = useId()
  const controlRef = useRef<HTMLDivElement | null>(null)

  const tags = useTagsInput({
    ids: { input: inputId },
    defaultValue: currentTags || [],
    onValueChange: (details) => {
      onChange(details.value)
    }
  })

  const comobobox = useCombobox({
    ids: { input: inputId },
    collection,
    onInputValueChange(e) {
      filter(e.inputValue)
    },
    positioning: {
      getAnchorRect() {
        return controlRef.current!.getBoundingClientRect()
      }
    },
    value: currentTags,
    allowCustomValue: allowCustomValue,
    onValueChange: (e: { value: string[] }) => {
      if (e.value[0]) {
        tags.addValue(e.value[0])
      }
    },
    selectionBehavior: 'clear'
  })

  return (
    <Combobox.RootProvider value={comobobox}>
      <TagsInput.RootProvider value={tags}>
        {label && <TagsInput.Label>{label}</TagsInput.Label>}
        <TagsInput.Control ref={controlRef}>
          {tags.value.map((tag, index) => (
            <TagsInput.Item key={`${tag}-${index}`} index={index} value={tag}>
              <TagsInput.ItemPreview>
                <TagsInput.ItemText>{tag}</TagsInput.ItemText>
                <TagsInput.ItemDeleteTrigger />
              </TagsInput.ItemPreview>
            </TagsInput.Item>
          ))}

          <Combobox.Input unstyled asChild>
            <TagsInput.Input placeholder={placeholder} />
          </Combobox.Input>
        </TagsInput.Control>

        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No tags found</Combobox.Empty>
            {collection.items.map((item, index) => (
              <Combobox.Item item={item} key={`${item}-${index}`}>
                <Combobox.ItemText>{item}</Combobox.ItemText>
                <Combobox.ItemIndicator />
              </Combobox.Item>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </TagsInput.RootProvider>
    </Combobox.RootProvider>
  )
}
export default TagSelector
