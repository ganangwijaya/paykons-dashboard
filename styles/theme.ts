import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  components: {
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
      }
    },
    Tooltip: {
      baseStyle: {
        fontSize: '0.60rem',
        fontWeight: 'bold',
      }
    },
  },
  colors: {
    blue: {
      50: "#E9ECFB",
      100: "#C2CAF4",
      200: "#9BA8EE",
      300: "#7486E7",
      400: "#4D64E0",
      500: "#2642D9",
      600: "#1E35AE",
      700: "#172882",
      800: "#0F1A57",
      900: "#080D2B"
    },
    chartBlue: '#2642D9',
    chartRed: '#E01F1F',
  },
})

export default theme