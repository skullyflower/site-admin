'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { ColorModeProvider, ColorModeProviderProps } from './color-mode'
import { system } from '@renderer/theme'

export function Provider(props: ColorModeProviderProps): React.ReactElement {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
