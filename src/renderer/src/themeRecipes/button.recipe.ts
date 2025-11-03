import { defineRecipe } from '@chakra-ui/react'

export const buttonRecipe = defineRecipe({
  base: {
    transition: 'all 0.3s ease-out',
    borderRadius: '15px',
    border: '2px',
    borderColor: '{colors.slate.500}',
    fontFamily: '"Slackey", "Comic Sans MS", sans-serif',
    fontWeight: 'bold'
  },
  variants: {
    variant: {
      shopButt: {
        color: '{colors.green.500}',
        background: 'gray.900',
        borderRadius: '7px',
        border: '2px',
        borderColor: '{colors.slate.500}',
        fontFamily: '"Slackey", "Comic Sans MS", sans-serif',
        paddingInline: '20px',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        _hover: { bg: 'orange.600' }
      }
    }
  },
  defaultVariants: {
    variant: 'shopButt'
  }
})
