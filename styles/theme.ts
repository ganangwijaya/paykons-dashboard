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
    Modal: {
      baseStyle: {
        overlay: {
          bg: 'blackAlpha.700',
          backdropFilter: 'blur(5px)',
        }
      }
    }
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
  shadows: {
    green: '0 0 0 2px #38A169',
    darkGreen: '0 0 0 2px #38A169, rgba(56, 161, 105, 0.1) 0px 0px 0px 1px, rgba(56, 161, 105, 0.4) 0px 0px 15px 3px',
    red: '0 0 0 2px #E53E3E',
    darkRed: '0 0 0 2px #E53E3E, rgba(229, 62, 62, 0.1) 0px 0px 0px 1px, rgba(229, 62, 62, 0.4) 0px 0px 15px 3px',
  }
})

export default theme