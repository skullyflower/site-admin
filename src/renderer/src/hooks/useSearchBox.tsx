import { useMemo, ReactNode, useState } from 'react'
import { ChangeEvent } from 'react'
import CloseButton from '@renderer/components/ui/CloseButton'
import { HStack, Input } from '@chakra-ui/react'

const useSearchBox = <T,>(
  data?: T[],
  keyFn: (item: T) => string = String
): {
  searchTerm: string
  setSearchTerm: (val: string) => void
  filteredData: T[]
  searchBox: ReactNode
} => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e?.target?.value || '')
  }

  const searchBox = (
    <HStack gap={2} w="full" paddingInline={4}>
      <label htmlFor="search-box">Search:</label>
      <Input name="search-box" onChange={handleChange} value={searchTerm} width="100%" />
      <CloseButton
        onClick={() => handleChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)}
      />
    </HStack>
  )

  const filteredData = useMemo(
    () =>
      data
        ? data.filter((item) => keyFn(item).toLowerCase().includes(searchTerm.toLowerCase()))
        : [],
    [searchTerm, data, keyFn]
  )

  return { searchTerm, setSearchTerm, filteredData, searchBox }
}
export default useSearchBox
