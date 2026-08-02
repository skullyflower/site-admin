import { useState } from 'react'
import { Button, Collapsible, HStack, Heading } from '@chakra-ui/react'
import { LuChevronRight } from 'react-icons/lu'
import { buttonRecipe } from '@renderer/themeRecipes'

interface ButtonSelectorProps<T extends object> {
  dataList: T[]
  sortProp: keyof T
  valueProp: keyof T
  labelText: string
  onChange: (newValue: string | null) => void
}

function ButtonSelector<T extends object>({
  dataList,
  sortProp,
  valueProp,
  labelText,
  onChange
}: ButtonSelectorProps<T>): React.JSX.Element {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string | null): void => {
    onChange(value)
    setOpen(false)
  }

  return (
    <Collapsible.Root open={open} onOpenChange={(details) => setOpen(details.open)}>
      <Collapsible.Trigger>
        <Heading size="sm" display="flex" alignItems="center" recipe={buttonRecipe}>
          {labelText}{' '}
          <Collapsible.Indicator transition="transform 0.2s" _open={{ transform: 'rotate(90deg)' }}>
            <LuChevronRight />
          </Collapsible.Indicator>
        </Heading>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <HStack
          wrap="wrap"
          alignItems="flex-start"
          justifyContent="center"
          border="1px solid"
          borderRadius={5}
          padding={5}
        >
          {dataList.length > 0 &&
            dataList
              .toSorted((c1, c2) => String(c1[sortProp]).localeCompare(String(c2[sortProp])))
              .map((cat) => (
                <Button
                  key={String(cat[valueProp])}
                  size="xs"
                  minW="fit-content"
                  recipe={buttonRecipe}
                  onClick={() => handleSelect(String(cat[valueProp]))}
                  value={String(cat[valueProp])}
                >
                  {String(cat[sortProp])}
                </Button>
              ))}
          {/* <Button size="sm" recipe={buttonRecipe} onClick={() => handleSelect(null)} value="">
            Show All
          </Button> */}
        </HStack>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
export default ButtonSelector
