import { Box } from '@chakra-ui/react'

const FormContainer = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return (
    <Box
      w={['95vw', '93vw', '88vw', '85vw', '1000px']}
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
