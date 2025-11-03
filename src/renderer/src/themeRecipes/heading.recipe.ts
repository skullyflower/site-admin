import { defineRecipe } from '@chakra-ui/react'

export const headingRecipe = defineRecipe({
  base: {
    color: '{colors.slate.300}',
    fontFamily: `'Luckiest Guy', sans-serif`,
    textShadow: '2px 2px 5px black',
    fontWeight: 'normal'
  }
})
