import { Box } from '@chakra-ui/react'

const FormContainer = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <Box
      width={'100%'}
      maxWidth={'1500px'}
      marginInline={'auto'}
      overflow={'auto'}
      backgroundColor="slate.800"
      borderWidth={2}
      borderStyle="solid"
      borderColor="slate.500"
      p={5}
      borderRadius={5}
    >
      {children}
    </Box>
  )
}

export default FormContainer
