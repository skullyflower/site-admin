import { Box, Editable, Stack } from '@chakra-ui/react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const StyledInput = ({
  value,
  onChange,
  placeholder = 'Add Content Here...'
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}): React.ReactNode => {
  const [inputValue, setInputValue] = useState<string>(value)
  return (
    <Box borderWidth={1} borderStyle="solid" borderRadius={4} p={2}>
      <Editable.Root
        value={inputValue}
        onValueChange={(e) => setInputValue(e.value)}
        onBlur={() => onChange(inputValue)}
        placeholder={placeholder}
        style={{ whiteSpace: 'pre-wrap' }}
        selectOnFocus={false}
      >
        <Stack borderWidth={1} borderStyle="solid" borderRadius={4} p={2}>
          <ReactMarkdown>{inputValue}</ReactMarkdown>
          <Editable.Preview />
          <Editable.Textarea p={2} />
        </Stack>
      </Editable.Root>
    </Box>
  )
}

export default StyledInput
