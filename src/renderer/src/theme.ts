import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'
import {
  buttonRecipe,
  cardRecipe,
  inputRecipe,
  numberInputRecipe,
  textareaRecipe,
  headingRecipe
} from './themeRecipes'

const colors = {
  green: {
    50: { value: '#F3FBE9' },
    100: { value: '#DEF4C3' },
    200: { value: '#C9ED9C' },
    300: { value: '#B5E675' },
    400: { value: '#A0DF4E' },
    500: { value: '#8BD728' },
    600: { value: '#6FAC20' },
    700: { value: '#538118' },
    800: { value: '#375610' },
    900: { value: '#1C2B08' }
  },
  orange: {
    50: { value: '#FFEFE6' },
    100: { value: '#FED2B8' },
    200: { value: '#FEB58B' },
    300: { value: '#FE985D' },
    400: { value: '#FD7B30' },
    500: { value: '#FD5E02' },
    600: { value: '#CA4B02' },
    700: { value: '#983901' },
    800: { value: '#652601' },
    900: { value: '#331300' }
  },
  gray: {
    50: { value: '#F2F2F3' },
    100: { value: '#DADBDD' },
    200: { value: '#C2C4C7' },
    300: { value: '#AAADB1' },
    400: { value: '#92969A' },
    500: { value: '#7B8084' },
    600: { value: '#62666A' },
    700: { value: '#4A4D4F' },
    800: { value: '#313335' },
    900: { value: '#191A1A' }
  },
  slate: {
    50: { value: '#F0F2F4' },
    100: { value: '#D5DBE1' },
    200: { value: '#BBC4CE' },
    300: { value: '#A0ADBB' },
    400: { value: '#8596A8' },
    500: { value: '#6A7F95' },
    600: { value: '#556677' },
    700: { value: '#404C59' },
    800: { value: '#2B333C' },
    900: { value: '#15191E' }
  }
}

const config = defineConfig({
  theme: {
    recipes: {
      button: buttonRecipe,
      card: cardRecipe,
      input: inputRecipe,
      numberInput: numberInputRecipe,
      textarea: textareaRecipe,
      heading: headingRecipe
    },
    tokens: {
      colors: colors,
      fontSizes: {
        sm: { value: '16px' },
        md: { value: '18px' },
        lg: { value: '20px' }
      },
      fonts: {
        heading: { value: `'Luckiest Guy', sans-serif` },
        body: { value: `'Pangolin', sans-serif` }
      }
    },
    semanticTokens: {
      colors: {
        'bg.body': {
          value: { base: '{colors.blackAlpha.900}' }
        }
      }
    }
  },
  globalCss: {
    body: {
      fontFamily: '"Pangolin", "Comic Sans MS"',
      bg: 'blackAlpha.900',
      color: '#efefef'
    },
    a: {
      fontFamily: 'Slackey',
      color: 'green.500',
      _hover: {
        color: 'orange.600'
      }
    }
  }
})

export const system = createSystem(defaultConfig, config)
