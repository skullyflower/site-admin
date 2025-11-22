import { Box, Editable, Heading, Link, List, Stack, Text } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useEffect } from 'react'

const StyledInput = ({
  value,
  onChange,
  placeholder = 'Add Content Here...'
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}): React.ReactNode => {
  const [inputValue, setInputValue] = useState<string>(value)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const previewRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!isEditing) {
      onChange(inputValue)
    }
  }, [inputValue, isEditing, onChange])

  return (
    <Box
      borderWidth={1}
      borderStyle="solid"
      borderRadius={4}
      p={2}
      width="100%"
      borderColor="slate.500"
      position="relative"
      overflow="hidden"
    >
      <Box
        width="100%"
        position="absolute"
        p={2}
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={isEditing ? 0 : 5}
        onClick={() => {
          previewRef.current?.focus()
          setIsEditing(true)
        }}
        backgroundColor="gray.900"
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <Heading as="h1" fontSize="2xl">
                {children}
              </Heading>
            ),
            h2: ({ children }) => (
              <Heading as="h2" fontSize="xl">
                {children}
              </Heading>
            ),
            h3: ({ children }) => (
              <Heading as="h3" fontSize="lg">
                {children}
              </Heading>
            ),
            h4: ({ children }) => (
              <Heading as="h4" fontSize="md">
                {children}
              </Heading>
            ),
            h5: ({ children }) => (
              <Heading as="h5" fontSize="sm">
                {children}
              </Heading>
            ),
            h6: ({ children }) => (
              <Heading as="h6" fontSize="xs">
                {children}
              </Heading>
            ),
            p: ({ children }) => <Text>{children}</Text>,
            ul: ({ children }) => <List.Root>{children}</List.Root>,
            ol: ({ children }) => <List.Root>{children}</List.Root>,
            li: ({ children }) => <List.Item>{children}</List.Item>,
            a: ({ children, href }) => (
              <Link color="blue.500" href={href} target="_blank">
                {children}
              </Link>
            )
          }}
        >
          {inputValue}
        </ReactMarkdown>
      </Box>

      <Editable.Root
        value={inputValue}
        onValueChange={(e) => setInputValue(e.value)}
        onBlur={() => onChange(inputValue)}
        placeholder={placeholder}
        style={{ whiteSpace: 'pre-wrap', zIndex: 1 }}
        p={0}
      >
        <Stack borderWidth={1} borderStyle="solid" borderRadius={4} width="100%">
          <Editable.Preview
            ref={previewRef}
            p={2}
            borderColor="slate.500"
            borderWidth={1}
            backgroundColor="gray.900"
          />
          <Editable.Textarea
            p={2}
            borderColor="slate.500"
            width="100%"
            backgroundColor="gray.900"
            minH="-moz-fit-content"
            onBlur={() => setIsEditing(false)}
          />
        </Stack>
      </Editable.Root>
    </Box>
  )
}

export default StyledInput
