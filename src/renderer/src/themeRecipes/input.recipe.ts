import { defineRecipe } from '@chakra-ui/react'

export const inputRecipe = defineRecipe({
  base: {
    borderRadius: '5px',
    border: '2px',
    borderColor: '{colors.slate.500}',
    background: '{colors.gray.900}',
    padding: '5px 10px',
    width: '100%'
  },
  variants: {
    variant: {
      textInput: {
        _invalid: {
          borderColor: '{colors.red.500}',
          background: '{colors.gray.900}'
        }
      }
    }
  },
  defaultVariants: {
    variant: 'textInput'
  }
})
