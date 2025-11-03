import { defineRecipe } from '@chakra-ui/react'

export const cardRecipe = defineRecipe({
  variants: {
    variant: {
      outline: {
        borderWidth: '2px',
        outlineWidth: '2px',
        borderColor: '{colors.slate.800}'
      }
    }
  }
})
